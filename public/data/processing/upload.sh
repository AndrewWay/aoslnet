#!/bin/bash
vno=0.1

main(){
echo "AOSL MongoDB Data Upload"
echo "Version $vno"
echo "Press enter following any of the prompts to skip appending data to the json file"
echo ""
echo "DATA ARRAY"
echo "Enter the path to the json file containing the timestamped data: "

#Get the time stamped data array file path
read tsdatapath
#Process the data array file
processTSD($tsdatapath)
#Add it to the json object

#Get the name

#Add it to the json object

#Get the year

#Add it to the json object

#Get the latitude

#Add it to the json object

#Get the longitude

#Add it to the json object

#Get the PCD (What is the acceptable format?)

#Add the data to x, y, and z arrays in json object

# Calculate the width, height and volume from the point cloud data

#Specify the directory for the images 

#Upload the images
}

processTSD(){
    input=$1
    
}

main($@)
