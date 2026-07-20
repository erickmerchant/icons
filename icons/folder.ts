import { h, type HandcraftNode } from "@handcraft/lib";

const { svg, title, path } = h.svg;

export function icon(): HandcraftNode {
  return svg.viewBox("0 0 28 28")(
    title("Folder"),
    path.d(
      "M0 2 Q0 0 2 0 H9 Q10.5 0 11 0.5 L14 4 H26 Q28 4 28 6 V26 Q28 28 26 28 H2 Q0 28 0 26 V14 H5 V23 H23 V9 H5 V14 H0 Z",
    ),
  );
}
