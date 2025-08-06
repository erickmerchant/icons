import "handcraft/dom/classes.js";
import "handcraft/dom/effect.js";
import "handcraft/dom/find.js";
import "handcraft/dom/nodes.js";
import "handcraft/dom/observer.js";
import "handcraft/dom/on.js";
import "handcraft/dom/styles.js";
import { h } from "handcraft/dom.js";
import { effect, watch } from "handcraft/reactivity.js";
import { define } from "handcraft/define.js";
import { when } from "handcraft/when.js";

const { div } = h.html;

define("icon-set").setup((host) => {
	let timeout;
	const state = watch({ color: null, anchorName: null });
	let i = -1;
	const popoverBeforeToggle = (e) => {
		if (e.newState === "closed") {
			state.color = null;
			state.anchorName = null;
		}
	};
	const popoverEffect = (el) => {
		if (state.color != null) {
			if (timeout) {
				clearTimeout(timeout);
			}

			el.showPopover();

			timeout = setTimeout(() => {
				state.color = null;
				state.anchorName = null;
			}, 2_000);
		} else {
			el.hidePopover();
		}
	};

	host(
		when(() => state.color != null).show(() =>
			div
				.popover(true)
				.styles({
					"--color": () => state.color,
					"--anchor-name": () => state.anchorName,
				})
				.on("beforetoggle", popoverBeforeToggle)
				.effect(popoverEffect)("Copied")
		),
	);

	effect(() => {
		for (const button of host.find("> button")) {
			const anchorName = `--button-${++i}`;
			const color = Array.from(
				{ length: 2 },
				() => (Math.random() * 0.8 - 0.4).toPrecision(5),
			).join(" ");
			const setColorAndAnchorName = () => {
				state.color = color;
				state.anchorName = anchorName;
			};
			const copyToClipboard = (el) => {
				if (state.color === color) {
					navigator.clipboard.writeText(el.innerHTML.trim()).finally((_) => {});
				}
			};

			button
				.classes({ clicked: () => state.anchorName === anchorName })
				.styles({ "--color": color, "anchor-name": anchorName })
				.on("click", setColorAndAnchorName)
				.effect(copyToClipboard);
		}
	});
});
