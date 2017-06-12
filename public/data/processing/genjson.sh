#!/bin/bash

name="Bob"
year=1980
long=-52.732711
lat=47.571306
height=101
width=143
volume=10832

input="2017_05_25_sonar_filtered.ply"
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

for i in `seq 1 $length`
do

line=`cat $input | head -n $i | tail -n 1`

newx=`echo $line | awk '{print $1}'`
newy=`echo $line | awk '{print $2}'`
newz=`echo $line | awk '{print $3}'`

xdat=$xdat$newx
ydat=$ydat$newy
if [ $i -eq 2 ];then
zdat=$zdat$newz
else 
zdat=$zdat,$newz
fi

done
xdat=${xdat::-1}
ydat=${ydat::-1}


xdat="$xdat],"
ydat="$ydat],"
zdat="$zdat]"
echo "    $xdat" >> $output
echo "    $ydat" >> $output
echo "    $zdat" >> $output
echo "}" >> $output
