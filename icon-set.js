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

	#coolWarmToggle = Math.floor(Math.random() * 2) ? -1 : 1;

	#getRandomColors() {
		let points = Array.from({length: 2}, () =>
			(Math.random() * 0.3 + 0.1).toPrecision(5)
		);

		points[0] *= this.#coolWarmToggle;

		this.#coolWarmToggle *= -1;

		points = points.join(" ");

		let light = `oklab(95% ${points})`;
		let dark = `oklab(5% ${points})`;

		return [`light-dark(${light}, ${dark})`, `light-dark(${dark}, ${light})`];
	}

	connectedCallback() {
		let shadow = this.attachShadow({mode: "open", slotAssignment: "manual"});

		shadow.adoptedStyleSheets = [IconSet.#sheet];

		let popover = document.createElement("div");

		popover.toggleAttribute("popover", true);
		popover.append("Copied");

		let popoverRef = new WeakRef(popover);
		let timeout;
		let i = 0;

		for (let svg of this.querySelectorAll("svg")) {
			let [background, foreground] = this.#getRandomColors();
			let slot = document.createElement("slot");
			let button = document.createElement("button");

			slot.setAttribute("name", `icon-${i++}`);
			button.append(slot);
			button.style.setProperty("background", background);
			button.style.setProperty("color", foreground);
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
				popoverRef.deref()?.style?.setProperty("color", foreground);
				popoverRef.deref()?.style?.setProperty("background", background);

				if (timeout) {
					clearTimeout(timeout);
				}

				timeout = setTimeout(() => {
					this.dispatchEvent(new CustomEvent("copy", {detail: null}));

					popoverRef.deref()?.hidePopover();
				}, 2_000);

				try {
					await navigator.clipboard.writeText(
						svgRef.deref()?.outerHTML?.trim()
					);
				} catch (_) {}
			});
		}

		shadow.append(popover);
	}
}
