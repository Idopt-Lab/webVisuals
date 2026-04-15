"""
Updates docs.json in the Mintlify repo after each sync:
  - Fixes default Mintlify branding on first run
  - Rebuilds the navigation tab for the source repo
"""
import glob
import json
import os

REPO_SLUG = os.environ["REPO_SLUG"]
REPO_TAB_LABEL = os.environ["REPO_TAB_LABEL"]

with open("docs.json") as f:
    config = json.load(f)

if config.get("name") in ("Mint Starter Kit", ""):
    config["name"] = "Idopt Lab"
if config.get("colors", {}).get("primary") == "#16A34A":
    config["colors"] = {
        "primary": "#2563EB",
        "light": "#3B82F6",
        "dark": "#1D4ED8",
    }

navbar = config.get("navbar", {})
links = navbar.get("links", [])
if any(l.get("href", "").endswith("mintlify.com") for l in links):
    navbar["links"] = []
primary_btn = navbar.get("primary", {})
if "dashboard.mintlify.com" in primary_btn.get("href", ""):
    navbar.pop("primary", None)
config["navbar"] = navbar

footer = config.get("footer", {})
socials = footer.get("socials", {})
if socials.get("github") == "https://github.com/mintlify":
    footer["socials"] = {"github": "https://github.com/idopt-lab"}
    config["footer"] = footer

mdx_files = sorted(glob.glob(f"{REPO_SLUG}/**/*.mdx", recursive=True))
pages = [f.replace(".mdx", "") for f in mdx_files]

if not pages:
    print("No .mdx files found under subfolder — skipping navigation update")
else:
    top_level = [p for p in pages if p.count("/") == 1]
    subdirs: dict = {}
    for p in pages:
        if p.count("/") > 1:
            group_name = p.split("/")[1].replace("-", " ").title()
            subdirs.setdefault(group_name, []).append(p)

    groups = []
    if top_level:
        groups.append({"group": REPO_TAB_LABEL, "pages": top_level})
    for group_name, group_pages in sorted(subdirs.items()):
        groups.append({"group": group_name, "pages": group_pages})

    nav = config.setdefault("navigation", {})
    tabs = nav.setdefault("tabs", [])
    existing = next((t for t in tabs if t.get("tab") == REPO_TAB_LABEL), None)
    if existing:
        existing["groups"] = groups
    else:
        tabs.append({"tab": REPO_TAB_LABEL, "groups": groups})

    print(f"Updated docs.json: {len(pages)} page(s) under '{REPO_TAB_LABEL}' tab")

with open("docs.json", "w") as f:
    json.dump(config, f, indent=2)
    f.write("\n")
