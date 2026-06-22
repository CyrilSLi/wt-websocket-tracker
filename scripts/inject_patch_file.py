import glob, re
def main():
    with open(next(glob.iglob("index-js-orig/*.html"))) as f:
        file = f.read()
    with open(next(glob.iglob("index-js-orig/*.patch"))) as f:
        patch = f.read().replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    file = re.sub(r"(\/\* START_OF_PATCH \*\/`\n).*?(\n`;\/\* END_OF_PATCH \*\/)", lambda m: m.group(1) + patch + m.group(2), file, flags=re.DOTALL)
    with open(next(glob.iglob("index-js-orig/*.html")), "w") as f:
        f.write(file)
if __name__ == "__main__":
    main()