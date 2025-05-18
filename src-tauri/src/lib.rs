pub mod domains;
pub mod infrastructure;

use std::{env::args_os, path::Path};

use domains::{
    error::DomainsError,
    manifest::{version::Version, version_manifest::VersionManiest},
};
use infrastructure::{
    download::{DownLoad, LibraryAllowed},
    parse::Parse,
};
use reqwest::Client;
use serde::{Deserialize, Serialize};
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

#[derive(Debug, Serialize, Deserialize)]
pub struct DownloadArgs {
    pub version: String,
}
#[tauri::command]
async fn download(args: DownloadArgs) -> Result<(), DomainsError> {
    let game_dir =
        std::env::current_dir().map_err(|e| DomainsError::AnyErrorString(e.to_string()))?;
    let game_dir = game_dir.join(".minecraft");

    let versions = get_mc_version().await?;
    let (tx, mut _rx) = tokio::sync::mpsc::channel(100);
    if let Some(version) = versions.versions.iter().find(|v| v.id == args.version) {
        version.download(&game_dir, tx).await?;
    } else {
        return Err(DomainsError::VersionNotFound);
    }

    Ok(())
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ArgsVersion {
    pub version: String,
}
#[tauri::command]
async fn launch(game_version: ArgsVersion) -> Result<(), DomainsError> {
    // game_dir = ./minecraft
    // library_dir = ./minecraft/libraries
    // asset_dir = ./minecraft/asset
    let game_dir = std::env::current_dir()?;
    let game_dir = game_dir.join(".minecraft");

    let library_dir = game_dir.join("libraries");
    let asset_dir = game_dir.join("assets");

    // version_dir = ./minecraft/version/<version>
    // nattive_dir = ./minecraft/version/<version>/natives
    // config_path = ./minecraft/version/<version>/<version>.json
    // veresion_path = ./minecraft/version/<version>/<version>.jar
    let version = game_version.version;
    let version_dir = game_dir.join("versions").join(version.clone());
    let native_dir = version_dir.join("natives");
    let config_path = version_dir.join(format!("{}.json", version.clone()));
    let version_path = version_dir.join(format!("{}.jar", version.clone()));

    if !version_path.exists() || !config_path.exists() {
        println!("Version: {} not found ", version_path.display());
        return Err(DomainsError::AnyErrorString(
            "Version not found".to_string(),
        ));
    }
    // get verion
    let version = &Version::parse(&std::fs::read_to_string(&config_path).unwrap())?;

    for the_library in &version.libraries {
        if the_library.allowed() && the_library.name.contains("natives") {
            // 解压natives文件
            extract_jar(
                &library_dir.join(&the_library.downloads.artifact.path),
                &native_dir,
            )
            .await?;
        }
    }

    let claspath = format!(
        "{}{}",
        &version
            .libraries
            .iter()
            .map(|library| {
                format!(
                    "{}{}",
                    library_dir.join(&library.downloads.artifact.path).display(),
                    if cfg!(windows) { ";" } else { ":" }
                )
            })
            .collect::<String>(),
        version_path.display()
    );

    std::process::Command::new("java")
        .current_dir(&game_dir)
        .arg(format!("-Djava.library.path={}", native_dir.display()))
        .arg("-Dminecraft.launcher.brand=rmcl")
        .arg("-cp")
        .arg(claspath)
        .arg(&version.main_class)
        .arg("--username")
        .arg("Enaium")
        .arg("--version")
        .arg(&version.id)
        .arg("--gameDir")
        .arg(game_dir)
        .arg("--assetIndex")
        .arg(&version.asset_index.id)
        .arg("-accessToken")
        .arg("0")
        .arg("--versionType")
        .arg("MMCL 0.1.0")
        .status()?;
    Ok(())
}

async fn extract_jar(jar: &Path, dir: &Path) -> Result<(), DomainsError> {
    if !dir.exists() {
        std::fs::create_dir_all(dir)?;
    }
    let mut archive = zip::ZipArchive::new(std::fs::File::open(jar)?)?;

    for i in 0..archive.len() {
        let mut entry = archive.by_index(i)?;
        if entry.is_file() && !entry.name().contains("META-INF") {
            let mut name = entry.name();
            if name.contains("/") {
                name = &name[entry
                    .name()
                    .rfind('/')
                    .ok_or(DomainsError::AnyErrorString("索引出错".to_string()))?
                    + 1..];
            }
            let path = dir.join(name);
            if path.exists() {
                std::fs::remove_file(&path)?;
            }
            let mut file = std::fs::File::create(&path)?;
            std::io::copy(&mut entry, &mut file)?;
        }
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_mc_version, download])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
