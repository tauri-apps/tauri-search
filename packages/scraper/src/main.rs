use anyhow::{Context, Result};
use clap::Parser;
use scraper::ElementRef;

#[derive(Parser)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// The URL to inspect
    url: String,
}
mod document;
use document::Document;

/// A "section" captures the **H2** elements -- or comparable DOM elements -- which
/// represent a likely a _anchor linked_ item in the document structure.
#[derive()]
pub struct Section {
    pub id: String,
    /// any class properties added to the section
    pub class: String,
    /// the relative anchor link (aka, `#modules`, etc.)
    pub link: Option<String>,
    /// the inner HTML found in the section
    pub html: String,
    /// the full text of the section element
    pub text: String,
    /// the text of the anchor link (can be same as text but often a subset)
    pub link_text: String,
}

/// A `Selection` captures the key characteristics of a part of the DOM tree that
/// is intersection of an HTML document (`Html`) and a selector (`Selector`).
pub struct Selection {
    pub id: Option<String>,
    pub class: String,
    pub href: Option<String>,
    pub text: String,
    pub html: String,
}

impl From<ElementRef<'_>> for Selection {
    fn from(el: ElementRef) -> Self {
        Self {
            id: match el.value().attr("id") {
                Some(v) => Some(v.to_string()),
                None => None,
            },
            class: el.value().classes().into_iter().collect(),
            href: match el.value().attr("href") {
                Some(v) => Some(v.to_string()),
                None => None,
            },
            text: el.text().collect(),
            html: el.inner_html(),
        }
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();
    let doc = Document::new(args.url).load_document().await?.to_rust_doc();

    println!("h2: {:?}", doc.get_selector_all("h2"));

    // // selectors
    // let h1 = Selector::parse("h1 .in-band").unwrap();
    // let h2 = Selector::parse("h2").unwrap();

    // let mods = Selector::parse(".module-item a.mod").unwrap();
    // let structs = Selector::parse(".module-item a.struct").unwrap();
    // let fns = Selector::parse(".module-item a.fn").unwrap();
    // let traits = Selector::parse(".module-item a.trait").unwrap();
    // let type_defs = Selector::parse(".module-item a.type").unwrap();
    // let text = Selector::parse("section .docblock").unwrap();

    // // HTML selections
    // let h1: String = html.select(&h1).flat_map(|el| el.text()).collect();
    // let description: String = html.select(&text).flat_map(|el| el.text()).collect();
    // let sections: Vec<Section> = html
    //     .select(&h2)
    //     .map(|el| Section {
    //         id: el.value().attr("id").unwrap().to_string(),
    //         class: el.value().classes().into_iter().collect(),
    //         link: Some("".to_string()),
    //         text: el.text().collect(),
    //         html: el.inner_html(),
    //         link_text: "".to_string(),
    //     })
    //     .collect();

    // // use Selectors to get Selections
    // let modules: Vec<Selection> = html.select(&mods).map(|m| Selection::from(m)).collect();
    // let structs: Vec<Selection> = html.select(&structs).map(|m| Selection::from(m)).collect();
    // let fns: Vec<Selection> = html.select(&fns).map(|m| Selection::from(m)).collect();
    // let traits: Vec<Selection> = html.select(&traits).map(|m| Selection::from(m)).collect();
    // let type_defs: Vec<Selection> = html
    //     .select(&type_defs)
    //     .map(|m| Selection::from(m))
    //     .collect();

    // println!("\ntitle: {}", h1);
    // println!("description: {}", description);
    // for s in sections {
    //     println!(
    //         "sections:\n- text is {}\n- html is {}\n- class is {} ",
    //         s.text, s.html, s.class
    //     );
    // }

    // print!("modules: ");
    // for m in modules {
    //     print!("{} [{}], ", m.text, m.href.unwrap())
    // }
    // println!();

    // print!("structs: ");
    // for m in structs {
    //     print!("{} [{}], ", m.text, m.href.unwrap())
    // }
    // println!();

    // print!("fns: ");
    // for m in fns {
    //     print!("{} [{}], ", m.text, m.href.unwrap())
    // }
    // println!();

    // print!("type_defs: ");
    // for m in type_defs {
    //     print!("{} [{}], ", m.text, m.href.unwrap())
    // }
    // println!();

    Ok(())
}
