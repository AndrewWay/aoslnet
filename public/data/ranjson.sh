#!/bin/bash

name="joey"
year=1980
long=-52.732711
lat=47.571306
height=101
width=143
volume=10832
pcdsize=50

output="$name.json"
xdat='"x" : ['
ydat='"y" : ['
zdat='"z" : ['

echo "{" > $output
echo '    "icebergID" : "'$name'",' >> $output
echo '    "year" : "'$year'",' >> $output
echo '    "longitude" : '$long',' >> $output
echo '    "latitude" : '$lat',' >> $output
echo '    "height" : "'$height'",' >> $output
echo '    "width" : "'$width'",' >> $output
echo '    "volume" : "'$volume'",' >> $output

newx=`echo "$RANDOM / 31767" | bc -l`
newy=`echo "$RANDOM / 31767" | bc -l`
newz=`echo "$RANDOM / 31767" | bc -l`
if [[ $newx =~ ^\. ]]; then
    newx=0$newx
fi
if [[ $newy =~ ^\. ]]; then
    newy=0$newy
fi
if [[ $newz =~ ^\. ]]; then
    newz=0$newz
fi

xdat=$xdat$newx
ydat=$ydat$newy
zdat=$zdat$newz
for i in `seq 1 $((pcdsize-1))`
do
    newx=`echo "$RANDOM / 31767" | bc -l`
    newy=`echo "$RANDOM / 31767" | bc -l`
    newz=`echo "$RANDOM / 31767" | bc -l`
    if [[ $newx =~ ^\. ]]; then
        newx=0$newx
    fi
    if [[ $newy =~ ^\. ]]; then
        newy=0$newy
    fi
    if [[ $newz =~ ^\. ]]; then
        newz=0$newz
    fi
    xdat="$xdat,$newx"
    ydat="$ydat,$newy"
    zdat="$zdat,$newz"
done
xdat="$xdat],"
ydat="$ydat],"
zdat="$zdat]"
echo "    $xdat" >> $output
echo "    $ydat" >> $output
echo "    $zdat" >> $output
echo "}" >> $output
