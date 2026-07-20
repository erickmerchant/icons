import { h, type HandcraftNode } from "@handcraft/lib";

const { svg, title, path } = h.svg;

export function icon(): HandcraftNode {
  return svg.viewBox("0 0 20 24")(
    title("Date"),
    path.d(
      "M0 6 Q0 4 2 4 H3 V2 Q3 0 5 0 T7 2 V4 H13 V2 Q13 0 15 0 T17 2 V4 H18 Q20 4 20 6 V10 V22 Q20 24 18 24 H2 Q0 24 0 22 V20 H16 V11 H4 V21 H0 Z",
    ),
  );
}
