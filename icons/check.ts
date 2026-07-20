import { h, type HandcraftNode } from "@handcraft/lib";

const { svg, title, path } = h.svg;

export function icon(): HandcraftNode {
  return svg.viewBox("0 0 34 28")(
    title("Check"),
    path.d(
      "M27 1 Q28 0 29 1 L33 5 Q34 6 33 7 L13 27 Q12 28 11 27 L1 17 Q0 16 1 15 L5 11 Q6 10 7 11 L12 16 Z",
    ),
  );
}
