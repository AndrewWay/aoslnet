#!/bin/bash



main(){
  pcd_input=$1
  meas_input=$2

  #Get the name for the iceberg to be uploaded
  index=`cat idindex.txt | head -n 1 | awk '{print $1}'`
  id=`cat names.txt | head -n $index | tail -n 1`
  echo $((index + 1)) > idindex.txt

  #Remove existing key pair for icebergID
  jq 'del(.icebergID)' <<< `cat $pcd_input` > $pcd_input
  #Add the new key pair  for icebergID
  jq '. + {"icebergID" : "$id"}' <<< `cat $pcd_input` > $pcd_input

  

  #Upload the JSONs to the database
  mongoimport -d $db -c $spatial_coll --file $spatial_data --jsonArray
  mongoimport -d $db -c $meas_coll --file $meas_data --jsonArray
}

spatialjson(){
  #function assumes data is space-separated
  #TODO: Have function analyze data to determine how to delimit  
  #TODO: Look into using jq for all construction of JSON files
  echo "Constructing spatial JSON"
  name=$1
  year=2017

  #Calculate max height
  echo "Calculating maximum height"
  height=`python heightcalc.py $pcd_input`
  #calculate max width
  echo "Calculating maximum width"  
  width=`python widthcalc.py $pcd_input`
  #Calculate volume
  echo "Calculating volume"
  volume=`python volumecalc.py $pcd_input`

  pcd_input=$2
  length=`cat $pcd_input | wc -l`
  output="$name.json"

  xdat='"x" : ['
  ydat='"y" : ['
  zdat='"z" : ['
  echo "Appending to "
  echo "{" > $output
  echo '    "icebergID" : "'$name'",' >> $output
  echo '    "year" : "'$year'",' >> $output
  echo '    "height" : "'$height'",' >> $output
  echo '    "width" : "'$width'",' >> $output
  echo '    "volume" : "'$volume'",' >> $output

  for i in `seq 1 $((length-1))`
  do
    line=`cat $pcd_input | head -n $i | tail -n 1`

    newx=`echo $line | awk '{print $1}'`
    newy=`echo $line | awk '{print $2}'`
    newz=`echo $line | awk '{print $3}'`

    xdat=$xdat$newx,
    ydat=$ydat$newy,
    zdat=$zdat$newz,
  done

  line=`cat $pcd_input | head -n $length | tail -n 1`

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
}

#Call main function with all script arguments
main "$@"
