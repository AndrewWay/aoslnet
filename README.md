## Usage

First clone the project repository into a chosen directory

git clone https://github.com/AndrewWay/aoslnet.git

There is a script called setup.sh in the main directory. This is a brutish method of installing anything you might need to host the website on a local server, i.e., MongoDB, NodeJS, and various other packages. Run that and, fingers crossed, you should be able to startup MongoDB and NodeJS on localhost. 

source setup.sh
sudo service mongod start
npm start

The website should accessible on localhost:3000 now. The database is still empty at this point, so you'll need to create an entry to start using the website. 

cd public/data/

Here you'll find another script "upload.sh". Follow the prompts from the script and the script will upload a new JSON to the database you have running on your local machine. 

That's it! Enjoy.
