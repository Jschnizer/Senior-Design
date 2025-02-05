*Note that this application is currently in development, and the steps to run the application and use the application may change frequently as the app is in development.

# Steps before launch
1. Install react and all dependencies
2. Obtain the .env file and add this to the code path
3. Have a spotify associated email address added to the spotify developer console by an admin

# Steps to run the code
*Note: This assumes you have all required packages and dependencies installed. You will need to download node.js, install express, and run npm i in both the code and code/client folders to run the code*
1. Open a terminal and navigate to code/server
2. Run *node server.js*
3. Open another terminal and navigate to code/client
4. Run *npm start*

## To run the python server to access the AI model:
1. Navigate to model/server
2. Run *python server.py*

# Application Running 
1. Log into the application with the credentials associated with the email that was entered in the spotify developer console
2. Upon logging in, select various contextual inputs for song filtering *Note this functionality is currently not working and in development.
3. Select "Get My Tracks" at the top of the page, and a swipable card field will appear populated with song recommendations based on spotify listening data. Swipe this card to begin adding songs to a playlist. *Note this functionality is currently not working and in development. Songs may be swiped and are added to a list to simulate playlist buildinf 

