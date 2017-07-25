#!/bin/bash
xindex=0
line="-178  44.8    -10.6"
IFS=' ,' read -r -a linearr <<< "$line"
echo $linearr
newx=${linearr[$xindex]}

echo "newx : $newx"
