#!/bin/bash
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
echo -e "${ICyan}Enter the path to the file containing the timestamped data ${Color_Off}"
pcdpath="R11I01.txt"
output=$(processPCD $pcdpath)
echo $output | less
#Calculate the width, height and volume from the point cloud data

#Specify the directory for the images 

#Upload the images
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
  if [[ ! "$year" =~ ^[0-9]{4}$ ]];then
    echo "No year detected in output string. Please enter the year: " >&2
    read year
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
            xindex=$((h+1)) #HU: This might cause issues
        fi
        if [ "$header" == "y" ];then
            yindex=$((h+1))
        fi
        if [ "$header" == "z" ];then
            zindex=$((h+1))
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
      echo $line >&2
      #TODO: Process the x,y,z data so that you strip the commas from them if they are there.
      local newx=`echo $line | awk '{print $xindex}'`
      local newy=`echo $line | awk '{print $yindex}'`
      local newz=`echo $line | awk '{print $zindex}'`
      
      if [[ $newx == [0-9]*\.[0-9]* || $newx == -[0-9]*\.[0-9]* ]];then
        xdat=$xdat$newx,
      elif [[ $newx == [0-9]*\.[0-9]*, || $newx == -[0-9]*\.[0-9]*, ]];then
        xdat=$xdat$newx
      else
        echo -e "${Red}x array data not of type float. Exiting...${Color_Off}" >&2
        exit 1
      fi

      if [[ $newy == [0-9]*\.[0-9]* || $newy == -[0-9]*\.[0-9]* ]];then
        ydat=$ydat$newy,
      elif [[ $newy == [0-9]*\.[0-9]*, || $newy == -[0-9]*\.[0-9]*, ]];then
        ydat=$ydat$newy
      else
        echo -e "${Red}y array data not of type float. Exiting...${Color_Off}" >&2
        exit 1
      fi

      if [[ $newz == [0-9]*\.[0-9]* || $newz == -[0-9]*\.[0-9]* ]];then
        zdat=$zdat$newz,
      elif [[ $newz == [0-9]*\.[0-9]*, || $newz == -[0-9]*\.[0-9]*, ]];then
        zdat=$zdat$newz
      else
        echo -e "${Red}z array data not of type float. Exiting...${Color_Off}" >&2
        exit 1
      fi
  done

  line=`cat $input | head -n $length | tail -n 1`

  newx=`echo $line | awk '{print $1}'`
  newy=`echo $line | awk '{print $2}'`
  newz=`echo $line | awk '{print $3}'`

  if [[ ${newx: -1} == , ]];then
    newx=${newx%?}
  fi
 if [[ ${newy: -1} == , ]];then
    newy=${newy%?}
  fi
 if [[ ${newz: -1} == , ]];then
    newz=${newz%?}
  fi

  xdat="$xdat$newx]"
  ydat="$ydat$newy]"
  zdat="$zdat$newz]"

  echo $xdat | less
  local tmp=`jq '{x : '$xdat'} + .' <<< "$output"`
  local tmp2=tmp
  tmp=`jq '{y : '$ydat'} + .' <<< "$output"`
  tmp2=tmp  
  tmp=`jq '{z : '$zdat'} + .' <<< "$output"`
  tmp2=tmp
  echo $tmp2
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
