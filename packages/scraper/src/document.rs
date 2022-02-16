use std::collections::HashMap;

use anyhow::Result;
use scraper::{ElementRef, Html, Selector};
use serde::{Deserialize, Serialize};

/// A `Selection` captures the key characteristics of a part of the DOM tree that
/// is intersection of an HTML document (`Html`) and a selector (`Selector`).
#[derive(Serialize, Deserialize, Debug, Clone)]
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

#[derive(Debug, Clone)]
pub struct Document {
    /// The URL where the html document can be found
    pub url: String,
    pub data: Option<String>,
}

pub struct LoadedDocument {
    /// The URL where the html document can be found
    pub url: String,
    /// the raw string data recieved over the network
    pub data: String,
}

impl Document {
    pub fn new(url: String) -> Document {
        Document { url, data: None }
    }

    /// Loads the HTTP page over the network and saves as a string
    /// awaiting further processing.
    pub async fn load_document(self) -> Result<LoadedDocument> {
        let resp = match self.data {
            Some(v) => v,
            None => reqwest::get(&self.url).await?.text().await?,
        };

        Ok(LoadedDocument {
            url: self.url,
            data: resp,
        })
    }
}

impl LoadedDocument {
    /// Parses into a `ParsedDoc` and then adds selectors intended to suit the `docs.rs` site.
    pub fn to_rust_doc(self) -> ParsedDoc {
        ParsedDoc::from(self)
            .add_selector("h1", "h1 .out-of-band a")
            .add_selector_all("h2", "h2")
            .add_selector_all("modules", ".module-item a.mod")
            .add_selector_all("structs", ".module-item a.struct")
            .add_selector_all("functions", ".module-item a.fn")
            .add_selector_all("traits", ".module-item a.trait")
            .add_selector_all("type_defs", ".module-item a.type")
            .add_selector("desc", "section .docblock")
    }
}

pub enum SelectionKind {
    /** a selector with a single DOM element as result */
    Item(Selection),
    /** a selector with a _list_ of DOM elements as a result */
    List(Vec<Selection>),
}

pub struct ParseResults {
    pub url: String,
    pub data: HashMap<String, SelectionKind>,
    pub children: Vec<ParseResults>,
}

/// A `Document` which has been loaded from the network and parsed
/// into a DOM tree.
pub struct ParsedDoc {
    pub url: String,
    pub html: Html,
    pub selectors: HashMap<String, Selection>,
    pub list_selectors: HashMap<String, Vec<Selection>>,
}

impl ParsedDoc {
    pub fn new(url: String, html: Html) -> ParsedDoc {
        ParsedDoc {
            url,
            html,
            selectors: HashMap::new(),
            list_selectors: HashMap::new(),
        }
    }
    /// Add a selector for an item where the expectation is there is only one
    /// (or at least _at most_ one)
    pub fn add_selector(mut self, name: &str, selector: &str) -> Self {
        let selector = Selector::parse(selector)?;
        let selector = self.html.select(&selector).next().unwrap();

        self.selectors
            .insert(name.to_string(), Selection::from(selector));

        self
    }

    /// Add a selector which is expect to bring a _list_ of results
    pub fn add_selector_all(mut self, name: &str, selector: &str) -> Self {
        let selector = Selector::parse(selector).unwrap();
        let selector = self
            .html
            .select(&selector)
            .map(|m| Selection::from(m))
            .collect();

        self.list_selectors.insert(name.to_string(), selector);

        self
    }

    pub fn get_selector(&self, name: &str) -> &Selection {
        self.selectors.get(name).unwrap()
    }

    pub fn get_selector_all(&self, name: &str) -> &Vec<Selection> {
        self.list_selectors.get(name).unwrap()
    }

    pub fn children_urls(&self) -> Vec<String> {
        let mut children = Vec::new();

        for selector in self.list_selectors.keys() {
            for selections in self.list_selectors.get(selector) {
                for i in selections {
                    match &i.href {
                        Some(v) => children.push(v.to_string()),
                        _ => (),
                    }
                }
            }
        }

        children
    }

    /// Returns a tree of results starting with the given URL and
    /// then following into the children nodes.
    async fn results_graph(&self) -> ParseResults {
        let mut data: HashMap<String, SelectionKind> = HashMap::new();

        self.selectors.iter().for_each(|(k, v)| {
            data //
                .insert(k.to_string(), SelectionKind::Item(v.clone()));
        });

        self.list_selectors.iter().for_each(|(k, v)| {
            data.insert(k.to_string(), SelectionKind::List(v.clone()));
        });

        // let children: Vec<dyn Future<Document>> = doc.children_urls()
        //     .iter()
        //     .map(|u|  load_rust_doc(u)).collect();
        // let children = join!(children).await;

        ParseResults {
            url: self.url.to_string(),
            data,
            children: vec![],
        }
    }
}

impl From<LoadedDocument> for ParsedDoc {
    fn from(doc: LoadedDocument) -> Self {
        ParsedDoc::new(doc.url.to_string(), Html::parse_document(&doc.data))
    }
}
