#!/bin/bash

#Takes data from TSD and PCD sources and appends it to a JSON file that is compatible with MongoDB
#Two input files: PCD and TSD (Point cloud data and time-stamped data.)
#PCD: can be comma separated, space separated, or both. 
#TSD: JSON. You can specify the name of the array that contains the time-stamped data
#Both: The script will check either for a consistent year to be used in the uploaded JSON.

#Knowledge base
pcd_is_csv=0
pcd_is_json=0
tsd_is_csv=0
tsd_is_json=0

imagestore="/home/away/workspace/aoslnet/site/public/images"

vno=0.1
badh=-1

xindex=$badh
yindex=$badh
zindex=$badh

tsdname='Data'
output=""

main(){
  echo -e "${BBlue}AOSL MongoDB Data Upload"
  echo -e "${UWhite}Version $vno"
  echo -e "${ICyan}Press enter following any of the prompts to skip appending data to the json file"
  echo ""

  output=$(getName)
  output='{ "name" : "'$name'" }'

  echo -e "${ICyan}Enter the path to the file containing the timestamped data: ${Color_Off}"
  tsdatapath="../2017_11.json"
  output=$(processTSD $tsdatapath)

  output=$(processYear)
  echo -e "${ICyan}Enter the path to the file containing the point cloud data ${Color_Off}"
  read pcdpath

  output=$(processPCD $pcdpath) #Process the PCD and add to the output JSON xyz JSON arrays

  output=$(dimensional_analysis "$output")  #Calculate the width, height and volume from the point cloud data

  
  #Specify the directory for the images 
  echo -e "${ICyan}Enter the path to the file containing the pictures data ${Color_Off}"
  read imagepath
  storeimages $imagepath  
  

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
  
  local tmp=`jq '{height : '$height'} + .' <<< "$json"`
  local tmp2=$tmp
  local tmp=`jq '{width : '$width'} + .' <<< "$tmp2"`
  local tmp2=$tmp
  local tmp=`jq '{volume : '$volume'} + .' <<< "$tmp2"`
  echo "$tmp"
}

getName(){
  if [[ -f "idindex.txt" && -f "names.txt" ]];then
    nameindex=`cat idindex.txt | head -n 1`
    name=`cat names.txt | head -n $nameindex | tail -n 1`
    echo $((nameindex + 1)) > idindex.txt
  else
    echo "idindex.txt or names.txt does not exist. Exiting..." >&2  
    exit 1
  fi
  echo "Document name: $name" >&2
  echo $name
}

processYear(){
  year=`echo $output | jq -r '.year'`
  #TODO Check the PCD and TSD files for the year
  if [[ ! "$year" =~ ^[0-9]{4}$ ]];then
    echo "No year detected in output string. Please enter the year: " >&2
    year=2017
    #read year
  fi
  echo "Adding year $year to output" >&2

  echo `jq '{year : '$year'} + .' <<< "$output"`
}
processTSD(){
    #This should be a json! Should we also be able to work with a csv file?
    local path=$1
    echo "path $path" >&2
    if [ ${path: -5} == ".json" ];then
      if [[ $tsdname == '' ]];then
        echo "What is the name the measurement data array: " >&2        
        read tsdname
      else
        echo "Using preset measurement data array name: $tsdname" >&2
      fi
      local tsd=`cat $path | jq ."$tsdname"`  
    else
        echo "Time-stamped data file must be JSON. Exiting..." >&2
        exit 1
    fi
    local data_array=`echo $tsd | jq -R --argjson output "$output" '$output + {'$tsdname': .}'`
    echo $data_array > debug.txt
    echo "$data_array"
}
processPCD(){
    #Expects a space separated or comma separated file
    input=$1
    
    if [ ! -f $input ];then
      echo -e "${Red} $input does not exist. exiting... ${White}"
      exit 1
    fi
    #Take the raw data file and determine what columns contain the x,y, and z data
    headers=`cat $input | head -n 1`
    echo $headers >&2
    IFS='\ ,' read -r -a headarrs <<< "$headers"

    #check which columns contain x y and z
    for h in `seq 0 "${#headarrs[@]}"`
    do
        header=${headarrs[$h]}

        if [ "$header" ==  "x" ];then
            xindex=$h
        fi
        if [ "$header" == "y" ];then
            yindex=$h
        fi
        if [ "$header" == "z" ];then
            zindex=$h
        fi    
    done
    echo "x: $xindex y: $yindex z: $zindex" >&2

    if [ $xindex == $badh ];then
        echo "'"x"' heading not detected." >&2
        exit 1
    fi
    if [ $yindex == $badh ];then
        echo "'"y"' heading not detected." >&2
        exit 1
    fi
    if [ $zindex == $badh ];then
        echo "'"z"' heading not detected." >&2
        exit 1
    fi

    #Create the data arrays
    length=`cat $input | wc -l`
    length=$((length-1))
    local xdat='['
    local ydat='['
    local zdat='['
    
    echo -e "Now processing PCD..." >&2   
    for i in `seq 2 $length`
    do
      echo -en "\rpoints processed: $i/$length " >&2
      local line=`cat $input | head -n $i | tail -n 1`
      IFS='\ ,' read -r -a linearr <<< "$line"
      #TODO: Process the x,y,z data so that you strip the commas from them if they are there.
      local newx=${linearr[$xindex]}
      local newy=${linearr[$yindex]}
      local newz=${linearr[$zindex]}
      
      xdat=$xdat$newx,
      ydat=$ydat$newy,
      zdat=$zdat$newz,
  done
  echo -e "" >&2
  local line=`cat $input | head -n $i | tail -n 1`
  IFS='\ ,' read -r -a linearr <<< "$line"
  #TODO: Process the x,y,z data so that you strip the commas from them if they are there.
  local newx=${linearr[$xindex]}
  local newy=${linearr[$yindex]}
  local newz=${linearr[$zindex]}

  xdat="$xdat$newx]"
  ydat="$ydat$newy]"
  zdat="$zdat$newz]"

  local ret=`jq '{x : '$xdat'} + {y : '$ydat'} + {z : '$zdat'} + . ' <<< "$output"`
  echo $ret
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
