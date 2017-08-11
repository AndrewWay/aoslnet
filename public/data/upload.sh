#!/bin/bash

#DATABASE UPLOAD SCRIPT
#Centralizes data sources by forming a JSON object containing data arrays and filepaths to iceberg model files
#To add a new JSON entry, simply create a new function that returns a JSON string and combine it with the final string

set -e #Make script exit upon generating error of (almost) all commands. See man bash for more info

imagestore="/home/away/workspace/aoslnet/site/public/images"

#Script must be ran in public/data 
PUBLIC_STL_DIR='models/stl/'
PUBLIC_XYZ_DIR='models/xyz/'
PROC_XYZ_DIR='processing/processed/'

vno=0.1

main(){

  echo -e "${BBlue}AOSL MongoDB Data Upload"
  echo -e "${UWhite}Version $vno"
  echo ""

  #TIME STAMPED DATA____________
  echo -e "${ICyan}Enter the path to the file containing the timestamped data: ${Color_Off}"
  read -e tsdpath  
  local tsd=$(processTSD $tsdpath)
  
  #POINT CLOUD DATA_____________
#  echo -e "${ICyan}Enter the path to the file containing the point cloud data: ${Color_Off}"
#  read pcdpath  
#  if [ -f $pcdpath ];then
#    dos2unix $pcdpath #Ensure the data file is in unix format
#  fi
#  local pcd=$(processPCD $pcdpath)

  #STL FILE #TODO get the filepath but wait until the very end to actually upload it
  echo -e "${ICyan}Enter the name to the .stl file  ${Color_Off}"
  read -e stlpath
  local stl=$(getSTLjson $stlpath)
  
  #XYZ FILE
  echo -e "${ICyan}Enter the name to the .xyz file  ${Color_Off}"
  read -e xyzpath
  local xyz=$(processPCD $xyzpath)  

  #NAME_________________________
  local name=$(getName)  
  #YEAR_________________________
  local year=$(processYear $pcdpath $tsdpath)

  #DIMENSIONAL ANALYSIS_________
  local dima=$(dimensional_analysis "$output")  #Get width, height, and volume from PCD

  #IMAGES_______________________ 
  #echo -e "${ICyan}Enter the path to the file containing the pictures data ${Color_Off}"
  #read imagepath
  #storeimages $imagepath  
  
  #GPS COORDINATES______________
  echo -e "${ICyan}Enter the latitude of the iceberg${Color_Off}" 
  read -e latitude
  echo -e "${ICyan}Enter the longitude of the iceberg${Color_Off}" 
  read -e longitude
  local long=`jq -n '{longitude : '$longitude'}'`
  local lat=`jq -n '{latitude : '$latitude'}'`  
  jsonraw="$name $year $lat $long $dima $stl $xyz $tsd"
  local json=`echo "$jsonraw" | jq -s add` # The final combined JSON

  echo $json > tmp.json
  mongoimport -d aosldb -c data --file tmp.json
  rm tmp.json

}

getName(){
  #Accepts nothing
  #Creates a name
  #Returns name JSON

  local ret=""  
  local name=""
  if [[ -f "idindex.txt" && -f "names.txt" ]];then
    local nameindex=`cat idindex.txt | head -n 1`
    name=`cat names.txt | head -n $nameindex | tail -n 1`
    echo $((nameindex + 1)) > idindex.txt
  else
    echo -e "${ICyan}idindex.txt or names.txt does not exist. Please enter a name: ${Color_Off}" >&2  
    read name
  fi
  ret=`jq -n '{ name : "'$name'" }'`
  echo "Name set to: $name" >&2
  echo "$ret"
}

processTSD(){
  #Accepts path to JSON file
  #Extracts the Data JSON array
  #Returns data JSON

  local path=$1
  local ret=""  
  if [ "${path: -5}" == ".json" ] && [ -f $path ];then #Check if the file is an existing json
    local filecontents=`cat "$path"`
    #local dataexist=`jq -n "$filecontents" | jq 'has("Data")'` 
    local dataexist=`jq 'has("Data")' <<< "$filecontents"`    
    if [ "$dataexist" == 'true' ];then #Check if the json file has the Data array
      local tsd=`jq ".Data" <<< "$filecontents"`  
      ret=`jq -r '{ Data : . }' <<< "$tsd"`
    else  
      echo "Data array is not present in $path" >&2 #Set the Data array to null if not found
      echo "Setting Data array to []" >&2
      ret=`jq -n '{ Data : [] }'`
    fi
  else
    echo "Time-stamped data file must be an existing JSON." >&2 #File not json: Data array set to empty
    echo "Setting Data array to []" >&2
    ret=`jq -n '{ Data : [] }'`
    echo "$ret"
    exit 1
  fi
  echo "$ret"
}

getSTLjson(){
  #Accepts path to .stl file
  #Creates json string {stlpath : path/to/stl}
  #Returns data JSON

  local stlpath=$1
  local stlfile=$(basename $stlpath) 
  local path="data/$PUBLIC_STL_DIR$stlfile"
  local ret=""  
  if [ "${stlfile: -4}" == ".stl" ] && [ -f $stlpath ];then #Check if the file is an existing .stl
    ret=`jq -n '{ stlpath : "'$path'" }'`
    echo "$ret"
    cp $stlpath $PUBLIC_STL_DIR$stlfile
  else
    echo ".stl filepath does not exist" >&2 #File not stl
    echo "Not adding .stl filepath JSON string to output" >&2
    exit 1
  fi
}

getXYZjson(){
  #Accepts path to .xyz file
  #Creates json string { xyzpath : path/to/xyz }
  #Returns data JSON

  local xyzpath=$1
  local xyzfile=$(basename $xyzpath)
  echo "xyz base name $xyzfile" >&2
  local path="data/$PUBLIC_XYZ_DIR$xyzfile"
  local ret=""  
  if [ "${xyzfile: -4}" == ".xyz" ] && [ -f $xyzpath ];then #Check if the file is an existing json
    ret=`jq -n '{ xyzpath : "'$path'" }'`
    echo "$ret"
    cp $xyzpath $PUBLIC_XYZ_DIR$xyzfile
  else
    echo ".xyz filepath does not exist" >&2 #File not xyz
    echo "Not adding .xyz filepath JSON string to output" >&2
    exit 1
  fi
}

processPCD(){
  #TODO: Break this function up into smaller functions? Function is big and pretty complex

  #Accepts the path to a space separated or comma separated xyz file 
  #Converts the file into 3 JSON-compatible arrays: x y and z
  #Returns JSON with 3 arrays, for x, y and z coordinates of points

  local failcode=0
  local input=$1

  local xindex=0
  local yindex=1
  local zindex=2
  if [ ! -f "$input" ];then
    echo -e "${Red}File \"$input\" does not exist. Setting PCD arrays to empty. ${Color_Off}" >&2
    local ret=`jq -n '{x : [] } + {y : [] } + {z : [] }'`
    echo "$ret"
    exit 1
  fi

  #Create the data arrays
  local length=`cat $input | wc -l`
  length=$((length-1)) #Iterate over all n-1 points in the for loop. Handle nth point outside loop
  local xdat='['
  local ydat='['
  local zdat='['
  
  local rejectedpoints=0 #counter for tracking how many points are not floats
  local rejectionstring=""
  echo -e "Now processing PCD..." >&2
  for i in `seq 2 $length`
  do
    local rejectcode=0
    local line=`cat $input | head -n $i | tail -n 1`
    local linearr=""
    IFS=$', \t' read -r -a linearr <<< "$line"

    local newx=${linearr[$xindex]}
    local newy=${linearr[$yindex]}
    local newz=${linearr[$zindex]}
    #echo "newx: |$newx|" >&2
    #Shorten this if statement
    if [[ $newx =~ ^[-+]?[0-9]+\.?[0-9]*$ && $newy =~ ^[-+]?[0-9]+\.?[0-9]*$ && $newz =~ ^[-+]?[0-9]+\.?[0-9]*$ ]];then
      xdat=$xdat$newx,
      ydat=$ydat$newy,
      zdat=$zdat$newz,
    else
      rejectedpoints=$((rejectedpoints + 1))
      rejectionstring="${Red}rejected points: $rejectedpoints/$length${Color_Off}"
    fi
    echo -en "\rpoints processed: $i/$length $rejectionstring" >&2    
  done

  echo -e "" >&2
  local line=`cat $input | tail -n 1`
  IFS=$', \t' read -r -a linearr <<< "$line"
  newx=${linearr[$xindex]}
  newy=${linearr[$yindex]}
  newz=${linearr[$zindex]}

  xdat="$xdat$newx]"
  ydat="$ydat$newy]"
  zdat="$zdat$newz]"
  local xarr=`jq '{x : .}' <<< "$xdat"`
  local yarr=`jq '{y : .}' <<< "$ydat"`
  local zarr=`jq '{z : .}' <<< "$zdat"`

  local ret=`echo "$xarr $yarr $zarr" | jq -s add` # The final combined JSON
  echo "$ret"
}

processYear(){
  local pcd="$1"
  local tsd="$2"
  local year=""
  local yearpcd=""
  local yeartsd=""
  #Check if pcd and tsd are jsons
  if [ "${pcd: -5}" == ".json" ];then
    yearpcd=`cat $pcd | jq '.year' 2> /dev/null`
  elif [ "${tsd: -5}" == ".json" ];then
    yeartsd=`cat $tsd | jq '.year' 2> /dev/null`
  fi
  #Check if either files contain a key "year"
  if [ ! "$yearpcd" == ^[0-9]{4}$ ] && [ ! "$yeartsd" == ^[0-9]{4}$ ];then
    echo "No year detected in output string. Please enter the year: " >&2
    read year
  fi

  local ret=`jq -n '{year : "'$year'"}'`
  echo "$ret"
}

dimensional_analysis(){
  #Preceding function for dimanalysis. Converts xyz strings into BASH recognizable arrays
  local json="$1"

  local x=`echo ${json} | jq '.x'`
  local y=`echo ${json} | jq '.y'`
  local z=`echo ${json} | jq '.z'`
  
  local xarr=""  
  local yarr=""  
  local zarr=""  

  x=`echo "${x//[}"`
  x=`echo "${x//]}"`
  IFS='\ ,' read -r -a xarr <<< $x

  y=`echo "${y//[}"`
  y=`echo "${y//]}"`
  IFS='\ ,' read -r -a yarr <<< $y

  z=`echo "${z//[}"`
  z=`echo "${z//]}"`
  IFS='\ ,' read -r -a zarr <<< $z
  
  height=120 #`heightcalc xarr[@] yarr[@] zarr[@]`
  width=50 #`widthcalc "$xarr" "$yarr" "$zarr"`
  volume=43000 #`volcalc "$xarr" "$yarr" "$zarr"`
  
  local ret=`jq -n '{height :'$height'} + { width : '$width' } + { volume : '$volume'}'`
  echo $ret
}

storeimages(){
  path=$1
  echo "moving to $imagestore/$year/$name"
  #cp -r $path/* $imagestore/$year/$name
}

heightcalc(){
  declare -a x=("${!1}")
  declare -a y=("${!2}")
  declare -a z=("${!3}")

  local bound=0.05
  local card="${#x[@]}"
  local height=0  
  echo cardinality: $card >&2

  
  #Iterate over every unique pair of points in the PCD
  for i in `seq 0 $card`
  do
    local p1=(${x[$i]} ${y[$i]} ${z[$i]}) # grab the first point
    for j in `seq $((i+1)) $card`
    do
      local counter=`echo "($i * $card) + $j" | bc -l`
      echo -en "\r $counter" >&2
      local p2=(${x[$j]} ${y[$j]} ${z[$j]}) #grab the second point
      
      #construct the vector connecting p1 and p2
      local vec[0]=`echo ${p2[0]} - ${p1[0]} | bc -l` #construct the x component 
      local vec[1]=`echo ${p2[1]} - ${p1[1]} | bc -l` #construct the y component
      local vec[2]=`echo ${p2[2]} - ${p1[2]} | bc -l` #construct the z component

      local subnorm=`echo "sqrt( ${vec[0]}*${vec[0]} + ${vec[1]}*${vec[1]} )" | bc -l`
      local abs_subnorm=`abs $subnorm`
      local check=`echo "$abs_subnorm <= $bound" | bc -l`  
      if [ $check -eq 1 ];then
        local norm=`echo "sqrt( ${vec[0]}*${vec[0]} + ${vec[1]}*${vec[1]} + ${vec[2]}*${vec[2]} )" | bc -l`
        check=`echo "$norm > $height" | bc -l`
        if [ $check -eq 1 ];then
          height=$norm
          echo new height: $height >&2
        fi      
      fi
    done
  done
  echo $height >&2
}

abs(){
  local input=$1
  local output=$input  
  local check=`echo "$input < 0" | bc -l`
  if [ $check -eq 1 ];then
    output=`echo "-1 * $input" | bc -l`
  fi
  echo $output
}

widthcalc(){
  local x=$1
  local y=$2
  local z=$3
  
}
volcalc(){
  local x=$1
  local y=$2
  local z=$3

}

# Reset
Color_Off='\033[0m'       # Text Reset

# Regular Colors
Black='\033[0;30m'        # Black
Red='\033[0;31m'          # Red
Green='\033[0;32m'        # Green
Yellow='\033[0;33m'       # Yellow
Blue='\033[0;34m'         # Blue
Purple='\033[0;35m'       # Purple
Cyan='\033[0;36m'         # Cyan
White='\033[0;37m'        # White

# Bold
BBlack='\033[1;30m'       # Black
BRed='\033[1;31m'         # Red
BGreen='\033[1;32m'       # Green
BYellow='\033[1;33m'      # Yellow
BBlue='\033[1;34m'        # Blue
BPurple='\033[1;35m'      # Purple
BCyan='\033[1;36m'        # Cyan
BWhite='\033[1;37m'       # White

# Underline
UBlack='\033[4;30m'       # Black
URed='\033[4;31m'         # Red
UGreen='\033[4;32m'       # Green
UYellow='\033[4;33m'      # Yellow
UBlue='\033[4;34m'        # Blue
UPurple='\033[4;35m'      # Purple
UCyan='\033[4;36m'        # Cyan
UWhite='\033[4;37m'       # White

# Background
On_Black='\033[40m'       # Black
On_Red='\033[41m'         # Red
On_Green='\033[42m'       # Green
On_Yellow='\033[43m'      # Yellow
On_Blue='\033[44m'        # Blue
On_Purple='\033[45m'      # Purple
On_Cyan='\033[46m'        # Cyan
On_White='\033[47m'       # White

# High Intensity
IBlack='\033[0;90m'       # Black
IRed='\033[0;91m'         # Red
IGreen='\033[0;92m'       # Green
IYellow='\033[0;93m'      # Yellow
IBlue='\033[0;94m'        # Blue
IPurple='\033[0;95m'      # Purple
ICyan='\033[0;96m'        # Cyan
IWhite='\033[0;97m'       # White

# Bold High Intensity
BIBlack='\033[1;90m'      # Black
BIRed='\033[1;91m'        # Red
BIGreen='\033[1;92m'      # Green
BIYellow='\033[1;93m'     # Yellow
BIBlue='\033[1;94m'       # Blue
BIPurple='\033[1;95m'     # Purple
BICyan='\033[1;96m'       # Cyan
BIWhite='\033[1;97m'      # White

# High Intensity backgrounds
On_IBlack='\033[0;100m'   # Black
On_IRed='\033[0;101m'     # Red
On_IGreen='\033[0;102m'   # Green
On_IYellow='\033[0;103m'  # Yellow
On_IBlue='\033[0;104m'    # Blue
On_IPurple='\033[0;105m'  # Purple
On_ICyan='\033[0;106m'    # Cyan
On_IWhite='\033[0;107m'   # White

main $@
echo "${NC}"
