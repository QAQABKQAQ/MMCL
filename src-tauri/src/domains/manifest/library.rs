use serde::{Deserialize, Serialize};

use crate::{
    domains::error::DomainsError,
    infrastructure::{
        download::{DownLoad, LibraryAllowed},
        parse::Parse,
        sha1,
    },
};

use super::{version::Libraries, version_manifest::Progress};

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct Library {
    pub downloads: LibraryDownload,
    pub name: String,
    pub rules: Option<Vec<Rule>>,
}
impl Parse<&str> for Library {
    type Error = DomainsError;
    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<Library>(value)?;
        Ok(json_str)
    }
}
impl LibraryAllowed for Library {
    fn allowed(&self) -> bool {
        let mut allow = true;
        if let Some(rules) = &self.rules {
            for rule in rules {
                let os_allowed = match rule.os.name.as_str() {
                    "osx" => cfg!(target_os = "macos"),
                    "linux" => cfg!(target_os = "linux"),
                    "windows" => cfg!(target_os = "windows"),
                    _ => true,
                };
                if !os_allowed {
                    allow = false;
                    break;
                }
            }
        }
        if self.name.contains("natives") {
            let arch_allowed = if self.name.contains("x86") {
                // self.name.contains("x86")
                cfg!(target_arch = "x86")
            } else if self.name.contains("arm64") {
                // self.name.contains("arm64")
                cfg!(target_arch = "aarch64")
            } else {
                // self.name.contains("x86_64")
                cfg!(target_arch = "x86_64")
            };
            if !arch_allowed {
                allow = false;
            }
        }

        allow
    }
}

#[async_trait::async_trait]
impl DownLoad for Libraries {
    async fn download(
        &self,
        game_dir: &std::path::Path,

        progress_tx: tokio::sync::mpsc::Sender<Progress>,
    ) -> Result<(), DomainsError> {
        let library_dir = &game_dir.join("libraries");
        if !library_dir.exists() {
            tokio::fs::create_dir_all(library_dir).await?;
        }

        for library in self {
            if !library.allowed() {
                continue;
            }
            let library_file = &library.downloads.artifact.path;

            let library_path = library_dir.join(library_file);
            // 创建父目录
            if let Some(parent_dir) = library_path.parent() {
                tokio::fs::create_dir_all(parent_dir).await?;
            }
            if library_path.exists() {
                let library_path_clone = library_path.clone();
                let expected_sha = &library.downloads.artifact.sha1;
                let actual_sha =
                    tokio::task::spawn_blocking(move || sha1(&library_path_clone)).await??;
                if actual_sha == *expected_sha {
                    continue;
                } else {
                    tokio::fs::remove_file(&library_path).await?;
                }
            }

            let url = &library.downloads.artifact.url;
            let bytes = reqwest::get(url).await?.bytes().await?;
            tokio::fs::write(&library_path, bytes).await?
        }

        Ok(())
    }
}

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct Rule {
    pub action: String,
    pub os: Os,
}
impl Parse<&str> for Rule {
    type Error = DomainsError;
    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<Rule>(value)?;
        Ok(json_str)
    }
}

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct Os {
    pub name: String,
}
impl Parse<&str> for Os {
    type Error = DomainsError;
    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<Os>(value)?;
        Ok(json_str)
    }
}

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct LibraryDownload {
    pub artifact: Artiface,
}
impl Parse<&str> for LibraryDownload {
    type Error = DomainsError;
    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<LibraryDownload>(value)?;
        Ok(json_str)
    }
}

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct Artiface {
    pub path: String,
    pub sha1: String,
    pub size: i32,
    pub url: String,
}
impl Parse<&str> for Artiface {
    type Error = DomainsError;
    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<Artiface>(value)?;
        Ok(json_str)
    }
}

#[cfg(test)]
mod tests {
    use std::panic;

    use tempfile::tempdir;

    use crate::domains::manifest::version::Version;

    use super::*;

    #[test]
    fn test_library() {
        let test_json = r#"
        {
            "downloads": {
                "artifact": {
                    "path": "ca/weblite/java-objc-bridge/1.1/java-objc-bridge-1.1.jar",
                    "sha1": "1227f9e0666314f9de41477e3ec277e542ed7f7b",
                    "size": 1330045,
                    "url": "https://libraries.minecraft.net/ca/weblite/java-objc-bridge/1.1/java-objc-bridge-1.1.jar"
                }
            },
            "name": "ca.weblite:java-objc-bridge:1.1",
            "rules": [
                {
                    "action": "allow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        }
        "#.to_string();
        let json_str = Library::parse(&test_json).unwrap_or_else(|e| panic!("{:?}", e.to_string()));

        assert_eq!(
            json_str.downloads.artifact.path,
            "ca/weblite/java-objc-bridge/1.1/java-objc-bridge-1.1.jar"
        );
        assert_eq!(
            json_str.downloads.artifact.sha1,
            "1227f9e0666314f9de41477e3ec277e542ed7f7b"
        );
        assert_eq!(json_str.downloads.artifact.size, 1330045);
        assert_eq!(json_str.downloads.artifact.url,"https://libraries.minecraft.net/ca/weblite/java-objc-bridge/1.1/java-objc-bridge-1.1.jar");
        assert_eq!(json_str.name, "ca.weblite:java-objc-bridge:1.1");
        let rules = &json_str.rules.unwrap();
        assert_eq!(rules[0].action, "allow");
        assert_eq!(rules[0].os.name, "osx");
    }

    #[tokio::test]
    #[ignore = "library_download"]
    async fn library_download() {
        let test_sha1 = "3bd9a435263080a3131582cf56884f8bfd9c2d26".to_string();
        let test_version = "1.21.5".to_string();
        let test_data = format!(
            "https://piston-meta.mojang.com/v1/packages/{}/{}.json",
            test_sha1, test_version
        );
        let client = reqwest::Client::new();
        let response = client
            .get(&test_data)
            .send()
            .await
            .unwrap_or_else(|e| panic!("{}", e));
        let game = response
            .json::<Version>()
            .await
            .unwrap_or_else(|e| panic!("{}", e));
        // let game = reqwest::blocking::get(&test_data)
        //     .unwrap_or_else(|e| panic!("请求出错{:?},原始请求链接{}", e, &test_data))
        //     .json::<Version>()
        //     .unwrap_or_else(|e| panic!("序列化出错{:?}", e));
        //

        let temp_dir = tempdir().unwrap();

        let download_path = temp_dir.path();
        // let download_path = &std::env::temp_dir().join("rust-minecraft-client-launch");
        tokio::fs::create_dir_all(download_path)
            .await
            .unwrap_or_else(|e| panic!("{}", e));

        let (tx, mut _rx) = tokio::sync::mpsc::channel(100);
        if let Err(error) = game.libraries.download(download_path, tx).await {
            panic!("{:?}", error);
        }
    }
}
