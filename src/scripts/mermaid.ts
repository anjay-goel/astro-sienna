export {};

const diagrams = Array.from(document.querySelectorAll<HTMLElement>("pre.mermaid"));
if (diagrams.length) {
	const sources = new Map(diagrams.map((node) => [node, node.textContent ?? ""]));
	let renderId = 0;
	let pending = Promise.resolve();

	function renderDiagrams() {
		pending = pending
			.then(async () => {
				const { default: mermaid } = await import("mermaid");
				await document.fonts.ready;
				const dark = document.documentElement.dataset.theme === "dark";
				mermaid.initialize({
					startOnLoad: false,
					layout: "dagre",
					securityLevel: "strict",
					suppressErrorRendering: true,
					theme: "base",
					fontFamily: "Inter Variable, sans-serif",
					themeVariables: {
						darkMode: dark,
						primaryColor: dark ? "#302720" : "#eee2d2",
						primaryTextColor: dark ? "#f4f0e3" : "#25201b",
						primaryBorderColor: dark ? "#c89761" : "#8a4423",
						lineColor: dark ? "#c8c1ae" : "#4a4239",
						secondaryColor: dark ? "#302720" : "#eee2d2",
						tertiaryColor: dark ? "#211c18" : "#f6f1e6",
						edgeLabelBackground: dark ? "#131110" : "#f6f1e6",
					},
					flowchart: { htmlLabels: false, curve: "linear" },
				});
				for (const [node, source] of sources) {
					try {
						const { svg } = await mermaid.render(`mermaid-diagram-${renderId++}`, source);
						node.innerHTML = svg;
						node.dataset.rendered = "true";
						const diagram = node.querySelector("svg");
						if (diagram)
							diagram.style.minWidth = `${Math.min(diagram.viewBox.baseVal.width, 560)}px`;
					} catch (error) {
						console.error("Could not render Mermaid diagram", error);
					}
				}
			})
			.catch((error) => console.error("Could not load Mermaid", error));
	}

	renderDiagrams();
	new MutationObserver(renderDiagrams).observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-theme"],
	});
}
