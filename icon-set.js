import {html} from "handcraft/dom.js";
import "handcraft/dom/attr.js";
import "handcraft/dom/classes.js";
import "handcraft/dom/effect.js";
import "handcraft/dom/nodes.js";
import "handcraft/dom/observe.js";
import "handcraft/dom/on.js";
import "handcraft/dom/styles.js";
import "handcraft/dom/text.js";
import {watch, effect} from "handcraft/reactivity.js";
import {define} from "handcraft/define.js";

let {div: DIV} = html;

define("icon-set").connected((host) => {
	let timeout;
	let state = watch({color: null, anchorName: null});
	let i = -1;
	let observed = host.observe();
	let buttons = observed.find(":scope > button");
	let popover = DIV()
		.attr("popover", true)
		.styles({
			"--color": () => state.color,
			"--anchor-name": () => state.anchorName,
		})
		.text("Copied")
		.effect((el) => {
			if (state.color != null) {
				if (timeout) {
					clearTimeout(timeout);
				}

				el.showPopover();

				timeout = setTimeout(() => {
					state.color = null;
				}, 2_000);
			} else {
				el.hidePopover();
			}
		});

	host.nodes(popover);

	effect(() => {
		for (let button of buttons) {
			let anchorName = `--button-${++i}`;

			let color = Array.from({length: 2}, () =>
				(Math.random() * 0.8 - 0.4).toPrecision(5)
			).join(" ");

			button
				.styles({"--color": color, "anchor-name": anchorName})
				.on("click", () => {
					state.color = color;
					state.anchorName = anchorName;
				})
				.effect((el) => {
					if (state.color === color) {
						navigator.clipboard
							.writeText(el.innerHTML.trim())
							.finally((_) => {});
					}
				});
		}
	});
});
