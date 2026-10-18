#!/bin/bash
# usage: validate.sh RUN_ID OUTDIR -> identical validation for every run (post-hoc scoring; agent never sees it)
RUN=$1; OUT=$2; WT=/home/user/runs/$RUN; mkdir -p $OUT; cd $WT
CHANGED=$(git status --porcelain -uall | awk '{print $2}' | grep -E '\.(tsx?|css)$' | tr '\n' ' ')
TSF=$(echo $CHANGED | tr ' ' '\n' | grep -E '\.tsx?$' | tr '\n' ' ')
npx tsc --noEmit -p . > $OUT/tsc.txt 2>&1; TOTAL=$(grep -c "error TS" $OUT/tsc.txt)
INFILES=0; for f in $TSF; do n=$(grep -c "^$f(" $OUT/tsc.txt); INFILES=$((INFILES+n)); done
if [ -n "$TSF" ]; then npx eslint $TSF > $OUT/eslint.txt 2>&1 || true; fi
LERR=$(grep -oE "[0-9]+ errors?" $OUT/eslint.txt | head -1 | grep -oE "^[0-9]+"); LWARN=$(grep -oE "[0-9]+ warnings?" $OUT/eslint.txt | head -1 | grep -oE "^[0-9]+")
npx vite build --outDir /home/user/runs/_dist/$RUN > $OUT/vite.txt 2>&1 && VB=pass || VB=fail
echo "changed=$CHANGED"
echo "tsc_total=$TOTAL tsc_baseline=7 tsc_new=$((TOTAL-7)) tsc_in_changed_files=$INFILES eslint_errors=${LERR:-0} eslint_warnings=${LWARN:-0} vite_build=$VB"
