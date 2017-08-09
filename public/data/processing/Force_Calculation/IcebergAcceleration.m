function acceleration = IcebergAcceleration( velocityfile, normalfile )
%This function reads in Iceberg Mesh Area data with normal vectors and 
%ADCP velocity data, and computes the drift acceleration for the iceberg in the
%mesh.

Normals = importdata(normalfile);
Velocities = importdata(velocityfile);
Areas = Normals(:,1);
Normals(:,1) = [];
Density = 1025;
MassI = 10^6;
x = [1,0,0];
y = [0,1,0];

Force = Density*Areas.*Normals.*dot(Velocities,Normals).^2;
Forcex = Force*x';
Forcey = Force*y';

Fx = sum(Forcex);
Fy = sum(Forcey);

acceleration = [Fx/MassI, Fy/MassI];
end

