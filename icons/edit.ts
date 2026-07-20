import { h, type HandcraftNode } from "@handcraft/lib";

const { svg, title, path } = h.svg;

export function icon(): HandcraftNode {
  return svg.viewBox("0 0 28 28")(
    title("Edit"),
    path.d(
      "M19 1 Q18 0 17 1 L13 5 L23 15 L27 11 Q28 10 27 9 Z M11 7 L0 18 V28 H10 L21 17 Z",
    ),
  );
}
