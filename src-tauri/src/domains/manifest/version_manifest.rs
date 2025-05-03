use std::sync::Arc;

/// http://launchermeta.mojang.com/mc/game/version_manifest.json
///
/// 获取版本所有版本地址的反序列化
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use tokio::sync::Semaphore;

use crate::{
    domains::error::DomainsError,
    infrastructure::{download::DownLoad, http::HttpClient, parse::Parse, sha1},
};

use super::version::Version as v_Version;

#[derive(Debug, Deserialize, Serialize)]
pub struct VersionManiest {
    pub latest: Latest,
    pub versions: Vec<Version>,
}
impl Parse<&str> for VersionManiest {
    type Error = DomainsError;

    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<VersionManiest>(value)?;
        Ok(json_str)
    }
}
#[derive(Debug, Deserialize, Serialize)]
pub struct Latest {
    pub release: String,
    pub snapshot: String,
}

impl Parse<&str> for Latest {
    type Error = DomainsError;

    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<Latest>(value)?;
        Ok(json_str)
    }
}
#[derive(Debug, Deserialize, Serialize)]
pub struct Version {
    pub id: String,
    #[serde(alias = "type")]
    pub verion_type: String,

    //https://piston-meta.mojang.com/v1/packages/{sha1}/{version}.json
    //https://piston-meta.mojang.com/v1/packages/3bd9a435263080a3131582cf56884f8bfd9c2d26/1.21.5.json
    pub url: String,

    pub time: String,
    #[serde(alias = "releaseTime")]
    pub release_time: String,
}

impl Parse<&str> for Version {
    type Error = DomainsError;

    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<Version>(value)?;
        Ok(json_str)
    }
}

#[async_trait::async_trait]
impl DownLoad for Version {
    async fn download(&self, game_dir: &std::path::Path) -> Result<(), DomainsError> {
        let client = reqwest::Client::new();

        let game = client
            .get(&self.url)
            .send()
            .await?
            .json::<v_Version>()
            .await?;

        let version_dir = game_dir.join("versions").join(&self.id);
        if !version_dir.exists() {
            tokio::fs::create_dir_all(&version_dir).await?;
        }

        let semaphore = Arc::new(Semaphore::new(10));

        let mut tasks = Vec::new();
        for library in &game.libraries {
            let client = client.clone();
            let version_dir = version_dir.clone();
            let library = library.clone();
            let semaphore = Arc::clone(&semaphore);

            tasks.push(tokio::spawn(async move {
                let _permit = semaphore.acquire().await.unwrap();

                let library_file = version_dir.join(&library.name);
                if !library_file.exists() {
                    let bytes = client
                        .get(&library.downloads.artifact.url)
                        .send()
                        .await?
                        .bytes()
                        .await?;

                    tokio::fs::write(&library_file, bytes).await?;
                }

                Ok::<(), DomainsError>(())
            }));
        }

        let results = futures::future::join_all(tasks).await;
        for result in results {
            result??; // 先解包 JoinError，再解包 Result
        }

        game.asset_index.download(&version_dir).await?;

        let version_config = version_dir.join(format!("{}.json", self.id));
        if version_config.exists() {
            tokio::fs::remove_file(&version_config).await?;
        }
        let config_bytes = client.get(&self.url).send().await?.bytes().await?;
        tokio::fs::write(&version_config, config_bytes).await?;

        let jar_path = version_dir.join(format!("{}.jar", &self.id));
        if jar_path.exists() {
            let expected_sha = &game.downloads.client.sha1;
            let jar_path_clone = jar_path.clone();

            let actual_sha = tokio::task::spawn_blocking(move || sha1(&jar_path_clone)).await??;

            if actual_sha == *expected_sha {
                return Ok(());
            } else {
                tokio::fs::remove_file(&jar_path).await?;
            }
        }

        let jar_bytes = client
            .get(&game.downloads.client.url)
            .send()
            .await?
            .bytes()
            .await?;
        tokio::fs::write(&jar_path, jar_bytes).await?;

        Ok(())
    }
}
#[async_trait]
pub trait ManifestFetcher {
    // 获取
    async fn fetch(&self) -> Result<VersionManiest, DomainsError>;
}

pub struct MojangManifestFetcher<H: HttpClient> {
    http_client: H,
    manifest_url: String,
}

impl<H: HttpClient> MojangManifestFetcher<H> {
    pub fn new(http_client: H, manifest_url: &str) -> Self {
        Self {
            http_client,
            manifest_url: manifest_url.to_string(),
        }
    }
}

#[async_trait]
impl<H> ManifestFetcher for MojangManifestFetcher<H>
where
    H: HttpClient,
{
    //将请求结果反序列化后返回
    async fn fetch(&self) -> Result<VersionManiest, DomainsError> {
        let response = self
            .http_client
            .get_json(&self.manifest_url)
            .await
            .map_err(|e| DomainsError::AnyErrorString(e.to_string()))?;
        Ok(response)
    }
}
#[cfg(test)]
mod tests {

    use super::*;
    use tempfile::tempdir;
    #[test]
    fn test_version() {
        let test_json = r#"
        {
            "id": "1.21.5",
            "type": "release",
            "url": "https://piston-meta.mojang.com/v1/packages/3bd9a435263080a3131582cf56884f8bfd9c2d26/1.21.5.json",
            "time": "2025-04-22T07:24:10+00:00",
            "releaseTime": "2025-03-25T12:14:58+00:00"
        }
        "#;
        let version = Version::parse(test_json).unwrap_or_else(|e| panic!("{}", e.to_string()));
        assert_eq!(version.id, "1.21.5");
        assert_eq!(version.verion_type, "release");
        assert_eq!(version.url, "https://piston-meta.mojang.com/v1/packages/3bd9a435263080a3131582cf56884f8bfd9c2d26/1.21.5.json");
        assert_eq!(version.time, "2025-04-22T07:24:10+00:00");
        assert_eq!(version.release_time, "2025-03-25T12:14:58+00:00");
    }

    #[test]
    fn test_latest() {
        let test_json = r#"
        {
            "release": "1.21.5",
            "snapshot": "25w17a"
        }
        "#;
        let latest = Latest::parse(test_json).unwrap_or_else(|e| panic!("{}", e.to_string()));

        assert_eq!(latest.release, "1.21.5");
        assert_eq!(latest.snapshot, "25w17a");
    }

    #[test]
    fn test_manifest() {
        let test_json = r#"
        {
            "latest": {
                "release": "1.21.5",
                "snapshot": "25w17a"
        },
            "versions": [
                {
                    "id": "25w17a",
                    "type": "snapshot",
                    "url": "https://piston-meta.mojang.com/v1/packages/b0b639d40ca10ef21f714eb801222e033680e17d/25w17a.json",
                    "time": "2025-04-22T13:01:57+00:00",
                    "releaseTime": "2025-04-22T12:51:30+00:00"
                }
            ]
        }
        "#;
        let manifest =
            VersionManiest::parse(test_json).unwrap_or_else(|e| panic!("{}", e.to_string()));
        assert_eq!(manifest.latest.release, "1.21.5");
        assert_eq!(manifest.latest.snapshot, "25w17a");
        assert_eq!(manifest.versions[0].id, "25w17a");
        assert_eq!(manifest.versions[0].verion_type, "snapshot");
        assert_eq!(manifest.versions[0].url,"https://piston-meta.mojang.com/v1/packages/b0b639d40ca10ef21f714eb801222e033680e17d/25w17a.json");
        assert_eq!(manifest.versions[0].time, "2025-04-22T13:01:57+00:00");
        assert_eq!(
            manifest.versions[0].release_time,
            "2025-04-22T12:51:30+00:00"
        );
    }

    #[tokio::test]
    #[ignore = "version_dowanload"]
    async fn test_version_download() {
        let version = Version {
        id: "1.21.5".to_string(),
        verion_type: "release".to_string(),
        url: "https://piston-meta.mojang.com/v1/packages/6b71b27b37490915c5f31a1705d6f6171114b93c/1.21.5.json".to_string(),
        time: "2025-04-29T06:40:02+00:00".to_string(),
        release_time: "2025-03-25T12:14:58+00:00".to_string(),
    };

        let temp_dir = tempdir().unwrap();

        let download_path = temp_dir.path();
        // let download_path = std::env::temp_dir().join("rust-minecraft-client-launch");

        if download_path.exists() {
            tokio::fs::remove_dir_all(&download_path)
                .await
                .unwrap_or_default();
        }

        tokio::fs::create_dir_all(&download_path).await.unwrap();

        if let Err(err) = version.download(download_path).await {
            panic!("下载出错{:?}", err);
        }
    }
}
