class EmIconSet extends HTMLElement {
	connectedCallback() {
		let shadow = this.shadowRoot;
		let i = 0;
		let timeout;

		for (let button of shadow.querySelectorAll("button")) {
			i += 1;

			let svg = button.querySelector("svg");

			if (svg) {
				let popover = document.createElement("div");

				popover.toggleAttribute("popover", true);
				popover.append("Copied");

				button.append(popover);

				let points = Array.from({length: 2}, () =>
					(Math.random() * 0.8 - 0.4).toPrecision(5)
				).join(" ");

				button.style.setProperty("--light", `oklab(95% ${points})`);
				button.style.setProperty("--dark", `oklab(5% ${points})`);
				button.style.setProperty("--anchor-name", `--button-${i}`);

				let clipboard = svg.outerHTML.trim();

				button.addEventListener("click", async (e) => {
					button.classList.add("clicked");

					if (timeout) {
						clearTimeout(timeout);
					}

					popover.showPopover();

					timeout = setTimeout(() => {
						popover.hidePopover();

						button.classList.remove("clicked");
					}, 2_000);

					try {
						await navigator.clipboard.writeText(clipboard);
					} catch (_) {}
				});
			}
		}
	}
}

customElements.define("em-icon-set", EmIconSet);
