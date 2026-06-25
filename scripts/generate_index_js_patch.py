import base64, zlib
from os import path
import bs4, requests as r

def main():
    with open(path.join(path.dirname(__file__), "../index-js-orig/template.index-js-patch.js")) as f:
        template = f.read()
    with open(path.join(path.dirname(__file__), "../index-js-orig/index.js.patch")) as f:
        patch = f.read()

    app = bs4.BeautifulSoup(r.get("https://winnipegtransit.com/").text, "html.parser")
    patch_version = app.select_one('script[src*="_expo/static/js/web"]').get("src") + "?"
    print(f"Patch version: {patch_version}")

    template = template.replace("%PATCH_VERSION%", patch_version)
    template = template.replace("%PATCH%", base64.b64encode(zlib.compress(patch.encode("utf-8"))).decode("utf-8"))

    with open(path.join(path.dirname(__file__), "../index-js-patch.js"), "w") as f:
        f.write(template)
    
if __name__ == "__main__":
    main()