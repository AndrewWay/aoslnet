#!/bin/bash

input=Iceberg_Sightings_all_data.csv # change this
lim=500
badh=-1

widthindex=$badh
heightindex=$badh
yearindex=$badh
latindex=$badh
longindex=$badh

headers=`cat $input | head -n 1`
echo $headers
IFS=',' read -r -a headarrs <<< "$headers"

#check which columns contain longitude and latitude data
for h in `seq 0 "${#headarrs[@]}"`
do
    header=${headarrs[$h]}

    if [ "$header" ==  "latitude" ];then
        latindex=$h
    fi
    if [ "$header" == "longitude" ];then
        longindex=$h
    fi
    if [ "$header" == "Year" ];then
        yearindex=$h
    fi    
    if [ "$header" == "height" ];then
        heightindex=$h
    fi    
    if [ "$header" == "width" ];then
        widthindex=$h
    fi    
done

if [ $latindex == $badh ];then
    echo "'"latitude"' heading not detected."
    exit 1
fi

if [ $longindex == $badh ];then
    echo "'"longitude"' heading not detected."
    exit 1
fi
if [ $yearindex == $badh ];then
    echo "'"Year"' heading not detected."
    exit 1
fi
if [ $heightindex == $badh ];then
    echo "'"height"' heading not detected."
    exit 1
fi
if [ $widthindex == $badh ];then
    echo "'"width"' heading not detected."
    exit 1
fi

for i in `seq 2 $lim`
do
    idindex=`cat idindex.txt`
    id=`cat names.txt | head -n $idindex | tail -n 1`
    echo $((idindex+1)) > idindex.txt
    line=`sed "${i}q;d" $input`
    IFS=',' read -r -a linearr <<< "$line"
    lat=${linearr[$latindex]}
    long=${linearr[$longindex]}
    year=${linearr[$yearindex]}
    height=${linearr[$heightindex]}
    width=${linearr[$widthindex]}
    
    echo $i $line
    echo ID $id LAT $lat LONG $long YEAR $year HEIGHT $height WIDTH $width
    
    #Create JSON
    jq -n "{ icebergID :\"$id\",year : \"$year\",height : \"$height\",width :\"$width\",lat : \"$lat\",long : \"$long\"}" > $id.json 
    #Add JSON to database
    mongoimport -d aosldb -c bergmeas --file $id.json
done

