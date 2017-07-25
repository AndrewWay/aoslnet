#!/bin/bash

colx=3
coly=4
colz=5
txtfile=$1
if [ ! -f $txtfile ];then
echo "$txtfile is not a file"
echo "exiting..."
exit 1
fi

IFS='.' read -ra name <<< "$txtfile"
name="${name[0]}"
output="$name.xyz"
echo $output
length=`cat $txtfile | wc -l`

for i in `seq 1 $length`
do
line=`sed 'iq;d' txtfile`
x=`echo $line | awk '{print $colx}'`
y=`echo $line | awk '{print $coly}'`
z=`echo $line | awk '{print $colz}'`
echo "$x $y $z" >> $output
done

cp $output processed/
