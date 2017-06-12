import numpy

input="june1_full.txt"
file=open(input)
i=0

bound=0.05#bound that dictates whether two points can be considered as sharing the same plane

data = [line.split() for line in file]
card = len(data)

height = 0

#iterate over all possible PCD point pairs and find the two points approximately in the same plane
#that have the largest seperation distance (corresponds to the largest width of the iceberg)
for i in range(0,card):
    p1 = [float(x) for x in data[i][0:3]]#grab the first point
    for j in range(i+1,card):
        p2 = [float(x) for x in data[j][0:3]] #grab the second point
        vector=numpy.subtract(p2,p1)        
        xyvec=vector[0:2]
        subnorm = numpy.linalg.norm(xyvec)
        if (abs(subnorm) <= bound): #check if the two points are roughly in the same plane
            vnorm=numpy.linalg.norm(vector)
            if(vnorm>height): 
                height=vnorm
                print "New choice | ",height,p1,p2
print height
