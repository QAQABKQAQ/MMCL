use thiserror::Error;

#[derive(Debug, Error)]
pub enum DomainsError {
    #[error("Network error: {0}")]
    Network(#[from] reqwest::Error),

    #[error("Serde Json Error :  {0}")]
    SerdeJsonError(#[from] serde_json::Error),

    #[error("Invalid SHA1 checksum")]
    ChecksumMismatch,

    #[error("ErrorMessages : {0}")]
    AnyErrorString(String),
}
