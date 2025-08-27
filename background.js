async function wcag(level) {
    if (!window.axe) return { ok: false, error: "axe-not-loaded" };

    const results = await window.axe.run(document, {
        runOnly: {
            type: "tag",
            values: [`wcag2${level}`, `wcag21${level}`, `wcag22${level}`],
        },
    });

    const styleHeader =
        "background:#111;color:#fff;font-weight:bold;padding:2px 6px;border-radius:4px;";
    const styleSubtle = "color:#888";
    const styleOk = "color:#0a7c2f;font-weight:bold";
    const styleBad = "color:#b00020;font-weight:bold";
    const styleWarn = "color:#b36b00;font-weight:bold";

    const byImpact = groupBy(
        results.violations,
        (v) => v.impact || "no-impact",
    );
    const totalNodes = results.violations.reduce(
        (acc, v) => acc + v.nodes.length,
        0,
    );

    console.groupCollapsed(
        `%cWCAG ${level.toUpperCase()} Report (axe)%c  violations:${results.violations.length}  nodes:${totalNodes}`,
        styleHeader,
        styleSubtle,
    );

    // Summary-Zeile
    console.log(
        "%cViolations:%c %d   %cIncomplete:%c %d   %cPasses:%c %d   %cTags:%c %o",
        styleBad,
        "",
        results.violations.length,
        styleWarn,
        "",
        results.incomplete.length,
        styleOk,
        "",
        results.passes.length,
        "font-weight:bold",
        "",
        results.tested || [],
    );

    // 3a) Violations kompakt nach Impact
    Object.entries(byImpact).forEach(([impact, rules]) => {
        const badge = impact.toUpperCase();
        const color =
            impact === "critical" || impact === "serious"
                ? styleBad
                : impact === "moderate"
                  ? styleWarn
                  : styleSubtle;
        console.groupCollapsed(
            `%c${badge}%c ${rules.length} rule(s)`,
            color,
            "",
        );
        rules.forEach((rule) => logRule(rule));
        console.groupEnd();
    });

    // 3b) Incomplete separat
    if (results.incomplete.length) {
        console.groupCollapsed(
            "%cINCOMPLETE%c (Review Needed) " + results.incomplete.length,
            styleWarn,
            "",
        );
        results.incomplete.forEach((rule) => logRule(rule));
        console.groupEnd();
    }

    // 3c) Kleiner Passes-Hinweis
    console.log("%cPasses (count):%c %d", styleOk, "", results.passes.length);

    console.groupEnd();

    // --- helper: Regel hübsch loggen
    function logRule(rule) {
        const head = `%c${rule.id}%c — ${rule.help}`;
        const headStyle1 = "font-weight:bold";
        const headStyle2 = "";

        console.groupCollapsed(head, headStyle1, headStyle2);
        console.log("Impact:", rule.impact || "n/a");
        console.log("Help:", rule.helpUrl);
        console.log("Description:", rule.description);
        // Tabelle der betroffenen Nodes
        try {
            const rows = rule.nodes.map((n) => ({
                target: n.target.join(" "),
                html: n.html?.slice(0, 200) ?? "",
                failureSummary: (n.failureSummary || "")
                    .replace(/\s+/g, " ")
                    .slice(0, 200),
            }));
            console.table(rows);
        } catch {
            // Fallback, wenn console.table nicht klappt
            rule.nodes.forEach((n) => {
                console.log("Target:", n.target.join(" "));
                if (n.failureSummary) console.log("Summary:", n.failureSummary);
            });
        }
        // Kurze Remediation-Tipps (ein paar gängige Regeln)
        hint(rule.id);
        console.groupEnd();
    }

    function hint(ruleId) {
        const hints = {
            "image-alt":
                'Füge sinnvolle alt-Texte zu <img> hinzu. Deko-Bilder: alt="" + role="presentation".',
            "color-contrast":
                "Kontrastverhältnis Text/Hintergrund verbessern (mind. 4.5:1, Large Text 3:1).",
            label: "Form-Controls mit sichtbaren <label for> oder aria-label/aria-labelledby verknüpfen.",
            "aria-valid-attr-value":
                "Ungültige ARIA-Attributwerte korrigieren; nur erlaubte Tokens nutzen.",
        };
        const tip = hints[ruleId];
        if (tip) console.log("%cFix hint:%c " + tip, "font-weight:bold", "");
    }

    function groupBy(arr, keyFn) {
        return arr.reduce((m, x) => {
            const k = keyFn(x);
            (m[k] ||= []).push(x);
            return m;
        }, {});
    }

    return {
        ok: true,
        counts: {
            violations: results.violations.length,
            incomplete: results.incomplete.length,
            passes: results.passes.length,
        },
    };
}

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
                    func: wcag,
                    args: ["a"],
                });
                sendResponse(result ?? { ok: false, error: "no-result" });
                break;
            }
            case "run-aa": {
                const [{ result }] = await chrome.scripting.executeScript({
                    target: { tabId: msg.tabId },
                    world: "MAIN",
                    func: wcag,
                    args: ["aa"],
                });
                sendResponse(result ?? { ok: false, error: "no-result" });
                break;
            }
            case "run-aaa": {
                const [{ result }] = await chrome.scripting.executeScript({
                    target: { tabId: msg.tabId },
                    world: "MAIN",
                    func: wcag,
                    args: ["aaa"],
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
