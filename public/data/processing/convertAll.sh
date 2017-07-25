#!/bin/bash

filelist="filelist.txt"

length=`cat $filelist | wc -l`

for i in `seq 1 $length`
do
file=`cat $filelist | head -n $i | tail -n 1`
echo $file
./txt2xyz.sh $file
done
