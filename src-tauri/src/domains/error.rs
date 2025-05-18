use core::str;
use std::{fmt::Display, string::ParseError};

use serde::{Deserialize, Serialize};
use thiserror::Error;
use tokio::task::JoinError;

use super::manifest::version_manifest::Progress;

///Error用from自动转化
#[derive(Debug, Error, Serialize)]
pub enum DomainsError {
    #[error("Network error: {0}")]
    NetwordError(MMCLReqwestError),
    // Network(#[from] reqwest::Error),
    #[error("Serde Json Error :  {0}")]
    SerdeJsonError(MMCLSerdeError),
    // SerdeJsonError(#[from] serde_json::Error),
    #[error("Tauri error : {0}")]
    TauriError(MMCLTauriError),
    // TauriError(#[from] tauri::Error),
    #[error("Invalid SHA1 checksum")]
    ChecksumMismatch,

    #[error("ErrorMessages : {0}")]
    AnyErrorString(String),

    #[error("IO error: {0}")]
    IOError(MMCLIOError),
    // IOError(#[from] std::io::Error),
    #[error("Parse error : {0}")]
    ParseError(MMCLParseError),
    // ParseError(#[from] ParseError),
    #[error("Other error : {0}")]
    OtherError(MMCLOtherError), // Other(#[source] Box<dyn std::error::Error + Send + Sync>),
    #[error("Minecraft Version Not Found")]
    VersionNotFound,

    #[error("Zip archive error : {0}")]
    ZipError(MMCLZipError),
}

//│    required for `Result<(), DomainsError>` to implement `FromResidual<Result<Infallible, ZipError>>` rustc (E0277) [111, 70]
impl Display for MMCLZipError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.messages)
    }
}

impl From<zip::result::ZipError> for DomainsError {
    fn from(value: zip::result::ZipError) -> Self {
        DomainsError::ZipError(MMCLZipError::from(value))
    }
}

impl From<reqwest::Error> for DomainsError {
    fn from(value: reqwest::Error) -> Self {
        DomainsError::NetwordError(MMCLReqwestError::from(value))
    }
}
impl From<serde_json::Error> for DomainsError {
    fn from(value: serde_json::Error) -> Self {
        DomainsError::SerdeJsonError(MMCLSerdeError::from(value))
    }
}
impl From<tauri::Error> for DomainsError {
    fn from(value: tauri::Error) -> Self {
        DomainsError::TauriError(MMCLTauriError::from(value))
    }
}
impl From<std::io::Error> for DomainsError {
    fn from(value: std::io::Error) -> Self {
        DomainsError::IOError(MMCLIOError::from(value))
    }
}
impl From<ParseError> for DomainsError {
    fn from(value: ParseError) -> Self {
        DomainsError::ParseError(MMCLParseError::from(value))
    }
}
impl From<tokio::sync::mpsc::error::SendError<Progress>> for DomainsError {
    fn from(e: tokio::sync::mpsc::error::SendError<Progress>) -> Self {
        DomainsError::AnyErrorString(e.to_string())
    }
}
impl From<JoinError> for DomainsError {
    fn from(e: JoinError) -> Self {
        DomainsError::OtherError(MMCLOtherError::from(e))
    }
}

impl From<Box<dyn std::error::Error + Send + Sync>> for DomainsError {
    fn from(value: Box<dyn std::error::Error + Send + Sync>) -> Self {
        DomainsError::OtherError(MMCLOtherError::from(value))
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MMCLZipError {
    pub messages: String,
}
impl From<zip::result::ZipError> for MMCLZipError {
    fn from(value: zip::result::ZipError) -> Self {
        MMCLZipError {
            messages: value.to_string(),
        }
    }
}
#[derive(Debug, Serialize, Deserialize)]
pub struct MMCLReqwestError {
    pub message: String,
    pub status: Option<u16>,
    pub url: Option<String>,
}
impl From<reqwest::Error> for MMCLReqwestError {
    fn from(value: reqwest::Error) -> Self {
        MMCLReqwestError {
            message: value.to_string(),
            status: value.status().map(|v| v.as_u16()),
            url: value.url().map(|v| v.to_string()),
        }
    }
}
impl Display for MMCLReqwestError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "({}, {:?}, {:?})", self.message, self.status, self.url)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MMCLSerdeError {
    pub message: String,
    pub line: usize,
    pub colum: usize,
}
impl From<serde_json::Error> for MMCLSerdeError {
    fn from(value: serde_json::Error) -> Self {
        MMCLSerdeError {
            message: value.to_string(),
            line: value.line(),
            colum: value.column(),
        }
    }
}
impl Display for MMCLSerdeError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{},{},{}", self.message, self.line, self.colum)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MMCLIOError {
    pub message: String,
    pub kind: String,
}
impl From<std::io::Error> for MMCLIOError {
    fn from(value: std::io::Error) -> Self {
        MMCLIOError {
            message: value.to_string(),
            kind: value.kind().to_string(),
        }
    }
}
impl Display for MMCLIOError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{},{}", self.message, self.kind)
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct MMCLTauriError {
    pub message: String,
}
impl From<tauri::Error> for MMCLTauriError {
    fn from(value: tauri::Error) -> Self {
        MMCLTauriError {
            message: value.to_string(),
        }
    }
}
impl Display for MMCLTauriError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MMCLParseError {
    pub message: String,
}

impl From<ParseError> for MMCLParseError {
    fn from(e: ParseError) -> Self {
        MMCLParseError {
            message: e.to_string(),
        }
    }
}

impl std::fmt::Display for MMCLParseError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MMCLOtherError {
    pub message: String,
}

impl From<Box<dyn std::error::Error + Send + Sync>> for MMCLOtherError {
    fn from(e: Box<dyn std::error::Error + Send + Sync>) -> Self {
        MMCLOtherError {
            message: e.to_string(),
        }
    }
}

impl std::fmt::Display for MMCLOtherError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl From<JoinError> for MMCLOtherError {
    fn from(e: JoinError) -> Self {
        MMCLOtherError {
            message: e.to_string(),
        }
    }
}
