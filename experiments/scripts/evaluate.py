#!/usr/bin/env python3
"""Independent build/lint + same browser evaluator per condition. No repairs."""
import argparse,datetime,json,os,pathlib,signal,subprocess,time,urllib.request
p=argparse.ArgumentParser();p.add_argument('run');p.add_argument('--port',type=int,default=8101);a=p.parse_args()
repo=pathlib.Path(__file__).resolve().parents[2]; work=pathlib.Path('/workspace/sds-runs')/a.run;out=repo/'experiments/traces'/a.run;out.mkdir(parents=True,exist_ok=True)
summary={'run_id':a.run,'evaluation_started_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'commands':{}}
for name,cmd in [('build',['npm','run','app:build']),('lint',['./node_modules/.bin/eslint','src/App.tsx',*(['src/TeamSettings.tsx'] if (work/'src/TeamSettings.tsx').exists() else []),'--max-warnings','0'])]:
 t=time.monotonic()
 with (out/f'{name}.log').open('w') as f:r=subprocess.run(cmd,cwd=work,stdout=f,stderr=subprocess.STDOUT)
 summary['commands'][name]={'command':cmd,'exit_code':r.returncode,'seconds':round(time.monotonic()-t,3)}
with (out/'server.log').open('w') as log:
 server=subprocess.Popen(['npm','run','app:dev','--','--host','127.0.0.1','--port',str(a.port),'--strictPort'],cwd=work,stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
 try:
  ready=False
  for _ in range(100):
   if server.poll() is not None:break
   try:
    with urllib.request.urlopen(f'http://127.0.0.1:{a.port}/',timeout=1) as response:ready=response.status==200
   except Exception:pass
   if ready:break
   time.sleep(.1)
  summary['http_ready']=ready
  if ready:
   with (out/'browser.log').open('w') as f:r=subprocess.run(['node',str(repo/'experiments/scripts/browser.mjs'),a.run,f'http://127.0.0.1:{a.port}/'],cwd=work,stdout=f,stderr=subprocess.STDOUT)
   summary['commands']['browser']={'exit_code':r.returncode}
 finally:
  try:os.killpg(server.pid,signal.SIGTERM)
  except ProcessLookupError:pass
  server.wait(timeout=10)
summary['evaluation_finished_at']=datetime.datetime.now(datetime.timezone.utc).isoformat()
(out/'evaluation.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary))

raise SystemExit(0 if summary.get("http_ready") and all(c["exit_code"]==0 for c in summary["commands"].values()) else 1)
