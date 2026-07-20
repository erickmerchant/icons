import { h, type HandcraftNode } from "@handcraft/lib";

const { svg, title, path } = h.svg;

export function icon(): HandcraftNode {
  return svg.viewBox("0 0 28 28")(
    title("File"),
    path.d(
      "M0 2 Q0 0 2 0 H19 Q20 0 21 1 L27 7 Q28 8 28 9 V26 Q28 28 26 28 H2 Q0 28 0 26 V14 H5 V23 H23 V12 H17 Q16 12 16 11 V5 H5 V24 H0 Z",
    ),
  );
}
