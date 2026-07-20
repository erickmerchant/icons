import { h, type HandcraftNode } from "@handcraft/lib";

const { svg, title, path } = h.svg;

export function icon(): HandcraftNode {
  return svg.viewBox("0 0 28 28")(
    title("Delete"),
    path.d(
      "M5 1 Q6 0 7 1 L14 8 L21 1 Q22 0 23 1 L27 5 Q28 6 27 7 L20 14 L27 21 Q28 22 27 23 L23 27 Q22 28 21 27 L14 20 L7 27 Q6 28 5 27 L1 23 Q0 22 1 21 L8 14 L1 7 Q0 6 1 5 Z",
    ),
  );
}
