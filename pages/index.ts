import { h } from "@handcraft/lib";
import { stringify } from "@handcraft/lib/stringify";
import icons from "../data/icons.json" with { type: "json" };
import iconTile from "../elements/icon-tile.ts";

const {
  html,
  head,
  meta,
  title,
  link,
  script,
  body,
  div,
} = h.html;
const { svg, title: svgTitle, path: svgPath } = h.svg;

export default function () {
  return stringify(
    html.lang("en-US")(
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
            iconTile(
              svg.viewBox([0, 0].concat(dimensions).join(" "))(
                svgTitle(title),
                svgPath.d(path),
              ),
            )
          ),
        ),
      ),
    ),
  );
}
