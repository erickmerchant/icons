import { h, type HandcraftNode } from "@handcraft/lib";
import iconTile from "../elements/icon-tile.ts";
import * as Fs from "@std/fs";

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

export default async function () {
  const icons: Array<() => HandcraftNode> = [];

  for (const { name } of await Array.fromAsync(Fs.expandGlob("./icons/*.ts"))) {
    const { icon } = await import(`../icons/${name}`);

    icons.push(icon);
  }

  return html.lang("en-US")(
    head(
      meta.charset("utf-8"),
      meta.name("viewport").content("width=device-width, initial-scale=1"),
      title("Icon Gallery"),
      link.rel("stylesheet").href("/styles/index.css"),
      script.type("module").src("/elements/icon-tile.js"),
    ),
    body.class("page")(
      div.class("icons")(icons.map((i) => iconTile(i()))),
    ),
  );
}
