import c, { Cheerio, Element } from "cheerio";
import fetch from "node-fetch";

export async function scrapeRustDocs() {
  const URL = `https://docs.rs/tauri/latest/tauri`;
  const pages = [];
  const r = await fetch(URL);
  if (r.ok) {
    const $ = c.load(await r.text());
    const doc = {
      title: $("h1").text(),
      sections: $("h2").text(),
      text: $("#main").html(),
    };

    console.log(doc);
  }
}

(async () => {
  scrapeRustDocs();
})();
