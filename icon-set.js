class IconSet extends HTMLElement {
	static #sheet = new CSSStyleSheet();

	static {
		customElements.define("icon-set", IconSet);

		this.#sheet.replaceSync(`
			* {
				box-sizing: border-box;
				margin: 0;
				padding: 0;
				font: inherit;
				max-inline-size: 100%;
			}

			button {
					appearance: none;
					background: hsl(0 0 0 / 0);
					border: none;
			}
		`);

		let cssUrl = new URL("./icon-set.css", import.meta.url);

		fetch(cssUrl)
			.then((res) => res.text())
			.then((css) => {
				this.#sheet.replaceSync(css);
			});
	}

	#timeout;
	#popover;

	connectedCallback() {
		let shadow = this.attachShadow({mode: "open", slotAssignment: "manual"});
		let i = 0;

		for (let svg of this.querySelectorAll("svg")) {
			let slot = document.createElement("slot");

			slot.setAttribute("name", `icon-${i++}`);

			let button = document.createElement("button");

			button.append(slot);
			shadow.append(button);

			slot.assign(svg);

			button.addEventListener("click", (e) => {
				this.dispatchEvent(new CustomEvent("copy", {detail: {svg}}));
			});

			this.addEventListener("copy", async (e) => {
				let clicked = e.detail?.svg === svg;

				button.classList.toggle("clicked", clicked);

				if (!clicked) {
					return;
				}

				this.#popover?.showPopover();

				if (this.#timeout) {
					clearTimeout(this.#timeout);
				}

				this.#timeout = setTimeout(() => {
					this.dispatchEvent(new CustomEvent("copy", {detail: {svg: null}}));

					this.#popover?.hidePopover();
				}, 2_000);

				try {
					await navigator.clipboard.writeText(svg.outerHTML?.trim?.());
				} catch (_) {}
			});
		}

		let div = document.createElement("div");
		let span = document.createElement("span");
		let checkIcon = this.querySelector('[data-icon="check"]').cloneNode(true);

		div.toggleAttribute("popover", true);
		span.append("Copied");
		div.append(checkIcon, span);

		this.#popover = div;

		shadow.adoptedStyleSheets = [IconSet.#sheet];
		shadow.append(div);
	}
}
