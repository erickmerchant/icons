import {effect, html, watch} from "vanilla-kit/prelude/min.js";
import {define} from "vanilla-kit/define.js";
import "vanilla-kit/element/classes.js";
import "vanilla-kit/element/observe.js";
import "vanilla-kit/element/styles.js";

let {div} = html;

define("icon-set").connected((host) => {
	let timeout;
	let state = watch({clicked: -1});
	let i = 0;
	let observed = host.observe();
	let buttons = observed.find(":scope > button");

	effect(() => {
		for (let button of buttons) {
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
				.nodes(...button.deref().children, popover);

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
});
