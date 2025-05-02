// 游戏资源
// assets 文件内的文件
// indexes
// objects
// skins // 后面加

use std::collections::HashMap;
use std::io::Write;
use std::path::Path;

use serde::Deserialize;

use crate::domains::error::DomainsError;
use crate::infrastructure::download::DownLoad;
use crate::infrastructure::{ sha1};
use crate::infrastructure::parse::Parse;


/// 请求这个地址获取的反序列化
/// https://piston-meta.mojang.com/v1/packages/{sha1}/{version}.json
#[derive(Debug, Deserialize,Clone)]
pub struct AssetIndex {
    pub id: String,
    pub sha1: String,
    pub size: u32,
    #[serde(alias = "totalSize")]
    pub total_size: u32,
    pub url: String,
}

#[derive(Debug, Deserialize)]
pub struct Index {
    pub objects: HashMap<String, Object>,
}
#[derive(Debug, Deserialize)]
pub struct Object {
    pub hash: String,
    pub size: u32,
}

impl Parse<&str> for AssetIndex {
    type Error = DomainsError;

    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<AssetIndex>(value)?;
        Ok(json_str)
    }
}

#[async_trait::async_trait]
impl DownLoad for AssetIndex{
    async fn download(&self, game_dir: &Path) -> Result<(), DomainsError> {
        let download_id = &self.id; 
        let index_dir = &game_dir.join("assets").join("indexes");
        if !index_dir.exists(){
            tokio::fs::create_dir_all(index_dir).await?;
        }

        // 构建路径
        let path = &index_dir.join(format!("{}.json",download_id));
        tokio::fs::File::create(path).await?;

        let url = &self.url;
        let text =reqwest::get(url).await?.text().await?;

if let Some(parent_dir) = path.parent() {
    tokio::fs::create_dir_all(parent_dir).await?;
}
        // 写入文件
        tokio::fs::write(path, &text).await?;

        // Index 写入
        let index = Index::parse(&text)?;
        let object_dir = &game_dir.join("assets").join("objects");
        if !object_dir.exists(){
            tokio::fs::create_dir_all(object_dir).await?;
        }

        let mut tasks = Vec::new();
        for (_,value)in index.objects{
            let hash = value.hash.clone();
            // 将hash前两位做成一个字符串
            let hash_first_two = hash.chars().take(2).collect::<String>();

            let first_two_dir = &object_dir.join(&hash_first_two);
            if !first_two_dir.exists(){
                tokio::fs::create_dir_all(&first_two_dir).await?;
            }

            let path = first_two_dir.join(&hash);
            let url = format!("https://resources.download.minecraft.net/{}/{}",&hash_first_two,&hash);

            tasks.push(tokio::spawn(async move {
                if path.exists(){
                    let path_clone = path.clone();
                    let actual_sha = tokio::task::spawn_blocking(move || sha1(&path_clone)).await
                    .map_err(|e| DomainsError::from(e))?
                    .map_err(|e| DomainsError::from(e))?;
                    if actual_sha == hash {
                        return Ok::<_,DomainsError>(());
                    }else{
                        tokio::fs::remove_file(&path).await?;
                    }
                }
                let bytes = reqwest::get(&url).await?.bytes().await?;
                tokio::fs::write(&path, bytes).await?;

                Ok::<_,DomainsError>(())
            }));
        }
            futures::future::join_all(tasks).await.into_iter().collect::<Result<Vec<_>,_>>()?;
        Ok(())
    }
}

impl Parse<&str> for Index {
    type Error = DomainsError;

    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<Index>(value)?;
        Ok(json_str)
    }
}

impl Parse<&str> for Object {
    type Error = DomainsError;

    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<Object>(value)?;
        Ok(json_str)
    }
}




#[cfg(test)]
mod tests {

    use std::env::temp_dir;

    use tempfile::{tempdir, tempdir_in};

    use super::*;
    #[test]
    fn test_asset_index() {
        let test_data = 
            r#"{
        "id": "24",
        "sha1": "604b8d2c363db3eabc4e446747c49567958cc20e",
        "size": 482192,
        "totalSize": 407310433,
        "url": "https://piston-meta.mojang.com/v1/packages/604b8d2c363db3eabc4e446747c49567958cc20e/24.json"
    }"#
        .to_string();
        let asset_index =
            AssetIndex::parse(&test_data).unwrap_or_else(|e| panic!("{:?}",e.to_string()));

        assert_eq!(asset_index.id, "24".to_string());
        assert_eq!(
            asset_index.sha1,
            "604b8d2c363db3eabc4e446747c49567958cc20e".to_string()
        );
        assert_eq!(asset_index.size, 482192);
        assert_eq!(asset_index.total_size, 407310433);
        assert_eq!(asset_index.url,"https://piston-meta.mojang.com/v1/packages/604b8d2c363db3eabc4e446747c49567958cc20e/24.json");
    }

    #[test]
    fn test_index(){
    let test_data = r#"{
        "objects":{
            "icons/icon_128x128.png": {
                "hash": "b62ca8ec10d07e6bf5ac8dae0c8c1d2e6a1e3356",
                "size": 9101
                }
            }
        }"#.to_string();

        let index = Index::parse(&test_data).unwrap_or_else(|e| panic!("{:?}",e.to_string()));
        assert_eq!(index.objects.get("icons/icon_128x128.png").unwrap().hash,"b62ca8ec10d07e6bf5ac8dae0c8c1d2e6a1e3356");
        assert_eq!(index.objects.get("icons/icon_128x128.png").unwrap().size,9101)
    }

    #[tokio::test]
    #[ignore="asset_index_download"]
    async fn test_download_asset_index(){
        let asset_index = AssetIndex{
            id: "24".to_string(),
            sha1: "604b8d2c363db3eabc4e446747c49567958cc20e".to_string(),
            size: 482192,
            total_size: 407310433,
            url: "https://piston-meta.mojang.com/v1/packages/604b8d2c363db3eabc4e446747c49567958cc20e/24.json".to_string(),
        };
        let temp_dir = tempdir().unwrap();

        let download_dir =temp_dir.path();
        tokio::fs::create_dir_all(download_dir).await.unwrap_or_else(|e| panic!("{}",e));

        if  let Err(e) = asset_index.download(download_dir).await {
            panic!("{:?}",e);
        }
    }

}
