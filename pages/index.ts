import { h } from "@handcraft/lib/templating";
import icons from "../data/icons.json" with { type: "json" };

const {
  html,
  head,
  meta,
  title,
  link,
  script,
  body,
  div,
  button,
  "icon-tile": iconTile,
} = h.html;
const { svg, title: svgTitle, path: svgPath } = h.svg;

export default function () {
  return html.lang("en-US")(
    head(
      meta.charset("utf-8"),
      meta.name("viewport").content("width=device-width, initial-scale=1"),
      title("Icon Gallery"),
      link.rel("stylesheet").href("/pages/index.css"),
      script.type("module").src("/elements/icon-tile.js"),
    ),
    body.class("page")(
      div.class("icons")(
        icons.map(({ dimensions, title, path }) =>
          iconTile(button(
            svg.viewBox([0, 0].concat(dimensions).join(" "))(
              svgTitle(title),
              svgPath.d(path),
            ),
          ))
        ),
      ),
    ),
  );
}
