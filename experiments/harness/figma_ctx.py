# Extract what Figma MCP returned to an agent: descriptions block, code-connect mentions, sizes.
import json, sys, re
src, out = sys.argv[1:3]
calls = {}; res = []
for line in open(src):
    d = json.loads(line); m = d.get("message", {})
    for c in (m.get("content") or []) if isinstance(m.get("content"), list) else []:
        if c.get("type") == "tool_use" and c.get("name", "").startswith("mcp__Figma__"): calls[c["id"]] = (c["name"], c.get("input"))
        if c.get("type") == "tool_result" and c.get("tool_use_id") in calls:
            cont = c.get("content"); txt = ""
            if isinstance(cont, list): txt = "\n".join(x.get("text", "") for x in cont if x.get("type") == "text")
            else: txt = str(cont)
            name, inp = calls[c["tool_use_id"]]
            desc = re.search(r"Component descriptions:.*?(?=\n<|\Z)", txt, re.S)
            res.append({"tool": name, "input": inp, "result_chars": len(txt),
                        "mentions_code_connect": bool(re.search(r"code ?connect|codeConnect|CodeConnectSnippet", txt, re.I)),
                        "has_image": isinstance(cont, list) and any(x.get("type") == "image" for x in cont),
                        "component_descriptions_block": desc.group(0)[:4000] if desc else None,
                        "code_connect_lines": [l[:200] for l in txt.split("\n") if re.search(r"code ?connect|codeConnect", l, re.I)][:10]})
json.dump(res, open(out, "w"), indent=1)
for r in res: print(r["tool"], r["result_chars"], "CC:", r["mentions_code_connect"], r["code_connect_lines"][:3], "\nDESC:", (r["component_descriptions_block"] or "None")[:1500].replace("\n", " | "))
