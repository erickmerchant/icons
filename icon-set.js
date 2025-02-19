import {html} from "handcraft/dom.js";
import {watch, effect} from "handcraft/reactivity.js";
import {define} from "handcraft/define.js";
import "handcraft/element/attr.js";
import "handcraft/element/classes.js";
import "handcraft/element/effect.js";
import "handcraft/element/nodes.js";
import "handcraft/element/observe.js";
import "handcraft/element/on.js";
import "handcraft/element/styles.js";
import "handcraft/element/text.js";

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

			let popover = div()
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
