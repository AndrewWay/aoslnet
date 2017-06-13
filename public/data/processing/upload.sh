#!/bin/bash

db=aosldb
spatial_coll=bergpcd
meas_coll=bergmeas


main(){
  pcd_input=$1 #pcd data must be space delimited in this version!
  meas_input=$2
  echo "Determining icebergID..."
  #Get the name for the iceberg to be uploaded
  index=`cat idindex.txt | head -n 1 | awk '{print $1}'`
  id=`cat names.txt | head -n $index | tail -n 1`
  echo $((index + 1)) > idindex.txt

  echo "icebergID=$id"
  #Remove existing key pair for icebergID
 # jq 'del(.icebergID)' <<< `cat $pcd_input` > $pcd_input
  #Add the new key pair  for icebergID
 # jq '. + {"icebergID" : "$id"}' <<< `cat $pcd_input` > $pcd_input
  #Construct spatial JSON
 # spatialjson $id $pcd_input
  spatial_data=$id.json
  meas_data=$meas_input  
  #Upload the JSONs to the database
  echo "Uploading file{$spatial_data} --> collection{$spatial_coll} in database{$db}"
  mongoimport -d $db -c $spatial_coll --file $spatial_data --jsonArray
  echo "Uploading file{$meas_data} --> collection{$meas_coll} in database{$db}"
  stat=$?  
  
  #Check if import of spatial data was successful. If so, upload measurement json  
  if [ $stat -eq 0 ];then  
    mongoimport -d $db -c $meas_coll --file $meas_data --jsonArray
  else
    echo "fatal error: $success. Upload cancelled"
  fi
}

spatialjson(){
  #function assumes data is space-separated
  #TODO: Have function analyze data to determine how to delimit  
  #TODO: Look into using jq for all construction of JSON files
  echo "Constructing spatial JSON"
  id=$1
  pcd_input=$2
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

  length=`cat $pcd_input | wc -l`
  output="$id.json"

  xdat='"x" : ['
  ydat='"y" : ['
  zdat='"z" : ['
  echo "Appending to $output"
  echo "{" > $output
  echo '    "icebergID" : "'$id'",' >> $output
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
if [ $# -eq 2 ];then
  if [ -f $1 ];then  
    if [ -f $2 ];then
      main "$@"
    else
      echo "fatal error: input file $2 either does not exist or is not a regular file"      
    fi  
  else
    echo "fatal error: input file $1 either does not exist or is not a regular file"
  fi
else
  echo "fatal error: not enough arguments"
  echo "usage: ./upload.sh pcd_input meas_input"
fi
