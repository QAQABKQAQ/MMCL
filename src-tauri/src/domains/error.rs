use std::string::ParseError;

use thiserror::Error;
use tokio::task::JoinError;

#[derive(Debug, Error)]
pub enum DomainsError {
    #[error("Network error: {0}")]
    Network(#[from] reqwest::Error),

    #[error("Serde Json Error :  {0}")]
    SerdeJsonError(#[from] serde_json::Error),

    #[error("Tauri error : {0}")]
    TauriError(#[from] tauri::Error),

    #[error("Invalid SHA1 checksum")]
    ChecksumMismatch,

    #[error("ErrorMessages : {0}")]
    AnyErrorString(String),

    #[error("IO error: {0}")]
    IOError(#[from] std::io::Error),

    #[error("Parse error : {0}")]
    ParseError(#[from] ParseError),

    #[error("Other error : {0}")]
    Other(#[source] Box<dyn std::error::Error + Send + Sync>),
}

impl From<JoinError> for DomainsError {
    fn from(e: JoinError) -> Self {
        DomainsError::Other(Box::new(e))
    }
}
