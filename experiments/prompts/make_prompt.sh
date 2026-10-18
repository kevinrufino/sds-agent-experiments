#!/bin/bash
# usage: make_prompt.sh RUN_ID COND [extra_file]
D=$(dirname $0); RUN=$1; COND=$2; EXTRA=$3
{ sed "s#{WT}#/home/user/runs/$RUN#g" $D/base.md; cat $D/cond_$COND.md; [ -n "$EXTRA" ] && cat $EXTRA; } 
