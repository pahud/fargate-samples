#!/bin/bash


cpunum=$(grep -c processor /proc/cpuinfo)

# create a placeholder
OUTFILE=/usr/src/app/nohup.out
touch $OUTFILE

for i in `seq $cpunum`
do
   PORT=$((3000+$i)) nohup supervisor --non-interactive server.js > /dev/stdout &
done

# block the process in the forground
tail -f $OUTFILE