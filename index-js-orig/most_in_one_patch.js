(async () => {
    document.body.insertAdjacentHTML("afterbegin", `
        <div id="custom-script-loader" style="margin: 1em">
            <h1 id="custom-script-status">Loading...</h1>
            <p id="custom-script-error" style="white-space: pre-wrap; word-break: break-word;"></p>
        </div>
    `);
    function updateStatus(text) {
        document.getElementById("custom-script-status").textContent = text;
    }

    try {
        updateStatus("Loading dependencies...");
        const { default: localforage } = await import("https://cdn.jsdelivr.net/npm/localforage@1/+esm");
        const appScriptEl = document.querySelector('script[src*="_expo/static/js/web"]');
        const appScriptSrc = appScriptEl.getAttribute("src") + "?";

        let appScript;
        if ((await localforage.getItem("appScriptSrc")) !== appScriptSrc) { // Not cached or cache version is outdated

            const Diff = await import("https://cdn.jsdelivr.net/npm/diff@9/+esm");
            const { default: chromiumFormatter } = await import("https://cdn.jsdelivr.net/npm/chromium-formatters@1/dist/main.esm.min.js");

            updateStatus("Fetching patch...");
            const patch = await (await fetch("https://raw.githubusercontent.com/CyrilSLi/wt-websocket-tracker/main/index-js-orig/index.js.patch")).text();

            updateStatus("Patching JS bundle... (this may take a while)");
            appScript = await (await fetch(appScriptSrc)).text();
            ({ content: appScript } = chromiumFormatter("text/javascript", appScript));
            appScript = Diff.applyPatch(appScript, patch);

            updateStatus("Saving patched app...");
            localforage.config({ name: "wt-custom-tracker" });
            await localforage.clear();
            await localforage.setItem("appScriptSrc", appScriptSrc);
            await localforage.setItem("patchedAppScript", appScript);
        }

        updateStatus("Loading app...");
        appScript = await localforage.getItem("patchedAppScript");
        const patchedScriptEl = document.createElement("script");
        patchedScriptEl.textContent = appScript;
        document.getElementById("custom-script-loader").remove();
        appScriptEl.replaceWith(patchedScriptEl);

    } catch (e) {
        updateStatus("Error:");
        document.getElementById("custom-script-error").textContent = e.stack || e;
        console.error(e);
    }
})();