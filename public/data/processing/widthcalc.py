import numpy
import sys

input=sys.argv[1]
file=open(input)
i=0

bound=0.05#bound that dictates whether two points can be considered as sharing the same plane

data = [line.split() for line in file]
card = len(data)

wid = 0

#iterate over all possible PCD point pairs and find the two points approximately in the same plane
#that have the largest seperation distance (corresponds to the largest width of the iceberg)
for i in range(0,card):
    p1 = [float(x) for x in data[i][0:3]]#grab the first point
    for j in range(i+1,card):
        p2 = [float(x) for x in data[j][0:3]] #grab the second point
        if (abs((p2[2]-p1[2])/p2[2]) <= bound): #check if the two points are roughly in the same plane
            vector=numpy.subtract(p2,p1)
            vnorm=numpy.linalg.norm(vector)
            if(vnorm>wid): 
                wid=vnorm
#                print "New choice | ",wid,p1,p2
print wid
