#!/usr/bin/env python3
"""Instrument actual repository retrieval. Invoke from a run's working directory."""
import argparse, datetime, hashlib, json, pathlib, subprocess, sys, time
p=argparse.ArgumentParser(); p.add_argument('--evidence',required=True); p.add_argument('operation',choices=['read','search']); p.add_argument('arguments',nargs='+'); a=p.parse_args()
t0=time.monotonic(); stamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
cmd=['cat','--',*a.arguments] if a.operation=='read' else ['rg','-n','--',*a.arguments]
r=subprocess.run(cmd,capture_output=True,text=True)
e=pathlib.Path(a.evidence); e.mkdir(parents=True,exist_ok=True)
record={'timestamp':stamp,'cwd':str(pathlib.Path.cwd()),'operation':a.operation,'arguments':a.arguments,'exit_code':r.returncode,'duration_seconds':round(time.monotonic()-t0,6),'stdout_bytes':len(r.stdout.encode()),'stdout_sha256':hashlib.sha256(r.stdout.encode()).hexdigest()}
with (e/'retrieval.jsonl').open('a') as f:f.write(json.dumps(record)+'\n')
n=len((e/'retrieval.jsonl').read_text().splitlines()); (e/f'retrieval-{n:02d}.txt').write_text(r.stdout+r.stderr)
sys.stdout.write(r.stdout);sys.stderr.write(r.stderr);sys.exit(r.returncode)
