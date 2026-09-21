import { h } from "@handcraft/lib";
import * as Path from "@std/path";

const {
  html,
  head,
  meta,
  title,
  link,
  body,
  div,
  span,
} = h.html;

export default async function () {
  const files = await Array.fromAsync(
    Deno.readDir(Path.join(Deno.cwd())),
  );
  const icons = files
    .filter(({ name }) => name.endsWith(".css"))
    .map(
      ({ name }) => {
        return Path.basename(name, ".css");
      },
    );

  return html.lang("en-US")(
    head(
      meta.charset("utf-8"),
      meta.name("viewport").content("width=device-width"),
      title("Icon Gallery"),
      link.rel("stylesheet").href("/styles/index.css"),
      icons.map((name) => link.rel("stylesheet").href(`/${name}.css`)),
    ),
    body.class("page")(
      div.class("icons")(
        icons.map((name) =>
          div(
            span.class("icon", `icon-${name}`),
          )
            .class("tile")
            .style({
              "--color": `${getRandomNumber() * 0.4} ${
                getRandomNumber() * 360
              }`,
            })
        ),
      ),
    ),
  );
}

function getRandomNumber(): number {
  const arr = new Uint32Array(1);

  globalThis.crypto.getRandomValues(arr);

  const [num] = [...arr].map((v) => v / 0b11111111111111111111111111111111);

  return num;
}
