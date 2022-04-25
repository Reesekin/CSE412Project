# CSE412Project

World Analytics Project by Tommy Thai, and Peter Kim.

Prerequisites:
* Installation of Node.js
* Importation of the dumpfile

How to import:
1. Open your terminal
2. Log into your psql account (the project uses postgres by default)
3. Run command "CREATE DATABASE countryprofiles"
4. Exit psql by running "\q"
5. Run command "psql countryprofiles < ./dumpfile" (this is assuming your terminal is in the same directory as the dumpfile)
6. Done, now you can run the application 

How to run:
1. In your command prompt run 'npm i' to install all the dependencies
2. The default port is 5432 for the postgres server and 3000 for the express server (Make sure they're not used by anything else and change if needed)
3. Then run 'node index.js'
4. Go to your browser and type in 'localhost:3000/'

