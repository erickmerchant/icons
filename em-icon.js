class EmIcon extends HTMLElement {
	static #sheet = new CSSStyleSheet();

	static {
		customElements.define("em-icon", EmIcon);

		this.#sheet.replaceSync(`
			* {
				box-sizing: border-box;
				margin: 0;
				padding: 0;
				font: inherit;
				max-inline-size: 100%;
			}

			:host {
				display: grid;
			}

			button {
				appearance: none;
				background: hsl(0 0 0 / 0);
				border: none;
				display: grid;
			}

			:popover-open {
				display: none;
			}
		`);

		let cssUrl = new URL("./em-icon.css", import.meta.url);

		fetch(cssUrl)
			.then((res) => res.text())
			.then((css) => {
				this.#sheet.replaceSync(css);
			});
	}

	#clipboard = "";

	connectedCallback() {
		let points = Array.from({length: 2}, () =>
			(Math.random() * 0.8 - 0.4).toPrecision(5)
		).join(" ");

		let theme = new CSSStyleSheet();
		let light = `oklab(95% ${points})`;
		let dark = `oklab(5% ${points})`;

		theme.replaceSync(`:host {
			--background: light-dark(${light}, ${dark});
			--foreground: light-dark(${dark}, ${light});
		}`);

		let shadow = this.attachShadow({mode: "open"});

		shadow.adoptedStyleSheets = [EmIcon.#sheet, theme];

		let popover = document.createElement("div");

		popover.toggleAttribute("popover", true);
		popover.append("Copied");

		let popoverRef = new WeakRef(popover);
		let svg = this.querySelector("svg");

		if (svg) {
			this.#clipboard = svg.outerHTML.trim();

			let slot = document.createElement("slot");
			let button = document.createElement("button");

			button.append(slot);
			shadow.append(button);

			button.addEventListener("click", async (e) => {
				popoverRef.deref()?.showPopover();

				setTimeout(() => {
					popoverRef.deref()?.hidePopover();
				}, 2_000);

				try {
					await navigator.clipboard.writeText(this.#clipboard);
				} catch (_) {}
			});
		}

		shadow.append(popover);
	}
}
