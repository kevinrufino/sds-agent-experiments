# Normalize a subagent JSONL transcript into a chronological tool trace + totals.
# usage: python3 -I trace.py <jsonl> <out.md> <out.json>
import json, sys
src, out_md, out_json = sys.argv[1:4]
rows, usage, t0, t1 = [], {"input": 0, "output": 0, "cache_read": 0, "cache_create": 0}, None, None
seen_msg = set()
for line in open(src):
    d = json.loads(line); ts = d.get("timestamp")
    if ts: t0 = t0 or ts; t1 = ts
    if d.get("type") != "assistant": continue
    m = d.get("message", {}); mid = m.get("id")
    u = m.get("usage") or {}
    if mid not in seen_msg:
        seen_msg.add(mid)
        usage["input"] += u.get("input_tokens", 0) or 0; usage["output"] += u.get("output_tokens", 0) or 0
        usage["cache_read"] += u.get("cache_read_input_tokens", 0) or 0; usage["cache_create"] += u.get("cache_creation_input_tokens", 0) or 0
    for c in m.get("content", []) or []:
        if c.get("type") != "tool_use": continue
        inp = c.get("input", {}); name = c.get("name")
        if name == "Bash": arg = inp.get("command", "")
        elif name in ("Read", "Write", "Edit"): arg = inp.get("file_path", "")
        elif name in ("Grep", "Glob"): arg = f"{inp.get('pattern','')} @ {inp.get('path','')}"
        elif name == "ToolSearch": arg = inp.get("query", "")
        elif name == "Skill": arg = inp.get("skill", "")
        elif name.startswith("mcp__Figma__"): arg = json.dumps({k: v for k, v in inp.items() if k in ("nodeId", "fileKey", "queries", "disableCodeConnect")})
        else: arg = json.dumps(inp)[:200]
        rows.append({"t": ts, "tool": name, "arg": arg.replace("\n", " ")[:300]})
cats = {}
for r in rows:
    k = "figma_mcp" if r["tool"].startswith("mcp__Figma__") else r["tool"]
    cats[k] = cats.get(k, 0) + 1
summary = {"tool_calls": len(rows), "by_tool": cats, "usage": usage, "start": t0, "end": t1,
           "figma_calls": [r for r in rows if r["tool"].startswith("mcp__Figma__")],
           "files_read": sorted({r["arg"] for r in rows if r["tool"] == "Read"})}
json.dump({"summary": summary, "trace": rows}, open(out_json, "w"), indent=1)
with open(out_md, "w") as f:
    f.write(f"# Trace\n\nstart {t0} / end {t1}\n\ntool calls: {len(rows)} — {cats}\n\ntokens (API usage, summed over assistant messages): {usage}\n\n| # | time | tool | argument |\n|---|---|---|---|\n")
    for i, r in enumerate(rows, 1):
        f.write(f"| {i} | {r['t'][11:19] if r['t'] else ''} | {r['tool']} | `{r['arg'].replace('|','/')[:180]}` |\n")
print(json.dumps({k: summary[k] for k in ("tool_calls", "by_tool", "usage", "start", "end")}))
