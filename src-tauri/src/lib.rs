pub mod domains;
pub mod infrastructure;

use std::sync::Arc;

use infrastructure::http::HttpClient;
use serde_json::Value;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//
//
//
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_mc_version() -> Result<String, String> {
    let response = reqwest::get("https://launchermeta.mojang.com/mc/game/version_manifest.json")
        .await
        .map_err(|e| e.to_string())?;

    let json: Value = response.json::<Value>().await.map_err(|e| e.to_string())?;

    Ok(json.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
