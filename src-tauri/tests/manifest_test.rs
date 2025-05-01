// use mmcl_lib::{
//     domains::manifest::version_manifest::{ManifestFetcher, MojangManifestFetcher, VersionManiest},
//     infrastructure::http::ReqwestHttpClient,
// };
//
// #[tokio::test]
// async fn test_fetch_manifest() -> Result<(), Box<dyn std::error::Error>> {
// let response = reqwest::Client::new()
//     .get("http://launchermeta.mojang.com/mc/game/version_manifest.json")
//     .send()
//     .await?;
//
// assert_eq!(response.status(), 200);
//
// let manifest_resp: VersionManiest = response.json().await?;
// assert_eq!(manifest_resp.latest.release, "1.21.5".to_string());
// assert_eq!(manifest_resp.versions[0].id, "25w17a".to_string());

// 解析功能测试
// let reqwestClien = ReqwestHttpClient::default();
// let mojang = MojangManifestFetcher::new(
//     reqwestClien,
//     "http://launchermeta.mojang.com/mc/game/version_manifest.json",
// );
// let data = mojang.fetch().await?;
// assert_eq!(data.latest.release, manifest_resp.latest.release);
//
// Ok(())
// }
