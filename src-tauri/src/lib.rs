pub mod domains;
pub mod infrastructure;

use domains::{error::DomainsError, manifest::version_manifest::VersionManiest};
use reqwest::Client;
use tauri::async_runtime;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//
//
//
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_mc_version() -> Result<VersionManiest, DomainsError> {
    let client = Client::new();
    let response = async_runtime::spawn(async move {
        client
            .get("https://launchermeta.mojang.com/mc/game/version_manifest.json")
            .send()
            .await
    })
    .await??;
    let json: VersionManiest =
        async_runtime::spawn(async move { response.json::<VersionManiest>().await }).await??;

    Ok(json)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_mc_version])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
