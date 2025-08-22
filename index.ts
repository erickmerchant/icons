import { h, render } from "@handcraft/lib";
import type { FlintRouteContext } from "@flint/framework";

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

export default async function (
  { resolve }: FlintRouteContext,
) {
  const icons: Array<{
    title: string;
    path: string;
    dimensions: [number, number];
  }> = await Deno.readTextFile("./icons.json").then((text) => JSON.parse(text));

  return render(
    html.lang("en-US")(
      head(
        meta.charset("utf-8"),
        meta.name("viewport").content("width=device-width, initial-scale=1"),
        title("Icon Gallery"),
        link.rel("stylesheet").href(resolve("/page.css")),
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
