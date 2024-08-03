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
				--background: light-dark(var(--light), var(--dark));
				--foreground: light-dark(var(--dark), var(--light));
			}

			button {
				appearance: none;
				background: var(--background);
				color: var(--foreground);
				border: none;
				display: grid;
				anchor-name: --self;
			}

			:popover-open {
				background: var(--background);
				color: var(--foreground);
				border: 0.125rem solid currentColor;
				border-radius: 0.25rlh;
				padding: 1em;
				display: flex;
				flex-direction: row;
				gap: 0.5em;
				font-weight: 500;
				position: fixed;
				margin: auto;
				inset-area: center;
				font-size: 1.25rem;

				> * {
					flex-shrink: 0;
				}

				@supports (anchor-name: --self) {
					position: absolute;
					position-anchor: --self;
					top: calc(anchor(top) + 0.5em);
					left: calc(anchor(left) + 0.5em);
					padding: 0.5em;
				}
			}
		`);
	}

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

		let shadow = this.attachShadow({mode: "open"});

		shadow.adoptedStyleSheets = [EmIcon.#sheet, theme];

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
