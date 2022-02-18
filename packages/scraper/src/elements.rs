use scraper::ElementRef;

pub fn id(el: &ElementRef) -> Option<String> {
    el.value().attr("id").map(|v| v.to_string())
}

pub fn class(el: &ElementRef) -> Option<String> {
    let class: String = el.value().classes().into_iter().collect();

    if class.is_empty() {
        None
    } else {
        Some(class)
    }
}

pub fn style(el: &ElementRef) -> Option<String> {
    el.value().attr("style").map(|v| v.to_string())
}

pub fn href(el: &ElementRef) -> Option<String> {
    el.value().attr("href").map(|v| v.to_string())
}

pub fn text(el: &ElementRef) -> Option<String> {
    let text = el.text().collect::<String>();

    if text.is_empty() {
        None
    } else {
        Some(text.trim().to_string())
    }
}

pub fn html(el: &ElementRef) -> Option<String> {
    if el.inner_html().is_empty() {
        None
    } else {
        Some(el.inner_html().trim().to_string())
    }
}

pub fn name(el: &ElementRef) -> Option<String> {
    el.value().attr("name").map(|v| v.to_string())
}

pub fn content(el: &ElementRef) -> Option<String> {
    el.value().attr("content").map(|v| v.to_string())
}

pub fn rel(el: &ElementRef) -> Option<String> {
    el.value().attr("rel").map(|v| v.to_string())
}

pub fn src(el: &ElementRef) -> Option<String> {
    el.value().attr("src").map(|v| v.to_string())
}

pub fn type_(el: &ElementRef) -> Option<String> {
    el.value().attr("type_").map(|v| v.to_string())
}

pub fn disabled(el: &ElementRef) -> Option<bool> {
    if let Some(d) = el.value().attr("disabled") {
        if d == "true" {
            Some(true)
        } else {
            Some(false)
        }
    } else {
        None
    }
}

// pub fn other(el: &ElementRef)-> Option<String> {}
