import { $, define, h, watch, when } from "@handcraft/lib";

const { div } = h.html;

define("icon-tile", {
  connected(host) {
    let timeout: number;
    const state: {
      color: [number, number] | null;
      clicked: boolean;
    } = watch({ color: null, clicked: false });

    const [rand1, rand2] = getRandomValues(2);
    const c = rand1 * 0.4;
    const h = rand2 * 360;
    const setColorAndClicked = () => {
      state.color = [c, h];
      state.clicked = true;
    };
    const copyToClipboard = (el: HTMLElement) => {
      if (state.clicked) {
        navigator.clipboard.writeText(el.innerHTML.trim()).finally(
          () => {},
        );
      }
    };

    $(host)
      .class({ clicked: () => state.clicked })
      .style({ "--color": [c, h].join(" ") })
      .on("click", setColorAndClicked)
      .effect(copyToClipboard)(
        when(() => state.color != null).show(() =>
          div
            .popover(true)
            .style({
              "--color": () => state.color ? state.color.join(" ") : "",
            })
            .on("beforetoggle", popoverBeforeToggle as EventListener)
            .effect(popoverEffect)("Copied")
        ),
      );

    function popoverBeforeToggle(e: ToggleEvent) {
      if (e.newState === "closed") {
        state.color = null;
        state.clicked = false;
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
          state.clicked = false;
        }, 2_000);
      } else {
        el.hidePopover();
      }
    }

    function getRandomValues(len: number) {
      const arr = new Uint32Array(len);

      globalThis.crypto.getRandomValues(arr);

      return [...arr].map((v) => v / 0b11111111111111111111111111111111);
    }
  },
});
