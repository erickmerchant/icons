import { h, type HandcraftNode } from "@handcraft/lib";

const { svg, title, path } = h.svg;

export function icon(): HandcraftNode {
  return svg.viewBox("0 0 28 28")(
    title("RSS"),
    path.d(
      "M0 24 A4 4 0 1 1 8 24 A4 4 0 1 1 0 24 Z M0 11 Q0 10 1 10 Q18 10 18 27 Q18 28 17 28 H13 Q12 28 12 27 Q12 16 1 16 Q0 16 0 15 Z M0 1 Q0 0 1 0 Q28 0 28 27 Q28 28 27 28 H23 Q22 28 22 27 Q22 6 1 6 Q0 6 0 5 Z",
    ),
  );
}
