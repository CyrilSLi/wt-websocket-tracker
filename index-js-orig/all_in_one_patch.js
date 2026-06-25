async function onRequest(context, request) {
    return request;
}

async function onResponse(context, request, response) {
    if (["stops", "routes", "onthego"].includes(request.path.split("/", 2)[1]) && !Object.hasOwn(request.queries, "custom-script-orig")) {
        response.body = `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Winnipeg Transit</title>
    <script src="https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/diff@9.0.0/dist/diff.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chromium-formatters@1.0/dist/main.min.js"></script>
</head>
<body>
    <div style="margin: 1em">
        <h1 id="status">Loading...</h1>
        <p id="errors" style="white-space: pre-wrap; word-break: break-word;"></p>
    </div>
    <script>
        (async () => {
            try {
                function updateStatus(text) {
                    document.getElementById("status").textContent = text;
                }

                updateStatus("Fetching app HTML...");
                const appSrc = new URL(window.location.href);
                appSrc.searchParams.set("custom-script-orig", "1");
                const appHTML = new DOMParser().parseFromString(await (await fetch(appSrc)).text(), "text/html").documentElement;
                const appScriptEl = appHTML.querySelector('script[src*="_expo/static/js/web"]');
                const appScriptSrc = appScriptEl.getAttribute("src");

                let appScript = await localforage.getItem("patchedAppScript");
                if (!appScript || (await localforage.getItem("appScriptSrc")) !== appScriptSrc) { // Not cached or cache version is outdated

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
                appScriptEl.removeAttribute("src");
                document.documentElement.replaceWith(appHTML);
                const patchedScriptEl = document.createElement("script");
                patchedScriptEl.textContent = appScript;
                appScriptEl.replaceWith(patchedScriptEl);
            } catch (e) {
                updateStatus("Error:");
                document.getElementById("errors").textContent = e.stack || e;
            }
        })();
    </script>
</body>
</html>

        `;
    }
    response.headers["Cache-Control"] = "public, max-age=31536000, immutable";
    return response;
}