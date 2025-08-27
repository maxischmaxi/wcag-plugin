async function runAxeInPage(level) {}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    (async () => {
        switch (msg.type) {
            case "inject-axe": {
                await chrome.scripting.executeScript({
                    target: { tabId: msg.tabId },
                    world: "MAIN",
                    files: ["lib/axe.min.js"],
                });
                sendResponse({ ok: true });
                break;
            }
            case "run-a": {
                const [{ result }] = await chrome.scripting.executeScript({
                    target: { tabId: msg.tabId },
                    world: "MAIN",
                    func: async () => {
                        if (!window.axe)
                            return { ok: false, error: "axe-not-loaded" };

                        const results = await window.axe.run(document, {
                            runOnly: {
                                type: "tag",
                                values: ["wcag2a", "wcag21a", "wcag22a"],
                            },
                        });

                        console.groupCollapsed(
                            "%cWCAG A Bericht (axe)",
                            "font-weight:bold",
                        );
                        console.log("Violations:", results.violations);
                        console.log("Incomplete:", results.incomplete);
                        console.log("Passes:", results.passes.length);
                        console.groupEnd();

                        results.violations.forEach((v) => {
                            console.groupCollapsed("❌", v.id, "-", v.help);
                            console.log("Impact:", v.impact);
                            console.log("Help:", v.helpUrl);
                            v.nodes.forEach((n) => {
                                console.log("Target:", n.target.join(" "));
                                if (n.failureSummary)
                                    console.log(n.failureSummary);
                            });
                            console.groupEnd();
                        });

                        return {
                            ok: true,
                            counts: {
                                violations: results.violations.length,
                                incomplete: results.incomplete.length,
                                passes: results.passes.length,
                            },
                        };
                    },
                });
                sendResponse(result ?? { ok: false, error: "no-result" });
                break;
            }
            case "run-aa": {
                const [{ result }] = await chrome.scripting.executeScript({
                    target: { tabId: msg.tabId },
                    world: "MAIN",
                    func: async () => {
                        if (!window.axe)
                            return { ok: false, error: "axe-not-loaded" };

                        const results = await window.axe.run(document, {
                            runOnly: {
                                type: "tag",
                                values: ["wcag2aa", "wcag21aa", "wcag22aa"],
                            },
                        });

                        console.groupCollapsed(
                            "%cWCAG AA Bericht (axe)",
                            "font-weight:bold",
                        );
                        console.log("Violations:", results.violations);
                        console.log("Incomplete:", results.incomplete);
                        console.log("Passes:", results.passes.length);
                        console.groupEnd();

                        results.violations.forEach((v) => {
                            console.groupCollapsed("❌", v.id, "-", v.help);
                            console.log("Impact:", v.impact);
                            console.log("Help:", v.helpUrl);
                            v.nodes.forEach((n) => {
                                console.log("Target:", n.target.join(" "));
                                if (n.failureSummary)
                                    console.log(n.failureSummary);
                            });
                            console.groupEnd();
                        });

                        return {
                            ok: true,
                            counts: {
                                violations: results.violations.length,
                                incomplete: results.incomplete.length,
                                passes: results.passes.length,
                            },
                        };
                    },
                });
                sendResponse(result ?? { ok: false, error: "no-result" });
                break;
            }
            case "run-aaa": {
                const [{ result }] = await chrome.scripting.executeScript({
                    target: { tabId: msg.tabId },
                    world: "MAIN",
                    func: async () => {
                        if (!window.axe)
                            return { ok: false, error: "axe-not-loaded" };

                        const results = await window.axe.run(document, {
                            runOnly: {
                                type: "tag",
                                values: ["wcag2aaa", "wcag21aaa", "wcag22aaa"],
                            },
                        });

                        console.groupCollapsed(
                            "%cWCAG AAA Bericht (axe)",
                            "font-weight:bold",
                        );
                        console.log("Violations:", results.violations);
                        console.log("Incomplete:", results.incomplete);
                        console.log("Passes:", results.passes.length);
                        console.groupEnd();

                        results.violations.forEach((v) => {
                            console.groupCollapsed("❌", v.id, "-", v.help);
                            console.log("Impact:", v.impact);
                            console.log("Help:", v.helpUrl);
                            v.nodes.forEach((n) => {
                                console.log("Target:", n.target.join(" "));
                                if (n.failureSummary)
                                    console.log(n.failureSummary);
                            });
                            console.groupEnd();
                        });

                        return {
                            ok: true,
                            counts: {
                                violations: results.violations.length,
                                incomplete: results.incomplete.length,
                                passes: results.passes.length,
                            },
                        };
                    },
                });
                sendResponse(result ?? { ok: false, error: "no-result" });
                break;
            }
            default:
                break;
        }
    })();

    return true;
});
