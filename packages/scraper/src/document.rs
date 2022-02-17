use std::{
    collections::HashMap,
    fmt::{self, Display, Formatter},
};

use anyhow::{anyhow, Error, Result};
use scraper::{ElementRef, Html, Selector};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tokio_stream::StreamExt;

use crate::elements;

/// A `Selection` captures the key characteristics of a part of the DOM tree that
/// is intersection of an HTML document (`Html`) and a selector (`Selector`).
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Selection {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub class: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub style: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    /// The `href` property, if present on the selected element
    pub href: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    /// The `src` property, if present on the selected element
    pub src: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    /// The plain text within the selected DOM element
    pub text: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    /// The innerHTML of the selected DOM element
    pub html: Option<String>,

    /// While not a heavily used prop in the body of HTML it is very
    /// common to have this -- paired with "name" -- in the meta properties
    /// of a page.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub rel: Option<String>,
    #[serde(rename = "type", skip_serializing_if = "Option::is_none")]
    pub type_: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub disabled: Option<bool>,

    /// other -- less used props -- can still be stored
    /// but they will be stored as a JSON hash value in
    /// this `other` property to avoid too many props.
    #[serde(skip_serializing_if = "HashMap::is_empty")]
    pub other: HashMap<String, Value>,
}

impl Selection {
    fn new() -> Self {
        Selection {
            id: None,
            class: None,
            style: None,
            name: None,
            href: None,
            text: None,
            html: None,
            content: None,
            rel: None,
            src: None,
            type_: None,
            disabled: None,

            other: HashMap::new(),
        }
    }
}

impl From<ElementRef<'_>> for Selection {
    fn from(el: ElementRef) -> Self {
        let mut selection = Selection::new();
        selection.id = elements::id(&el);
        selection.class = elements::class(&el);
        selection.style = elements::style(&el);
        selection.text = elements::text(&el);
        selection.html = elements::html(&el);
        selection.href = elements::href(&el);
        selection.name = elements::name(&el);
        selection.content = elements::content(&el);
        selection.rel = elements::rel(&el);
        selection.src = elements::src(&el);
        selection.type_ = elements::type_(&el);

        selection
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct Document {
    /// The URL where the html document can be found
    pub url: String,
    pub data: Option<String>,
}

impl Document {
    pub fn new(url: &str) -> Document {
        Document {
            url: url.to_string(),
            data: None,
        }
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

#[derive(Debug, Clone, Serialize)]
pub struct LoadedDocument {
    /// The URL where the html document can be found
    pub url: String,
    /// the raw string data recieved over the network
    pub data: String,
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

#[derive(Debug)]
pub enum SelectorKind {
    /** a selector with a single DOM element as result */
    Item(Selector),
    /** a selector with a _list_ of DOM elements as a result */
    List(Selector),
}

#[derive(Debug, Serialize)]
#[serde(untagged)]
pub enum SelectionKind {
    /** a selector with a single DOM element as result */
    Item(Selection),
    /** a selector with a _list_ of DOM elements as a result */
    List(Vec<Selection>),
}

/// A recursive structure which provides the `url` and all top level
/// selectors on a given page as `data` and then optionally recurses
/// into child elements and provides the same structure.
#[derive(Debug, Serialize)]
pub struct ParseResults {
    pub url: String,
    pub data: HashMap<String, SelectionKind>,
    pub children: Vec<ParseResults>,
}

impl Display for ParseResults {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", serde_json::to_string(&self))
    }
}

/// A `Document` which has been loaded from the network and parsed
/// into a DOM tree. You can add "selectors" which will be lazily
/// evaluated when calling `get(selector)` or when exporting as
/// a JSON payload.
pub struct ParsedDoc {
    pub url: String,
    pub html: Html,
    /// a hash of selectors which will be lazily evaluated when
    /// converting to a JSON output or when calling `get(selector)`
    /// to extract a particular selector.
    pub selectors: HashMap<String, SelectorKind>,
}

impl ParsedDoc {
    pub fn new(url: String, html: Html) -> ParsedDoc {
        ParsedDoc {
            url,
            html,
            selectors: HashMap::new(),
        }
    }
    /// Adds some useful but generic selectors which includes:
    ///
    /// - `title`
    /// - `images`
    /// - `links`
    /// - `scripts`
    /// - `styles`
    /// - `meta`
    pub fn add_generic_selectors(self) -> Self {
        self.add_selector_all("links", "[href]")
            .add_selector("title", "title")
            .add_selector_all("images", "img")
            .add_selector_all("scripts", "script")
            .add_selector_all("styles", "[rel=\'stylesheet\']")
            .add_selector_all("meta", "meta")
    }

    /// Add a selector for an item where the expectation is there is only one
    /// (or more specifically _at most_ one)
    pub fn add_selector(mut self, name: &str, selector: &str) -> Self {
        let selector = Selector::parse(selector).unwrap();
        self.selectors
            .insert(name.to_string(), SelectorKind::Item(selector));

        self
    }

    /// Add a selector which is expect to bring a _list_ of results
    pub fn add_selector_all(mut self, name: &str, selector: &str) -> Self {
        let selector = Selector::parse(selector).unwrap();
        self.selectors
            .insert(name.to_string(), SelectorKind::List(selector));

        self
    }

    /// Gets the results of a specified selector being applied on the HTML document.
    ///
    /// **Note:** this selector must have been previously configured or this will result
    /// in error.
    pub fn get(&self, name: &str) -> Result<SelectionKind, Error> {
        match self.selectors.get(name) {
            Some(SelectorKind::Item(v)) => Ok(SelectionKind::Item(Selection::from(
                self.html.select(&v).next().unwrap(),
            ))),
            Some(SelectorKind::List(v)) => Ok(
                //
                SelectionKind::List(
                    self.html
                        .select(&v)
                        .map(move |m| Selection::from(m))
                        .collect(),
                ),
            ),
            _ => {
                return Err(anyhow!(
                    "could not find the '{}' selector",
                    name.to_string()
                ))
            }
        }
    }

    /// returns a list of URL's which represent "child URLs" which
    /// could be worth recursively scraping as well
    pub fn children_urls(&self) -> Vec<String> {
        let mut children = Vec::new();

        for (_, selector) in &self.selectors {
            match selector {
                SelectorKind::List(v) => {
                    self.html
                        .select(&v)
                        .for_each(|c| match Selection::from(c).href {
                            Some(v) => children.push([self.url.clone(), v].join("/")),
                            None => (),
                        });
                }
                _ => (),
            }
        }

        children
    }

    /// Streams in child HTML pages and parses them into `ParsedDoc`
    /// structs.
    pub async fn get_children(&self) -> Result<Vec<ParseResults>> {
        let urls = self.children_urls();
        let mut children: Vec<ParseResults> = vec![];
        let mut stream = tokio_stream::iter(urls);

        while let Some(v) = stream.next().await {
            let child = Document::new(&v)
                .load_document()
                .await
                .unwrap()
                .to_rust_doc();

            children.push(child.results());
        }

        Ok(children)
    }

    /// Returns all selectors on the current page without recursing
    /// into child pages.
    pub fn results(&self) -> ParseResults {
        let mut data: HashMap<String, SelectionKind> = HashMap::new();

        self.selectors
            .iter()
            .for_each(|(name, _)| match self.get(name) {
                Ok(v) => {
                    data.insert(name.to_string(), v);
                }
                Err(e) => {
                    anyhow!(
                        "Problem inserting the results for the selector '{}'. Error message was {}",
                        name,
                        e
                    );
                }
            });

        ParseResults {
            url: self.url.to_string(),
            data,
            children: vec![],
        }
    }

    /// Returns a tree of `ParseResults` starting with the given URL and
    /// then following into the children nodes (one level deep).
    pub async fn results_graph(&self) -> Result<ParseResults> {
        let mut current_page = self.results();
        current_page.children = self.get_children().await?;

        Ok(current_page)
    }
}

impl From<LoadedDocument> for ParsedDoc {
    fn from(doc: LoadedDocument) -> Self {
        ParsedDoc::new(doc.url.to_string(), Html::parse_document(&doc.data))
    }
}
