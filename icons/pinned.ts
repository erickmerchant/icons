import { h, type HandcraftNode } from "@handcraft/lib";

const { svg, title, path } = h.svg;

export function icon(): HandcraftNode {
  return svg.viewBox("0 0 20 24")(
    title("Pinned"),
    path.d(
      "M2 1 Q2 0 3 0 H17 Q18 0 18 1 V2 L15 5 V9 L20 12 V13 Q20 14 19 14 H1 Q0 14 0 13 V12 L5 9 V5 L2 2 V2 Z M7 16 V20 L10 24 L13 20 V16 Z",
    ),
  );
}
