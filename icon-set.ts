import { define, effect, h, observe, watch, when } from "@handcraft/lib";

const { div } = h.html;

define("icon-set").setup((host) => {
  let timeout: number;
  const state: {
    color: string | null;
    anchorName: string | null;
  } = watch({ color: null, anchorName: null });
  let i = -1;
  const popoverBeforeToggle = (e: ToggleEvent) => {
    if (e.newState === "closed") {
      state.color = null;
      state.anchorName = null;
    }
  };
  const popoverEffect = (el: HTMLElement) => {
    if (state.color != null) {
      if (timeout) {
        clearTimeout(timeout);
      }

      el.showPopover();

      timeout = setTimeout(() => {
        state.color = null;
        state.anchorName = null;
      }, 2_000);
    } else {
      el.hidePopover();
    }
  };

  host(
    when(() => state.color != null).show(() =>
      div
        .popover(true)
        .style({
          "--color": () => state.color,
          "--anchor-name": () => state.anchorName,
        })
        .on("beforetoggle", popoverBeforeToggle as EventListener)
        .effect(popoverEffect)("Copied")
    ),
  );

  effect(() => {
    for (const button of observe(host)("> button")) {
      const anchorName = `--button-${++i}`;
      const color = Array.from(
        { length: 2 },
        () => (Math.random() * 0.8 - 0.4).toPrecision(5),
      ).join(" ");
      const setColorAndAnchorName = () => {
        state.color = color;
        state.anchorName = anchorName;
      };
      const copyToClipboard = (el: HTMLElement) => {
        if (state.anchorName === anchorName) {
          navigator.clipboard.writeText(el.innerHTML.trim()).finally(() => {});
        }
      };

      button
        .class({ clicked: () => state.anchorName === anchorName })
        .style({ "--color": color, "anchor-name": anchorName })
        .on("click", setColorAndAnchorName)
        .effect(copyToClipboard);
    }
  });
});
