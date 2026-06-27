import json, os, re, shutil
import bs4, requests as r

patched_path = os.path.join(os.path.dirname(__file__), "../index-js-orig/index-patched.js")

with open(patched_path) as f:
    index_patched = f.read()
shutil.copy2(patched_path, patched_path.replace(".js", ".bak.js"))

def update_variable(name, value):
    global index_patched
    if not isinstance(value, str):
        value = json.dumps(value, separators=(",", ":"))
    delimiter = f"/* %{name}% */"
    start = index_patched.find(delimiter) + len(delimiter)
    end = index_patched.find(delimiter, start)
    index_patched = index_patched[:start] + value + index_patched[end:]
    print(f'Updated variable "{name}" with "{value}"')
print()



routes = r.get("https://winnipegtransit.com/api/v2/routes").json()
sort_routes = lambda route: re.sub(r"[a-zA-Z]", "", route).rjust(10, "0") if any(char.isdigit() for char in route) else route
update_variable("allRoutesList", sorted((route["id"] for route in routes), key=sort_routes))

models_by_id = []
wiki_page = bs4.BeautifulSoup(r.get("https://cptdb.ca/wiki/api.php?action=parse&page=Winnipeg_Transit&prop=text&format=json").json()["parse"]["text"]["*"], "html.parser")
fleet_table = wiki_page.find_all("th", string=re.compile(r"fleet number", re.IGNORECASE))[0]
while fleet_table.name != "table":
    fleet_table = fleet_table.parent

header = [th.get_text(strip=True).lower() for th in fleet_table.find_all("th")]
for tr in fleet_table.find_all("tr")[1:]:
    row = {th: td.get_text(strip=True) for th, td in zip(header, tr.find_all("td"))}
    for segment in row["fleet number"].split(","):
        models_by_id.append([*map(lambda num: int(num.strip()), segment.split("-", 1)), row["year"], row["model"]])
update_variable("busModelsById", models_by_id)


print()
with open(patched_path, "w") as f:
    f.write(index_patched)