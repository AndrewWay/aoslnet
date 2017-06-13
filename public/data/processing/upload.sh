#!/bin/bash

db=aosldb
spatial_coll=bergpcd
meas_coll=bergmeas


main(){
  pcd_input=$1 #pcd data must be space delimited in this version!
  meas_input=$2
  echo "Determining icebergID..."

  #Create the ID for the iceberg to be uploaded
  index=`cat idindex.txt | head -n 1 | awk '{print $1}'`
  id=`cat names.txt | head -n $index | tail -n 1`
  echo $((index + 1)) > idindex.txt
  echo "icebergID=$id"
  
  #Create file names for output JSONs
  meas_file="$id"_meas.json
  pcd_file="$id"_pcd.json

  #Remove existing key pair for icebergID
  jq 'del(.icebergID)' <<< `cat $meas_input` > $meas_file
    
  #Add the new key pair  for icebergID
  tmp=`cat $meas_file`
  identry='. + {"icebergID" : "'$id'"}'
  jq "$identry" <<< `cat $meas_file` > $meas_file


  #Construct spatial JSON

  spatialjson $id $pcd_input

  #Upload the JSONs to the database
  echo "Uploading file{$pcd_file} --> collection{$spatial_coll} in database{$db}"
  mongoimport -d $db -c $spatial_coll --file $pcd_file
  stat=$?  
  #Check if import of spatial data was successful. If so, upload measurement json  
  if [ $stat -eq 0 ];then  
    echo "Uploading file{$meas_file} --> collection{$meas_coll} in database{$db}"
    mongoimport -d $db -c $meas_coll --file $meas_file
  else
    echo "fatal error: $stat. Upload cancelled"
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
  height=0 #`python heightcalc.py $pcd_input`
  #calculate max width
  echo "Calculating maximum width"  
  width=0 #`python widthcalc.py $pcd_input`
  #Calculate volume
  echo "Calculating volume"
  volume=0 #`python volumecalc.py $pcd_input`

  length=`cat $pcd_input | wc -l`
  output="$id"_pcd.json

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
