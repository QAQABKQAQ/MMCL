// 暂时弃用

use std::path::PathBuf;

use async_trait::async_trait;

use crate::domains::error::DomainsError;

#[derive(Debug)]
pub struct DownloadTask {
    pub url: String,
    pub destination: PathBuf,
    pub sha1: Option<String>,
}

#[async_trait]
pub trait FileDownloader: Send + Sync {
    async fn download(&self, task: &DownloadTask) -> Result<(), DomainsError>;
}

impl DownloadTask {
    pub fn new(url: &str, destination: PathBuf, sha1: Option<&str>) -> Self {
        Self {
            url: url.to_string(),
            destination,
            sha1: sha1.map(|s| s.to_string()),
        }
    }
}
