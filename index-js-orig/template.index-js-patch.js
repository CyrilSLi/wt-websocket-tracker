(async () => {
    document.body.insertAdjacentHTML("afterbegin", `
        <div id="custom-script-loader" style="width: 100vw; box-sizing: border-box; padding: 20px; font-family: sans-serif; background-color: white; color: black;">
            <h1 id="custom-script-status" style="margin: 0; margin-bottom: 10px; font-size: 28px;">Loading...</h1>
            <pre id="custom-script-error" style="overflow: scroll; margin: 0; font-size: 20px;"></pre>
        </div>
    `);
    function updateStatus(text) {
        document.getElementById("custom-script-status").textContent = text;
    }
    function decompress(base64) {
        return new Response(
            new ReadableStream({
                start(controller) {
                    controller.enqueue(Uint8Array.from(atob(base64), c => c.charCodeAt(0)));
                    controller.close();
                }
            }).pipeThrough(new DecompressionStream("deflate"))
        ).text();
    }

    try {
        updateStatus("Loading dependencies...");
        const localforageUrl = URL.createObjectURL(new Blob([await decompress(

"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"

        )], { type: "text/javascript" }));
        const { default: localforage } = await import(localforageUrl);
        URL.revokeObjectURL(localforageUrl);
        const appScriptEl = document.querySelector('script[src*="_expo/static/js/web"]');
        let appScript;

        function replaceScript(newScript, isUrl = false) {
            const newScriptEl = document.createElement("script");
            newScriptEl[isUrl ? "src" : "textContent"] = newScript;
            document.getElementById("custom-script-loader").remove();
            appScriptEl.replaceWith(newScriptEl);
        }

        const appVersion = appScriptEl.getAttribute("src") + "?";
        const patchVersion = "%PATCH_VERSION%";
        const cachedVersion = await localforage.getItem("appVersion");

        if (appVersion !== patchVersion) {
            if (!cachedVersion) { // No cached patch and patch is outdated
                alert("Patch version outdated. Custom features will be disabled until the developer updates the patch.");
                replaceScript(appVersion, isUrl = true);
                return;
            } else { // Cached patch exists but is outdated
                updateStatus("Loading app...");
                appScript = await localforage.getItem("patchedApp");
            }

        } else {
            if (cachedVersion === appVersion) { // Cached patch is up to date
                updateStatus("Loading app...");
                appScript = await localforage.getItem("patchedApp");

            } else { // Patch available to download or update
                const Diff = await import("https://cdn.jsdelivr.net/npm/diff@9.0.0/+esm");
                const { default: chromiumFormatter } = await import("https://cdn.jsdelivr.net/npm/chromium-formatters@1.0/dist/main.esm.min.js");
                const patch = await decompress(

"%PATCH%"

                );

                updateStatus("Patching JS bundle... (this may take a while)");
                appScript = await (await fetch(appVersion)).text();
                ({ content: appScript } = chromiumFormatter("text/javascript", appScript));
                appScript = Diff.applyPatch(appScript, patch);

                updateStatus("Saving patched app...");
                localforage.config({ name: "wt-custom-tracker" });
                await localforage.clear();
                await localforage.setItem("appVersion", appVersion);
                await localforage.setItem("patchedApp", appScript);
            }

        }
        updateStatus("Loading app...");
        replaceScript(appScript);

    } catch (e) {
        updateStatus("Error:");
        document.getElementById("custom-script-error").textContent = e.stack || e;
        console.error(e);
    }
})();