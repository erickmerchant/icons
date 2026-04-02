import { $, define, h, watch, when } from "@handcraft/lib";

const { div } = h.html;

define("icon-set", {
  connected(host) {
    let timeout: number;
    const state: {
      color: [number, number] | null;
      anchorName: string | null;
    } = watch({ color: null, anchorName: null });

    $(host)(
      when(() => state.color != null).show(() =>
        div
          .popover(true)
          .style({
            "--color": () => state.color ? state.color.join(" ") : "",
            "--anchor-name": () => state.anchorName,
          })
          .on("beforetoggle", popoverBeforeToggle as EventListener)
          .effect(popoverEffect)("Copied")
      ),
    );

    function popoverBeforeToggle(e: ToggleEvent) {
      if (e.newState === "closed") {
        state.color = null;
        state.anchorName = null;
      }
    }

    function popoverEffect(el: HTMLElement) {
      if (state.color != null) {
        if (timeout) {
          clearTimeout(timeout);
        }

        el.isConnected && el.showPopover();

        timeout = setTimeout(() => {
          state.color = null;
          state.anchorName = null;
        }, 2_000);
      } else {
        el.hidePopover();
      }
    }

    const buttons = host.querySelectorAll(":scope > button");
    const chArr = new Uint32Array(buttons.length * 2);

    globalThis.crypto.getRandomValues(chArr);

    for (
      let i = 0;
      i < buttons.length;
      i++
    ) {
      const button = buttons[i];
      const anchorName = `--button-${i}`;
      const c = (chArr[i * 2] / 0b11111111111111111111111111111111) * 0.4;
      const h = (chArr[i * 2 + 1] / 0b11111111111111111111111111111111) * 360;
      const setColorAndAnchorName = () => {
        state.color = [c, h];
        state.anchorName = anchorName;
      };
      const copyToClipboard = (el: HTMLElement) => {
        if (state.anchorName === anchorName) {
          navigator.clipboard.writeText(el.innerHTML.trim()).finally(
            () => {},
          );
        }
      };

      $(button)
        .class({ clicked: () => state.anchorName === anchorName })
        .style({ "--color": [c, h].join(" "), "anchor-name": anchorName })
        .on("click", setColorAndAnchorName)
        .effect(copyToClipboard);
    }
  },
});
