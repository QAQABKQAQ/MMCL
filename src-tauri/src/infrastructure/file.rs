use std::{fs, path::Path};

pub trait FileStore {
    fn write(&self, path: &Path, content: &[u8]) -> Result<(), String>;
}

///写入
pub struct LocalFileStore;

impl FileStore for LocalFileStore {
    fn write(&self, path: &Path, content: &[u8]) -> Result<(), String> {
        // 父级目录
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }

        fs::write(path, content).map_err(|e| e.to_string());

        Ok(())
    }
}
