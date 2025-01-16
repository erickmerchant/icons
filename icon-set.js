import {define, effect, html, watch} from "vanilla-kit";

let {div} = html;

define("icon-set", (host) => {
	let timeout;
	let state = watch({clicked: -1});
	let i = 0;

	for (let button of host.find("button")) {
		let index = i++;

		let points = Array.from({length: 2}, () =>
			(Math.random() * 0.8 - 0.4).toPrecision(5)
		).join(" ");

		let popover = div().attr("popover", true).text("Copied");
		let content = button.deref().innerHTML.trim();

		button
			.classes({clicked: () => state.clicked === index})
			.on("click", (e) => {
				state.clicked = index;
			})
			.styles({
				"--light": `oklab(95% ${points})`,
				"--dark": `oklab(5% ${points})`,
				"--anchor-name": `--button-${index}`,
			})
			.nodes(popover);

		effect(() => {
			if (state.clicked === index) {
				if (timeout) {
					clearTimeout(timeout);
				}

				popover.deref().showPopover();
				navigator.clipboard.writeText(content).finally((_) => {});

				timeout = setTimeout(() => {
					state.clicked = -1;
				}, 2_000);
			} else {
				popover.deref().hidePopover();
			}
		});
	}
});
