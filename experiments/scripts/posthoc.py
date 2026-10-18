import os,pathlib,signal,subprocess,time,urllib.request
root=pathlib.Path(__file__).resolve().parents[2]
for i,run in enumerate(['E01-control-r1','E01-search-r1','E13-skill-r1','E06-validated-r1']):
 port=8201+i;work=pathlib.Path('/workspace/sds-runs')/run;trace=root/'experiments/traces'/run
 with (trace/'posthoc-server.log').open('w') as f:
  s=subprocess.Popen(['npm','run','app:dev','--','--host','127.0.0.1','--port',str(port),'--strictPort'],cwd=work,stdout=f,stderr=subprocess.STDOUT,start_new_session=True)
  try:
   for _ in range(100):
    try:
     urllib.request.urlopen(f'http://127.0.0.1:{port}/',timeout=1).close();break
    except Exception:time.sleep(.1)
   with (trace/'posthoc.log').open('w') as log:subprocess.run(['node',str(root/'experiments/scripts/posthoc.mjs'),run,f'http://127.0.0.1:{port}/'],cwd=work,stdout=log,stderr=subprocess.STDOUT,check=True)
  finally:os.killpg(s.pid,signal.SIGTERM);s.wait(timeout=10)
print('Post-hoc audit complete, separate from fixed initial score.')
