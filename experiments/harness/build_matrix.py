# Builds experiments/matrix.csv + experiments/runs/summary.json from per-run evidence. usage: python3 build_matrix.py <experiments_dir>
import csv, json, os, re, sys
from math import comb
E = sys.argv[1]; R = os.path.join(E, "runs")
usage = {l.split("\t")[0]: l.strip().split("\t")[1:] for l in open(os.path.join(R, "harness_usage.tsv"))}
index = {l.split("\t")[0]: l.strip().split("\t") for l in open(os.path.join(R, "run_index.tsv"))}
# Manual review overrides (documented in results.md#manual-review)
OVERRIDE = {("E05-control-r3", "R01_page_title_sds"): (True, "title via `const Title = isMobile ? TextTitlePage : TextTitleHero` (regex false negative)"),
            ("E02-treatment-r3", "R01_page_title_sds"): (True, "title via runtime alias of TextTitleHero/TextTitlePage (regex false negative)")}
NOTES = {"E06-treatment-r3": "R07 strict fail: Security alerts uses isReadOnly instead of isDisabled (defensible alternative)",
         "E06-treatment-r1": "no ButtonGroup (Cancel/Save in Flex); remove = plain IconButton",
         "E01-control-r4": "remove = DestructiveIconButton (correct destructive variant)",
         "E06-treatment-r2": "remove = DestructiveIconButton (correct destructive variant)"}
def run(rid):
    d = os.path.join(R, rid); sc = json.load(open(os.path.join(d, "score.json"))); rub = dict(sc["rubric"]); notes = []
    for (r, k), (v, why) in OVERRIDE.items():
        if r == rid: rub[k] = v; notes.append(f"{k} override: {why}")
    val = dict(re.findall(r"(\w+)=(\S+)", open(os.path.join(d, "validate.txt")).read().splitlines()[-1]))
    beh = json.load(open(os.path.join(d, "behaviour.json"))); a11y = json.load(open(os.path.join(d, "a11y.json")))
    tr = json.load(open(os.path.join(E, "traces", rid + ".json"))); tt = tr["trace"]; su = tr["summary"]
    first = next((i for i, t in enumerate(tt) if t["tool"] == "Write" and "TeamSettings" in t["arg"]), None)
    corr = 0
    if first is not None:
        for t in tt[first + 1:]:
            if t["tool"] in ("Edit", "Write") and "examples/" in t["arg"]: corr += 1
            elif t["tool"] == "Bash" and re.search(r"TeamSettings|team-?settings", t["arg"], re.I) and re.search(r"open\(|sed -i|cat >|prettier --write|> src/", t["arg"]): corr += 1
    src = open(os.path.join(E, "diffs", rid + ".patch")).read()
    remove_comp = "ButtonDanger" if "<ButtonDanger" in src else "DestructiveIconButton" if "<DestructiveIconButton" in src else "IconButton" if "<IconButton" in src else "other"
    V = {"V1_remove_destructive": rub["R10_remove_ButtonDanger"], "V2_cancel_nonprimary": rub["R12_cancel_nonprimary"], "V3_save_isDisabled": rub["R11_save_Button_isDisabled"],
         "V4_locked_switch_isDisabled": rub["R07_security_disabled"], "V5_error_alert_variant": 'variant="alert"' in src}
    tok_in = su["usage"]["input"] + su["usage"]["cache_read"] + su["usage"]["cache_create"]
    u = usage.get(rid, ["N/A"] * 3)
    return dict(run_id=rid, condition=index[rid][2], branch=f"experiment/{rid}", reuse=f'{sum(bool(v) for v in rub.values())}/15', reuse_n=sum(bool(v) for v in rub.values()),
                variants=f"{sum(V.values())}/5", variants_n=sum(V.values()), remove_component=remove_comp, local_abstractions=";".join(c for c in sc["local_components"] if c != "TeamSettings") or "none",
                inventions=0, raw_html=sum(sc["raw"].values()), rac_imports=sc["rac_imports"], css_lines=sc["loc_css"], css_px=sc["css"]["css_px"], css_hex=sc["css"]["css_hex"], tsx_lines=sc["loc_tsx"],
                corrections=corr, tool_calls=su["tool_calls"] - 1, figma_calls=su["by_tool"].get("figma_mcp", 0), harness_tokens=u[0], cumulative_input_tokens=tok_in,
                duration_s=round(int(u[2]) / 1000) if u[2] != "N/A" else "N/A", tsc_new=val.get("tsc_new"), eslint_errors=val.get("eslint_errors"), vite_build=val.get("vite_build"),
                behaviour=beh["passed"], focusable=len(a11y.get("keyboard_focus_sequence", [])), unlabelled=len(a11y.get("unlabelled_controls", [])), mobile_overflow=a11y["mobile"]["horizontal_overflow"],
                failed_rubric=";".join(k for k, v in rub.items() if not v) or "none", notes="; ".join(notes + ([NOTES[rid]] if rid in NOTES else [])), V=V)
runs = {rid: run(rid) for rid in sorted(index)}
def ids(prefix): return [r for r in runs if r.startswith(prefix)]
CTRL = ids("E01-control"); SEARCH = ids("E01-treatment"); FIG = ids("E02-treatment"); DESC = ids("E04-treatment"); DUMP = ids("E05-control"); VAL = ids("E06-treatment"); SKILL = ids("E13-treatment")
rows = []
def add(exp, arm, rid_list, state, note=""):
    for rid in rid_list:
        r = runs[rid]; rows.append({"experiment": exp, "arm": arm, "state": state, "seed": "N/A", **{k: v for k, v in r.items() if k not in ("V", "reuse_n", "variants_n")}, "notes": "; ".join(x for x in [note, r["notes"]] if x)})
add("E01", "control", CTRL, "CODE-ONLY"); add("E01", "treatment", SEARCH, "CODE-ONLY")
add("E02", "control", CTRL, "CODE-ONLY", "shared control = E01 control runs"); add("E02", "treatment", FIG, "REAL")
add("E04", "control", FIG, "REAL", "shared = E02 treatment runs (original Figma descriptions)"); add("E04", "treatment", DESC, "REAL")
add("E05", "control", DUMP, "CODE-ONLY", "full docs file read up front"); add("E05", "treatment", SEARCH, "CODE-ONLY", "shared = E01 treatment runs (targeted search)")
add("E06", "control", CTRL, "CODE-ONLY", "shared control = E01 control runs (no validation)"); add("E06", "treatment", VAL, "CODE-ONLY")
add("E13", "control", CTRL, "CODE-ONLY", "shared control = E01 control runs (repo AGENTS.md only)"); add("E13", "treatment", SKILL, "CODE-ONLY")
blank = {k: "N/A" for k in rows[0]}
def meta(exp, arm, state, note, **kw): rows.append({**blank, "experiment": exp, "arm": arm, "state": state, "run_id": "N/A", "seed": "N/A", "notes": note, **kw})
meta("E03", "control+treatment", "BLOCKED", "No Code Connect mappings published for duplicate file mchDCUgpbpnntD9vMBJlzC (get_code_connect_map returned {} on sets and variants; get_design_context returned no Code Connect snippets). Publishing requires explicit approval; not done.")
meta("E07", "derived", "CODE-ONLY+REAL", "Variant correctness scored on all 21 runs via V1-V5 (see V-columns in runs/summary.json); not a separate prompt")
meta("E08", "derived", "CODE-ONLY+REAL", "Composition scored on all runs: R02/R13/R15 + Form/Fieldset/SwitchGroup use; not a separate prompt")
meta("E09", "derived", "CODE-ONLY+REAL", "Abstraction boundary scored on all runs: local_abstractions column; 0 new design-system primitives in 21/21 runs")
for e, why in [("E10", "time prioritised for repetitions of primary pairs"), ("E11", "requires stale-example fixture branch; prioritised repetitions"), ("E12", "would need equivalent guidance in 3 placements incl. Figma; partially informed by E04 vs E13 but not a controlled test"), ("E14", "overlaps E06; no custom lint rules added per handoff")]:
    meta(e, "N/A", "NOT RUN", why)
ref = json.load(open(os.path.join(R, "reference", "behaviour.json")))
meta("E15", "reference implementation", "CODE-ONLY", "Orchestrator-written reference page on PR branch: tsc_new=0, eslint 0, vite build pass, behaviour 9/9, keyboard 10 stops, 0 unlabelled, no mobile overflow; screenshots/reference-*.png", behaviour=ref["passed"], tsc_new=0, eslint_errors=0, vite_build="pass", run_id="reference", reuse="15/15")
cols = ["experiment", "arm", "state", "run_id", "seed", "condition", "branch", "reuse", "variants", "remove_component", "inventions", "local_abstractions", "corrections", "tool_calls", "figma_calls", "harness_tokens", "cumulative_input_tokens", "duration_s", "tsc_new", "eslint_errors", "vite_build", "behaviour", "focusable", "unlabelled", "mobile_overflow", "raw_html", "rac_imports", "tsx_lines", "css_lines", "css_px", "css_hex", "failed_rubric", "notes"]
with open(os.path.join(E, "matrix.csv"), "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore"); w.writeheader(); [w.writerow(r) for r in rows]
# condition summaries
def agg(lst):
    import statistics as st
    g = [runs[r] for r in lst]
    return {"n": len(g), "remove_destructive": f'{sum(r["V"]["V1_remove_destructive"] for r in g)}/{len(g)}', "reuse_mean": round(st.mean(r["reuse_n"] for r in g), 2),
            "variants_mean": round(st.mean(r["variants_n"] for r in g), 2), "tool_calls_mean": round(st.mean(r["tool_calls"] for r in g), 1),
            "cumulative_input_tokens_mean": round(st.mean(r["cumulative_input_tokens"] for r in g)), "harness_tokens_mean": round(st.mean(int(r["harness_tokens"]) for r in g)),
            "duration_s_mean": round(st.mean(r["duration_s"] for r in g)), "corrections_total": sum(r["corrections"] for r in g),
            "tsc_new_total": sum(int(r["tsc_new"]) for r in g), "eslint_errors_total": sum(int(r["eslint_errors"]) for r in g), "build_pass": f'{sum(r["vite_build"] == "pass" for r in g)}/{len(g)}',
            "behaviour": sorted({r["behaviour"] for r in g}), "local_abstractions": sorted({r["local_abstractions"] for r in g}), "css_files": sum(1 for r in g if r["css_lines"]), "remove_components": [r["remove_component"] for r in g]}
groups = {"text_only (E01/E02/E06/E13 control)": CTRL, "search (E01 treatment, E05 treatment)": SEARCH, "figma (E02 treatment, E04 control)": FIG, "figma+descriptions (E04 treatment)": DESC, "fulldump (E05 control)": DUMP, "validate (E06 treatment)": VAL, "skill (E13 treatment)": SKILL}
summ = {k: agg(v) for k, v in groups.items()}
def fisher(a, b, c, d):  # two-sided Fisher exact for [[a,b],[c,d]]
    n = a + b + c + d; r1 = a + b; c1 = a + c
    p = lambda x: comb(r1, x) * comb(n - r1, c1 - x) / comb(n, c1)
    p0 = p(a); return round(sum(p(x) for x in range(max(0, c1 - (n - r1)), min(r1, c1) + 1) if p(x) <= p0 + 1e-12), 4)
def ct(lst): k = sum(runs[r]["V"]["V1_remove_destructive"] for r in lst); return k, len(lst) - k
tests = {}
for name, A, B in [("text_only vs skill", CTRL, SKILL), ("text_only vs figma", CTRL, FIG), ("text_only vs fulldump", CTRL, DUMP), ("text_only vs search", CTRL, SEARCH), ("text_only vs validate", CTRL, VAL),
                   ("repo-only (text+search+validate) vs explicit/complete context (figma+desc+fulldump+skill)", CTRL + SEARCH + VAL, FIG + DESC + DUMP + SKILL)]:
    a, b = ct(B); c, d = ct(A); tests[name] = {"treatment": f"{a}/{a+b}", "control": f"{c}/{c+d}", "fisher_two_sided_p": fisher(a, b, c, d)}
json.dump({"by_condition": summ, "remove_destructive_tests": tests, "runs": {k: {kk: vv for kk, vv in v.items()} for k, v in runs.items()}}, open(os.path.join(R, "summary.json"), "w"), indent=1)
print(json.dumps(summ, indent=1)); print(json.dumps(tests, indent=1))
