// 游戏资源
// assets 文件内的文件
// indexes
// objects
// skins // 后面加

use std::collections::HashMap;

use serde::Deserialize;

use crate::domains::error::DomainsError;
use crate::infrastructure::parse::Parse;


/// 请求这个地址获取的反序列化
/// https://piston-meta.mojang.com/v1/packages/{sha1}/{version}.json
#[derive(Debug, Deserialize)]
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

}
