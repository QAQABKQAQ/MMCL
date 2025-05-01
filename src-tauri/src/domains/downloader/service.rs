use async_trait::async_trait;
use sha1::Digest;

use crate::infrastructure::{file::FileStore, http::HttpClient};

use super::task::DownloadTask;

#[async_trait]
pub trait DownloaderHandler: Send + Sync {
    async fn handler(&self, task: &DownloadTask) -> Result<(), String>;
}

pub struct DefaultDownloaderHandler<H: HttpClient, F: FileStore> {
    http_client: H,
    file_store: F,
}

#[async_trait]
impl<H: HttpClient + Send + Sync, F: FileStore + Send + Sync> DownloaderHandler
    for DefaultDownloaderHandler<H, F>
{
    async fn handler(&self, task: &DownloadTask) -> Result<(), String> {
        // 下载内容
        let content = self
            .http_client
            .get_bytes(&task.url)
            .await
            .map_err(|e| e.to_string())?;

        // 哈希验证
        if let Some(sha1) = &task.sha1 {
            let mut hasher = sha1::Sha1::new();
            hasher.update(&content);
            let hex_hash = format!("{:x}", hasher.finalize()); //十六进制

            if hex_hash != *sha1 {
                return Err("SHA1 mismatch".to_string());
            }
        }
        // 保存文件
        self.file_store
            .write(&task.destination, &content)
            .map_err(|e| e.to_string())?;

        Ok(())
    }
}
