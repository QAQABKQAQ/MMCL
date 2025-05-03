use std::path::Path;

use sha1::Digest;

use crate::domains::error::DomainsError;

pub mod download;
pub mod file;
pub mod http;
pub mod parse;

/// 获取文件哈希
pub fn sha1<P: AsRef<Path>>(path: P) -> Result<String, DomainsError> {
    let mut hasher = sha1::Sha1::new();
    let data = file_hashing::get_hash_file(path, &mut hasher)?;
    Ok(data)
}
