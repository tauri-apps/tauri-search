use scraper::ElementRef;

pub fn id(el: &ElementRef) -> Option<String> {
    match el.value().attr("id") {
        Some(v) => return Some(v.to_string()),
        None => return None,
    }
}

pub fn class(el: &ElementRef) -> Option<String> {
    let class: String = el.value().classes().into_iter().collect();

    if class.len() > 0 {
        Some(class)
    } else {
        None
    }
}

pub fn style(el: &ElementRef) -> Option<String> {
    match el.value().attr("style") {
        Some(v) => Some(v.to_string()),
        None => None,
    }
}

pub fn href(el: &ElementRef) -> Option<String> {
    match el.value().attr("href") {
        Some(v) => Some(v.to_string()),
        None => None,
    }
}

pub fn text(el: &ElementRef) -> Option<String> {
    let text = el.text().collect::<String>();

    if text.len() > 0 {
        Some(text)
    } else {
        None
    }
}

pub fn html(el: &ElementRef) -> Option<String> {
    let html = el.inner_html();
    if html.len() > 0 {
        Some(html)
    } else {
        None
    }
}

pub fn name(el: &ElementRef) -> Option<String> {
    match el.value().attr("name") {
        Some(v) => Some(v.to_string()),
        None => None,
    }
}

pub fn content(el: &ElementRef) -> Option<String> {
    match el.value().attr("content") {
        Some(v) => Some(v.to_string()),
        None => None,
    }
}

pub fn rel(el: &ElementRef) -> Option<String> {
    match el.value().attr("rel") {
        Some(v) => Some(v.to_string()),
        None => None,
    }
}

pub fn src(el: &ElementRef) -> Option<String> {
    match el.value().attr("src") {
        Some(v) => Some(v.to_string()),
        None => None,
    }
}

pub fn type_(el: &ElementRef) -> Option<String> {
    match el.value().attr("type") {
        Some(v) => Some(v.to_string()),
        None => None,
    }
}

pub fn disabled(el: &ElementRef) -> Option<bool> {
    match el.value().attr("disabled") {
        Some(v) => match v {
            "true" => Some(true),
            _ => Some(false),
        },
        None => None,
    }
}

// pub fn other(el: &ElementRef)-> Option<String> {}
