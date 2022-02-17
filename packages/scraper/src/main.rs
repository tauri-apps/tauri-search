use std::path::PathBuf;

use anyhow::Result;
use clap::Parser;
use tokio::fs;

#[derive(Parser)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// The URL to inspect
    url: String,

    #[clap(short, long)]
    /// the file where JSON results will be saved
    output: Option<PathBuf>,

    #[clap(short, long)]
    /// Follow document into child links
    follow: Option<bool>,

    #[clap(long)]
    /// Show the structs discovered
    structs: Option<bool>,
}
pub mod document;
pub mod elements;
use document::Document;

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();
    let doc = Document::new(&args.url)
        .load_document()
        .await?
        .to_rust_doc()
        .add_generic_selectors();
    let results = serde_json::to_string(&doc.results()).unwrap();
    println!("Parsed {} ", &args.url);

    match args.output {
        Some(v) => {
            fs::write(&v, results).await?;
        }
        _ => (),
    }

    Ok(())
}
