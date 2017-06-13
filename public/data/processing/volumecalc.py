import numpy
import sys

input=sys.argv[1]
file=open(input)
i=0


def cross(a, b):
    c = [a[1]*b[2] - a[2]*b[1],
         a[2]*b[0] - a[0]*b[2],
         a[0]*b[1] - a[1]*b[0]]

    return c


data = [line.split() for line in file]
card = len(data)
i = 0
vol=0
while ( i < card-3 ):
    v1=[float(x) for x in data[i][0:3]]
    i=int(i)+1
    v2=[float(x) for x in data[i][0:3]]
    i=int(i)+1
    v3=[float(x) for x in data[i][0:3]]
    i=int(i)+1
       
    c=cross(v1,v2)
    d=numpy.dot(c,v3)
    V=d/6
	#V=abs(d/6)
    vol=vol+V

#TODO: Account for remaining vectors 
#if ( card - i == 3 )

#else if ( card - i == 2 )

#else if ( card - i == 1 )

#else if ( card - i == 0 )

print vol 
