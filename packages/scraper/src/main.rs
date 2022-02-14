// extern crate request;
use clap::Parser;
use std::collections::HashMap;

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// The URL to inspect
    url: String,
}

#[tokio::main]
async fn main()-> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();
    println!("Looking at: {}", args.url);
    let resp = reqwest::get(args.url)
        .await?
        .json::<HashMap<String, String>>()
        .await?;

    println!("{:#?}", resp);
    Ok(())
}
