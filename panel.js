const $status = document.getElementById("status");
const $select = document.getElementById("wcag-select");
const tabId = chrome.devtools.inspectedWindow.tabId;

function currentTabId() {
    return chrome.devtools.inspectedWindow.tabId;
}

function send(action) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            { type: action, tabId: currentTabId() },
            resolve,
        );
    });
}

document.getElementById("btn-run").addEventListener("click", async () => {
    const value = $select.value;

    $status.textContent = `Prüfe Seite (WCAG ${value.toUpperCase()})…`;

    const res = await send(`run-${value}`);
    if (res?.ok) {
        $status.textContent = `Bericht erstellt WCAG ${value.toUpperCase()} (Violations: ${res.counts.violations}) – siehe Seiten-Konsole.`;
    } else if (res?.error === "axe-not-loaded") {
        $status.textContent = "axe nicht geladen – bitte zuerst injizieren.";
    } else {
        $status.textContent = `Fehler: ${res?.error}, aktueller wert: WCAG ${value.toUpperCase()}`;
    }
});

chrome.devtools.network.onNavigated.addListener(async () => {
    await send("inject-axe");
    $status.textContent = "Ready!";
});

window.init = async function () {
    await send("inject-axe");
};
