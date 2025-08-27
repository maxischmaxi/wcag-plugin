chrome.devtools.panels.create("A11y Audit", "", "panel.html", (panel) => {
    panel.onShown.addListener((panelWindow) => {
        panelWindow.init?.();
    });
    panel.onHidden.addListener(() => {
        console.log("cleanup");
    });
});
