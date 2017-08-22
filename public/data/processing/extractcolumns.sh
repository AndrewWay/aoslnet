#!/bin/bash

input="r11i02.xyz"
output="test.xyz"
rm $output
length=`cat $input | wc -l`

for i in `seq 1 500`
do
    line=`cat $input | head -n $i | tail -n 1`
    x=`echo $line | awk '{print $3}'`
    y=`echo $line | awk '{print $4}'`
    z=`echo $line | awk '{print $5}'`
    echo "$x $y $z" >> $output
done
