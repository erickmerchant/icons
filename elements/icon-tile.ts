import { h, HandcraftElement, when } from "@handcraft/lib";
import type { HandcraftNode } from "@handcraft/lib";

const { div, slot, button } = h.html;

export class IconTile extends HandcraftElement {
  static instances = new Set<IconTile>();
  static observedProperties = ["clicked"];

  color: [number, number] = [getRandomNumber() * 0.4, getRandomNumber() * 360];
  clicked: boolean = false;
  timeout?: number;

  setClickedTrue = () => {
    for (const instance of IconTile.instances) {
      instance.clicked = false;
    }

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
    const state = e.newState;

    queueMicrotask(() => {
      if (state === "closed") {
        this.clicked = false;
      }
    });
  };

  popoverEffect = (el: HTMLElement) => {
    if (this.clicked) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      el.showPopover();

      this.timeout = setTimeout(() => {
        this.clicked = false;
      }, 2_000) as unknown as number;
    } else if (el.isConnected && el.popover) {
      el.hidePopover();
    }
  };

  constructor() {
    super();

    IconTile.instances.add(this);
  }

  override view(host: HandcraftNode) {
    host
      .class({ clicked: () => this.clicked })
      .style({ "--color": this.color.join(" ") })
      .effect(this.copyToClipboard)
      .shadow(
        { mode: "open" },
        [
          button.part("button").on("click", this.setClickedTrue)(slot()),
          when(() => !this.ssr).show(() =>
            div
              .part("popover")
              .popover("manual")
              .on("beforetoggle", this.popoverBeforeToggle as EventListener)
              .effect(this.popoverEffect)("Copied")
          ),
        ],
      );
  }
}

export default IconTile.define("icon-tile");

function getRandomNumber(): number {
  const arr = new Uint32Array(1);

  globalThis.crypto.getRandomValues(arr);

  const [num] = [...arr].map((v) => v / 0b11111111111111111111111111111111);

  return num;
}
