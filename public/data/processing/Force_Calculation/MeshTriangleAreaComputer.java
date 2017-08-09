import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.Scanner;

public class MeshTriangleAreaComputer
{

public static void main(String []args) throws FileNotFoundException
{

	// Prepare for file input and output
	Scanner scan = new Scanner(System.in);
	System.out.println("Input file: ");
	String inputFileName = scan.next();
	System.out.println("Output File: ");
	String outFileName = scan.next();

	File inputFile = new File(inputFileName);
	File outputFile = new File(outFileName);
	Scanner in = new Scanner (inputFile);
	PrintWriter out = new PrintWriter(outFileName);
	
	// Remove Header String. Read in number of vertices and faces
	in.next();
	int countVertices = in.nextInt();
	int countFaces = in.nextInt();

	//Remove following 0
	in.nextInt();

	//Initialize vertex array
	double[][] vertices = new double[countVertices][3];
	int[][] faces = new int[countFaces][3];
	
	for (int i = 1; i <= countVertices; i++)
	{
		for (int j = 1; j <= 3; j++)
		{
		vertices[i-1][j-1] = in.nextDouble();
		//System.out.println(vertices[i-1][j-1]);
		}
	}

	for (int i = 1; i <= countFaces; i++)
	{
		//Remove number of vertices in file
		in.next();
		// Initialize face array
		for (int j = 1; j <= 3; j++)
		{
			faces[i-1][j-1] = in.nextInt();
			//System.out.println(faces[i-1][j-1]);
		}
	}
	
	in.close();

	// Compute Triangle area using determinant method
	double seg1 = 0.0;
	double seg2 = 0.0;
	double seg3 = 0.0;
	double[] Areas = new double[countFaces];
	double Ux = 0.0;
	double Uy = 0.0;
	double Uz= 0.0;
	double Vx = 0.0;
	double Vy = 0.0;
	double Vz = 0.0;
	double Norm = 0.0;
	double[][] Normal = new double[countFaces][3];

	for (int i = 1; i <= countFaces; i++)
	{
		seg1 = vertices[faces[i-1][0]][0]*(vertices[faces[i-1][1]][1] - vertices[faces[i-1][2]][1]);
		seg2 = vertices[faces[i-1][1]][0]*(vertices[faces[i-1][2]][1] - vertices[faces[i-1][0]][1]);
		seg3 = vertices[faces[i-1][2]][0]*(vertices[faces[i-1][0]][1] - vertices[faces[i-1][1]][1]);
 		Areas[i-1] = Math.abs(0.5*(seg1+seg2+seg3));

	// Compute face normal vector using cross-product of triangle edges
		Ux =  vertices[faces[i-1][1]][0] - vertices[faces[i-1][0]][0];
		Uy =  vertices[faces[i-1][1]][1] - vertices[faces[i-1][0]][1];
		Uz =  vertices[faces[i-1][1]][2] - vertices[faces[i-1][0]][2];
		Vx =  vertices[faces[i-1][2]][0] - vertices[faces[i-1][0]][0];
		Vy =  vertices[faces[i-1][2]][1] - vertices[faces[i-1][0]][1];
		Vz =  vertices[faces[i-1][2]][2] - vertices[faces[i-1][0]][2];

		Normal[i-1][0] = Uy*Vz - Uz*Vy;
		Normal[i-1][1] = Uz*Vx - Ux*Vz;
		Normal[i-1][2] = Ux*Vy - Uy*Vx;
		Norm = Math.sqrt(Normal[i-1][0]*Normal[i-1][0] + Normal[i-1][1]*Normal[i-1][1] + Normal[i-1][2]*Normal[i-1][2]);

		out.println(Areas[i-1] + " " + Normal[i-1][0]/Norm + " " + Normal[i-1][1]/Norm + " " + Normal[i-1][2]/Norm);

	}
	out.close();
}

}
