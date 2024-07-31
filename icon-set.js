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
				display: grid;
			}

			:popover-open {
				display: none;
			}
		`);

		let cssUrl = new URL("./icon-set.css", import.meta.url);

		fetch(cssUrl)
			.then((res) => res.text())
			.then((css) => {
				this.#sheet.replaceSync(css);
			});
	}

	connectedCallback() {
		let shadow = this.attachShadow({mode: "open", slotAssignment: "manual"});

		shadow.adoptedStyleSheets = [IconSet.#sheet];

		let popover = document.createElement("div");
		let span = document.createElement("span");
		let checkIcon = this.querySelector('[data-icon="check"]').cloneNode(true);

		popover.toggleAttribute("popover", true);
		span.append("Copied");
		popover.append(checkIcon, span);

		let popoverRef = new WeakRef(popover);

		let timeout;
		let i = 0;

		for (let svg of this.querySelectorAll("svg")) {
			let slot = document.createElement("slot");

			slot.setAttribute("name", `icon-${i++}`);

			let button = document.createElement("button");

			button.append(slot);
			shadow.append(button);

			slot.assign(svg);

			let buttonRef = new WeakRef(button);
			let svgRef = new WeakRef(svg);

			button.addEventListener("click", (e) => {
				this.dispatchEvent(new CustomEvent("copy", {detail: svgRef}));
			});

			this.addEventListener("copy", async (e) => {
				let clicked = e.detail?.deref() === svgRef.deref();

				buttonRef.deref()?.classList.toggle("clicked", clicked);

				if (!clicked) {
					return;
				}

				popoverRef.deref()?.showPopover();

				if (timeout) {
					clearTimeout(timeout);
				}

				timeout = setTimeout(() => {
					this.dispatchEvent(new CustomEvent("copy", {detail: null}));

					popoverRef.deref()?.hidePopover();
				}, 2_000);

				try {
					await navigator.clipboard.writeText(
						svgRef.deref()?.outerHTML?.trim?.()
					);
				} catch (_) {}
			});
		}

		shadow.append(popover);
	}
}
