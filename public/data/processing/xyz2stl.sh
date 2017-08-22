#!/bin/bash

  #Accepts path/to/file.xyz
  #generates file.stl using script.mlx
  #returns relative path to file.stl
  #adds file.stl to processing/processed/
  xyzpath=$1
  dest='processed/stl/'
  script="poissonmesh.mlx"

if [ "${xyzpath: -4 }" == ".xyz" ]  && [ -f $xyzpath ];then
    xyzfile=$(basename $xyzpath)
    IFS='.' read -ra name <<< "$xyzfile"
    stlfile=${name[0]}.stl
    meshlabserver -i "$xyzpath" -o "$dest$stlfile" -om vc vn -s $script
else
    echo "$xyzpath is not an existing xyz file"
    echo "exiting..."
    exit 1
fi
