#!/bin/bash

name="Joey"
year=2017
height=49.7
width=119.3
volume=43309.03

input="june1_full.txt"
length=`cat $input | wc -l`

output="$name.json"
xdat='"x" : ['
ydat='"y" : ['
zdat='"z" : ['

echo "{" > $output
echo '    "icebergID" : "'$name'",' >> $output
echo '    "year" : "'$year'",' >> $output
echo '    "height" : "'$height'",' >> $output
echo '    "width" : "'$width'",' >> $output
echo '    "volume" : "'$volume'",' >> $output

for i in `seq 1 $((length-1))`
do
line=`cat $input | head -n $i | tail -n 1`

newx=`echo $line | awk '{print $1}'`
newy=`echo $line | awk '{print $2}'`
newz=`echo $line | awk '{print $3}'`


xdat=$xdat$newx,
ydat=$ydat$newy,
zdat=$zdat$newz,

done

line=`cat $input | head -n $length | tail -n 1`

newx=`echo $line | awk '{print $1}'`
newy=`echo $line | awk '{print $2}'`
newz=`echo $line | awk '{print $3}'`

xdat="$xdat$newx],"
ydat="$ydat$newy],"
zdat="$zdat$newz]"
echo "    $xdat" >> $output
echo "    $ydat" >> $output
echo "    $zdat" >> $output
echo "}" >> $output
