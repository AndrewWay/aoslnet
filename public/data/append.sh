#!/bin/bash

input=sonar.txt
output=fullberg.txt

length=`cat $input | wc -l`

for i in `seq 1 $length`
do
line=`cat $input | head -n $i | tail -n 1`
echo $line >> $output
done
