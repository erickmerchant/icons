import { h, HandcraftElement, when } from "@handcraft/lib";
import type { HandcraftNode } from "@handcraft/lib";

const { div, slot, button } = h.html;

export default class IconTile extends HandcraftElement {
  color: [number, number] = [getRandomNumber() * 0.4, getRandomNumber() * 360];
  clicked: boolean = false;
  timeout?: number;

  setClicked = () => {
    this.clicked = true;
  };

  copyToClipboard = (el: HTMLElement) => {
    if (this.clicked) {
      navigator.clipboard.writeText(el.innerHTML.trim()).finally(
        () => {},
      );
    }
  };

  popoverBeforeToggle = (e: ToggleEvent) => {
    if (e.newState === "closed") {
      this.clicked = false;
    }
  };

  popoverEffect = (el: HTMLElement) => {
    if (this.clicked) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      el.isConnected && el.showPopover();

      this.timeout = setTimeout(() => {
        this.clicked = false;
      }, 2_000) as unknown as number;
    }
  };

  override view(host: HandcraftNode) {
    host
      .class({ clicked: () => this.clicked })
      .style({ "--color": this.color.join(" ") })
      .effect(this.copyToClipboard)
      .shadow(
        { mode: "open" },
        [
          button.part("button").on("click", this.setClicked)(slot()),
          when(() => this.clicked).show(() =>
            div
              .part("popover")
              .popover(true)
              .on("beforetoggle", this.popoverBeforeToggle as EventListener)
              .effect(this.popoverEffect)("Copied")
          ),
        ],
      );
  }
}

IconTile.define("icon-tile");

function getRandomNumber(): number {
  const arr = new Uint32Array(1);

  globalThis.crypto.getRandomValues(arr);

  const [num] = [...arr].map((v) => v / 0b11111111111111111111111111111111);

  return num;
}
