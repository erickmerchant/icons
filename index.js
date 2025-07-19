import { h, render } from "handcraft/env/server.js";

const {
	html,
	head,
	meta,
	title,
	link,
	script,
	body,
	"icon-set": iconSet,
	button,
} = h.html;
const { svg, title: svgTitle, path: svgPath } = h.svg;

export default async function ({ urls }) {
	const icons = await Deno.readTextFile("./icons.json").then((text) =>
		JSON.parse(text)
	);

	return render(
		html.lang("en-US")(
			head(
				meta.charset("utf-8"),
				meta.name("viewport").content("width=device-width, initial-scale=1"),
				title("Icon Gallery"),
				link.rel("stylesheet").href(urls["/page.css"]),
				link.rel("stylesheet").href(urls["/icon-set.css"]),
				script.type("module").src(urls["/icon-set.js"]),
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
