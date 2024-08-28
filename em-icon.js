class EmIcon extends HTMLElement {
	#clipboard = "";
	#popoverRef;

	connectedCallback() {
		let points = Array.from({length: 2}, () =>
			(Math.random() * 0.8 - 0.4).toPrecision(5)
		).join(" ");

		let theme = new CSSStyleSheet();

		theme.replaceSync(`:host {
			--light: oklab(95% ${points});
			--dark: oklab(5% ${points});
		}`);

		let shadow = this.shadowRoot ?? this.attachShadow({mode: "open"});

		shadow.adoptedStyleSheets = [theme];

		let popover = document.createElement("div");

		popover.toggleAttribute("popover", true);
		popover.append("Copied");

		this.#popoverRef = new WeakRef(popover);
		let svg = this.querySelector("svg");

		if (svg) {
			this.#clipboard = svg.outerHTML.trim();

			let slot = document.createElement("slot");
			let button = document.createElement("button");

			button.append(slot);
			shadow.append(button);

			button.addEventListener("click", async (e) => {
				this.#popoverRef.deref()?.showPopover();

				setTimeout(() => {
					this.#popoverRef.deref()?.hidePopover();
				}, 2_000);

				try {
					await navigator.clipboard.writeText(this.#clipboard);
				} catch (_) {}
			});
		}

		shadow.append(popover);
	}
}

customElements.define("em-icon", EmIcon);
