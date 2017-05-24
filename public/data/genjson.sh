#!/bin/bash

name="R11I01"
year=1980

input="R11I01.txt"
length=`cat $input | wc -l`

output="$name.json"
xdat='"x" : ['
ydat='"y" : ['
zdat='"z" : ['

echo "{" > $output
echo '    "icebergID" : "'$name'",' >> $output
echo '    "year" : "'$year'",' >> $output

for i in `seq 2 $length`
do

line=`cat $input | head -n $i | tail -n 1`

newx=`echo $line | awk '{print $3}'`
newy=`echo $line | awk '{print $4}'`
newz=`echo $line | awk '{print $5}'`

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
