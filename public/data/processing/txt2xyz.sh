#!/bin/bash
re='^[-+]?[0-9]+\.?[0-9]*$' #regular expression to check if float

#TODO Add in header detection 
colx=2
coly=3
colz=4

txtfile=$1
dest="processed/xyz/"
if [ ! -f $txtfile ];then
echo "$txtfile is not a file"
echo "exiting..."
exit 1
fi

dos2unix $txtfile

IFS='.' read -ra name <<< "$txtfile"
name="${name[0]}"
output="$name.xyz"
if [ -f $output ];then
    rm $output
fi
echo "Output: $output"

length=`cat $txtfile | wc -l`
errs=0
for i in `seq 1 $length`
do
echo -ne "$i/$length\r"
line=`sed "${i}q;d" $txtfile`
IFS=', ' read -ra values <<< "$line"

x=${values[$colx]}
y=${values[$coly]}
z=${values[$colz]}

if [[ $x =~ $re ]]; then
    if [[ $y =~ $re ]]; then
        if [[ $z =~ $re ]]; then
            echo "$x $y $z" >> $output
        else
            errs=$((errs+1))
        fi
    else
        errs=$((errs+1))
    fi
else
    errs=$((errs+1))
fi

done
echo "non-float, rejected points: $errs"
mv $output $dest$output
