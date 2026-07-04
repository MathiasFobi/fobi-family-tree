# Fobi Family Tree — Scripts

## `import-xlsx.py`

Converts the family spreadsheet (`Vincent_and_Barbara_Fobi_Descendants.xlsx`) into the `data/family.json` file the site uses.

### Setup (one-time)

```bash
pip3 install openpyxl --break-system-packages
```

### Usage

```bash
# Default — looks for the spreadsheet in the project root
python3 scripts/import-xlsx.py

# Or pass a custom path
python3 scripts/import-xlsx.py /path/to/spreadsheet.xlsx
```

### Workflow when updating the tree

1. Edit the spreadsheet (add a new family member, mark a RIP, fix a typo)
2. Run `python3 scripts/import-xlsx.py`
3. `git add data/family.json && git commit -m "Update family data"`
4. `git push origin main` → Vercel auto-deploys

The site has 194 person pages statically generated from this JSON, so any new
family member with a unique name will get their own page automatically.
