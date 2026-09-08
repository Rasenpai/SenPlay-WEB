import { useEffect } from "react";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
} from "../lib/seo-config";

function setMetaTag(attr, key, content) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  const created = !el;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  const previous = el.getAttribute("content");
  el.setAttribute("content", content);
  return { el, created, previous };
}

function setLinkTag(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  const created = !el;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  const previous = el.getAttribute("href");
  el.setAttribute("href", href);
  return { el, created, previous };
}

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  robots = "index, follow",
  image = DEFAULT_OG_IMAGE,
  jsonLd = null,
}) {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path}`;
    const previousTitle = document.title;
    document.title = title;

    const entries = [
      setMetaTag("name", "description", description),
      setMetaTag("name", "robots", robots),
      setMetaTag("property", "og:type", "website"),
      setMetaTag("property", "og:title", title),
      setMetaTag("property", "og:description", description),
      setMetaTag("property", "og:url", canonicalUrl),
      setMetaTag("property", "og:site_name", SITE_NAME),
      setMetaTag("property", "og:image", image),
      setMetaTag("name", "twitter:card", "summary_large_image"),
      setMetaTag("name", "twitter:title", title),
      setMetaTag("name", "twitter:description", description),
      setMetaTag("name", "twitter:image", image),
    ];

    const canonical = setLinkTag("canonical", canonicalUrl);

    let jsonLdScript = null;
    if (jsonLd) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.type = "application/ld+json";
      jsonLdScript.text = JSON.stringify(jsonLd);
      document.head.appendChild(jsonLdScript);
    }

    return () => {
      document.title = previousTitle;
      entries.forEach(({ el, created, previous }) => {
        if (created) {
          el.remove();
        } else if (previous !== null) {
          el.setAttribute("content", previous);
        }
      });
      if (canonical.created) {
        canonical.el.remove();
      } else if (canonical.previous !== null) {
        canonical.el.setAttribute("href", canonical.previous);
      }
      if (jsonLdScript) {
        jsonLdScript.remove();
      }
    };
  }, [title, description, path, robots, image, jsonLd]);

  return null;
}
