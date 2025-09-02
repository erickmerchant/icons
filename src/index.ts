import type { FlintRouteContext } from "@flint/framework";
import { h, render } from "@handcraft/lib";
import icons from "./icons.json" with { type: "json" };

const {
  html,
  head,
  meta,
  title,
  link,
  script,
  body,
  button,
  "icon-set": iconSet,
} = h.html;
const { svg, title: svgTitle, path: svgPath } = h.svg;

export default function (
  { resolve }: FlintRouteContext,
) {
  return render(
    html.lang("en-US")(
      head(
        meta.charset("utf-8"),
        meta.name("viewport").content("width=device-width, initial-scale=1"),
        title("Icon Gallery"),
        link.rel("stylesheet").href(resolve("/index.css")),
        script.type("module").src(resolve("/icon-set.js")),
      ),
      body.class("page")(
        iconSet(
          icons.map(({ dimensions, title, path }) =>
            button(
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
