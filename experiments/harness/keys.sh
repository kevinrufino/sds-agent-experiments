#!/bin/bash
# manual review aid: show the JSX for key decisions (remove action, buttons, notifications, title)
for d in /home/user/runs/E*; do r=$(basename $d); f=$d/src/examples/TeamSettings.tsx; [ -f $f ] || continue
 [ -n "$(git -C $d log --oneline 05525f7..HEAD)" ] || continue; echo "=== $r"
 python3 -I - "$f" <<'PY'
import re,sys
s=open(sys.argv[1]).read()
tags=re.findall(r"<(ButtonDanger|DestructiveIconButton|IconButton|Button|Notification|TextTitlePage|TextContentTitle|ButtonGroup)\b([^>]{0,220})>",s,re.S)
for t,a in tags: print(" ",t, re.sub(r"\s+"," ",a)[:170])
PY
done
