class EmIconSet extends HTMLElement {
	#timeout;

	connectedCallback() {
		let shadow = this.shadowRoot;
		let i = 0;

		shadow.addEventListener("click", this);

		for (let button of shadow.querySelectorAll("button")) {
			i += 1;

			let points = Array.from({length: 2}, () =>
				(Math.random() * 0.8 - 0.4).toPrecision(5)
			).join(" ");

			button.style.setProperty("--light", `oklab(95% ${points})`);
			button.style.setProperty("--dark", `oklab(5% ${points})`);
			button.style.setProperty("--anchor-name", `--button-${i}`);
		}
	}

	handleEvent(e) {
		let button = e.target.closest("button");

		if (button) {
			let svg = button.querySelector("svg");
			let popover = button.querySelector("[popover]");
			let clipboard = svg ? svg.outerHTML.trim() : "";

			button.classList.add("clicked");

			if (this.#timeout) {
				clearTimeout(this.#timeout);
			}

			if (!popover) {
				popover = document.createElement("div");

				popover.toggleAttribute("popover", true);
				popover.append("Copied");

				button.append(popover);
			}

			popover.showPopover();

			this.#timeout = setTimeout(() => {
				popover.hidePopover();

				button.classList.remove("clicked");
			}, 2_000);

			navigator.clipboard.writeText(clipboard).finally((_) => {});
		}
	}
}

customElements.define("em-icon-set", EmIconSet);
customElements.define("em-icons", class extends HTMLElement {});
