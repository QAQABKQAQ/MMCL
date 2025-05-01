///https://piston-meta.mojang.com/v1/packages/{sha1}/{version}.json
///这个地址的反序列化
use std::str;

use serde::Deserialize;

use crate::{domains::error::DomainsError, infrastructure::parse::Parse};

use super::{asset::AssetIndex, library::Library};

pub type Libraries = Vec<Library>;
// 注释的是没有反序列化的字段
#[derive(Deserialize)]
pub struct Version {
    // arguments:
    #[serde(alias = "assetIndex")]
    pub asset_index: AssetIndex,
    // assets
    // complianceLevel
    pub downloads: Download,
    pub id: String,
    // javaVersion
    pub libraries: Libraries,
    // logging
    #[serde(alias = "mainClass")]
    pub main_class: String,
    // minimumLauncherVersion
    #[serde(alias = "releaseTime")]
    pub release_time: String,
    pub time: String,
    #[serde(alias = "type")]
    pub type_: String,
}
impl Parse<&str> for Version {
    type Error = DomainsError;

    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<Version>(value)?;
        Ok(json_str)
    }
}

#[derive(Debug, Deserialize)]
pub struct Download {
    pub client: VersionClient,
    //client_mappings
    //server
    //server_mappings
}

impl Parse<&str> for Download {
    type Error = DomainsError;

    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<Download>(value)?;
        Ok(json_str)
    }
}
#[derive(Debug, Deserialize)]
pub struct VersionClient {
    pub sh1: String,
    pub size: u32,
    pub url: String,
}

impl Parse<&str> for VersionClient {
    type Error = DomainsError;

    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<VersionClient>(value)?;
        Ok(json_str)
    }
}
