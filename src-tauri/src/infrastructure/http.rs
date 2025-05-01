use async_trait::async_trait;
use serde::de::DeserializeOwned;

#[async_trait]
pub trait HttpClient: Send + Sync {
    async fn get_json<T: DeserializeOwned>(&self, url: &str) -> Result<T, String>;
    async fn get_bytes(&self, url: &str) -> Result<Vec<u8>, String>;
}

pub struct ReqwestHttpClient {
    client: reqwest::Client,
}

impl Default for ReqwestHttpClient {
    fn default() -> Self {
        Self {
            client: reqwest::Client::new(),
        }
    }
}

#[async_trait]
impl HttpClient for ReqwestHttpClient {
    async fn get_json<T: DeserializeOwned>(&self, url: &str) -> Result<T, String> {
        self.client
            .get(url)
            .send()
            .await
            .map_err(|e| e.to_string())?
            .json()
            .await
            .map_err(|e| e.to_string())
    }

    async fn get_bytes(&self, url: &str) -> Result<Vec<u8>, String> {
        self.client
            .get(url)
            .send()
            .await
            .map_err(|e| e.to_string())?
            .bytes()
            .await
            .map(|b| b.to_vec())
            .map_err(|e| e.to_string())
    }
}
