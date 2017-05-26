#!/bin/bash

name="James"
year=1980
long=-52.732711
lat=47.571306
height=101
width=143
volume=10832

input="fullberg.txt"
length=`cat $input | wc -l`

output="$name.json"
xdat='"x" : ['
ydat='"y" : ['
zdat='"z" : ['

echo "{" > $output
echo '    "icebergID" : "'$name'",' >> $output
echo '    "year" : "'$year'",' >> $output
echo '    "longitude" : "'$long'",' >> $output
echo '    "latitude" : "'$lat'",' >> $output
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
