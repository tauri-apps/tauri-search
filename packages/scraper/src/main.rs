use std::path::PathBuf;

use anyhow::Result;
use clap::Parser;
use tokio::fs;

#[derive(Parser)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// The URL to inspect
    url: String,

    #[clap(short, long, parse(from_os_str))]
    /// the file where JSON results will be saved
    output: Option<PathBuf>,

    #[clap(short, long)]
    /// Follow document into child links
    follow: bool,

    #[clap(long)]
    /// Show a selector as part of console output
    show: Option<String>,
}
pub mod document;
pub mod elements;
use document::Document;

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();

    // TODO: use reqwest::Url instead of String
    // let url = Url::parse(&args.url)?;

    let doc = Document::new(&args.url)
        .load_document()
        .await?
        .for_docs_rs()
        .add_generic_selectors();
    println!("- Parsed {} ", &args.url);

    match (&args.output, args.follow) {
        (Some(v), false) => {
            let results = serde_json::to_string(&doc.results())?;
            fs::write(&v, results).await?;
        }
        (Some(v), true) => {
            println!(
                "- Loading and parsing {} child nodes",
                &doc.get_child_urls().len()
            );
            let results = serde_json::to_string(&doc.results_graph().await?)?;
            fs::write(&v, results).await?;
        }
        _ => (),
    }

    Ok(())
}
