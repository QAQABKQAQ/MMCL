use std::path::Path;

use crate::domains::{error::DomainsError, manifest::version_manifest::Progress};

#[async_trait::async_trait]
pub trait DownLoad {
    async fn download(
        &self,
        game_dir: &Path,
        progress_tx: tokio::sync::mpsc::Sender<Progress>,
    ) -> Result<(), DomainsError>;
}

pub trait LibraryAllowed {
    fn allowed(&self) -> bool;
}
