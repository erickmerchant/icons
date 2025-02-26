import {html} from "handcraft/dom.js";
import {watch, effect} from "handcraft/reactivity.js";
import {define} from "handcraft/define.js";
import "handcraft/dom/attr.js";
import "handcraft/dom/classes.js";
import "handcraft/dom/effect.js";
import "handcraft/dom/nodes.js";
import "handcraft/dom/observe.js";
import "handcraft/dom/on.js";
import "handcraft/dom/styles.js";
import "handcraft/dom/text.js";

let {div: DIV} = html;

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

			let popover = DIV()
				.attr("popover", true)
				.text("Copied")
				.effect((el) => {
					if (state.clicked === index) {
						if (timeout) {
							clearTimeout(timeout);
						}

						el.showPopover();

						timeout = setTimeout(() => {
							state.clicked = -1;
						}, 2_000);
					} else {
						el.hidePopover();
					}
				});

			button
				.classes({clicked: () => state.clicked === index})
				.styles({
					"--light": `oklab(95% ${points})`,
					"--dark": `oklab(5% ${points})`,
					"--anchor-name": `--button-${index}`,
				})
				.nodes(popover)
				.on("click", (e) => {
					state.clicked = index;
				})
				.effect((el) => {
					if (state.clicked === index) {
						navigator.clipboard
							.writeText(el.innerHTML.trim())
							.finally((_) => {});
					}
				});
		}
	});
});
