#!/bin/bash

output="peter.json"
pcdsize=50
xdat='"x" : ['
ydat='"y" : ['
zdat='"z" : ['
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

echo "{" > $output
echo '    "icebergID" : "peter",' >> $output

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
