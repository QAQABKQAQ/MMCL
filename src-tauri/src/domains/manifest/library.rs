use serde::Deserialize;

use crate::{domains::error::DomainsError, infrastructure::parse::Parse};

#[derive(Debug, Deserialize)]
pub struct Library {
    pub downloads: LibraryDownload,
    pub name: String,
    pub rules: Option<Vec<Rule>>,
}
impl Parse<&str> for Library {
    type Error = DomainsError;
    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<Library>(value)?;
        Ok(json_str)
    }
}

#[derive(Debug, Deserialize)]
pub struct Rule {
    pub action: String,
    pub os: Os,
}
impl Parse<&str> for Rule {
    type Error = DomainsError;
    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<Rule>(value)?;
        Ok(json_str)
    }
}

#[derive(Debug, Deserialize)]
pub struct Os {
    pub name: String,
}
impl Parse<&str> for Os {
    type Error = DomainsError;
    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<Os>(value)?;
        Ok(json_str)
    }
}

#[derive(Debug, Deserialize)]
pub struct LibraryDownload {
    pub artifact: Artiface,
}
impl Parse<&str> for LibraryDownload {
    type Error = DomainsError;
    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<LibraryDownload>(value)?;
        Ok(json_str)
    }
}

#[derive(Debug, Deserialize)]
pub struct Artiface {
    pub path: String,
    pub sha1: String,
    pub size: i32,
    pub url: String,
}
impl Parse<&str> for Artiface {
    type Error = DomainsError;
    fn parse(value: &str) -> Result<Self, Self::Error> {
        let json_str = serde_json::from_str::<Artiface>(value)?;
        Ok(json_str)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_library() {
        let test_json = r#"
        {
            "downloads": {
                "artifact": {
                    "path": "ca/weblite/java-objc-bridge/1.1/java-objc-bridge-1.1.jar",
                    "sha1": "1227f9e0666314f9de41477e3ec277e542ed7f7b",
                    "size": 1330045,
                    "url": "https://libraries.minecraft.net/ca/weblite/java-objc-bridge/1.1/java-objc-bridge-1.1.jar"
                }
            },
            "name": "ca.weblite:java-objc-bridge:1.1",
            "rules": [
                {
                    "action": "allow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        }
        "#.to_string();
        let json_str = Library::parse(&test_json).unwrap_or_else(|e| panic!("{:?}", e.to_string()));

        assert_eq!(
            json_str.downloads.artifact.path,
            "ca/weblite/java-objc-bridge/1.1/java-objc-bridge-1.1.jar"
        );
        assert_eq!(
            json_str.downloads.artifact.sha1,
            "1227f9e0666314f9de41477e3ec277e542ed7f7b"
        );
        assert_eq!(json_str.downloads.artifact.size, 1330045);
        assert_eq!(json_str.downloads.artifact.url,"https://libraries.minecraft.net/ca/weblite/java-objc-bridge/1.1/java-objc-bridge-1.1.jar");
        assert_eq!(json_str.name, "ca.weblite:java-objc-bridge:1.1");
        let rules = &json_str.rules.unwrap();
        assert_eq!(rules[0].action, "allow");
        assert_eq!(rules[0].os.name, "osx");
    }
}
