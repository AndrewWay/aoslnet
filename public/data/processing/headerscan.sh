#!/bin/bash

 #TODO: Break this function up into smaller functions? Function is big and pretty complex

  #Accepts the path to a space separated or comma separated file 
  #Converts the file into 3 JSON-compatible arrays: x y and z
  #Returns JSON with 3 arrays, for x, y and z coordinates of points

  local failcode=0
  local input=$1
  local badh=-1

  local xindex=$badh
  local yindex=$badh
  local zindex=$badh
  if [ ! -f "$input" ];then
    echo -e "${Red}File \"$input\" does not exist. Setting PCD arrays to empty. ${Color_Off}" >&2
    local ret=`jq -n '{x : [] } + {y : [] } + {z : [] }'`
    echo "$ret"
    exit 1
  fi
  #Take the raw data file and determine what columns contain the x,y, and z data
  local headers=`cat $input | head -n 1`
  local headarrs=""
  IFS=$', \t' read -r -a headarrs <<< "$headers"

  #check which columns contain strings x y and z
  for h in `seq 0 "${#headarrs[@]}"`
  do
    header=${headarrs[$h]}
    if [[ "$header" == "$pcdheader_x" ]];then
      xindex=$h
    fi
    if [[ "$header" =~ "$pcdheader_y" ]];then
      yindex=$h
    fi
    if [[ "$header" =~ "$pcdheader_z" ]];then
      zindex=$h
    fi    
  done
  
  if [ $xindex == $badh ];then
    echo -e "${Red}$pcdheader_x heading not detected.${Color_Off}" >&2
    failcode=1
  fi
  if [ $yindex == $badh ];then
    echo -e "${Red}$pcdheader_y heading not detected.${Color_Off}" >&2
    failcode=1
  fi
  if [ $zindex == $badh ];then
    echo -e "${Red}$pcdheader_z heading not detected.${Color_Off}" >&2
    failcode=1
  fi

