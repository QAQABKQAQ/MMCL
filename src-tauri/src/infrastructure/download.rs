use std::path::Path;

use crate::domains::error::DomainsError;

#[async_trait::async_trait]
pub trait DownLoad {
    async fn download(&self, game_dir: &Path) -> Result<(), DomainsError>;
}

pub trait LibraryAllowed {
    fn allowed(&self) -> bool;
}
