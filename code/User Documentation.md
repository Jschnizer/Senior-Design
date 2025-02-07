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
3. Select "Get My Tracks" at the top of the page, and a swipable card field will appear populated with song recommendations based on spotify listening data. Swipe this card to begin adding songs to a playlist. *Note this functionality is currently not working and in development. Songs may be swiped and are added to a list to simulate playlist building currently.

# SoundScape Home Page
1. Top Bar Buttons for Navigation and Testing
    1. Home Button - use this button to navigate to the home page from any other page on the site
    2. Playlist Button - use this button to navigate to the playlist generation page at any time *Note this is for testing purposes only, this button will likely be removed in future versions of the application.
    3. Login/Logout Button - use this button to login or logout of the application whenever necessary. The button will change based on whether the application is logged in or logged out.
    4. Get Weather Button - use this button to retrieve information about the current weather in your location. *Note this button is for testing purposes currently and will likely be removed in future versions of the application.
2. Page Fields for Filtering Songs
    1. Mood - use this dropdown to select your current mood for playlist generation
    2. Genres - use this dropdown to select genres to include in the playlist 
    3. Minimum Song Duration - use this to enter the lower bound for song duration filtering
    4. Maximum Song Duration - use this to enter the upper bound for song duration filtering
    5. Discovery % - use this slider to select the amount of songs to generate that are new to you
    6. Tempo (BPM) - use this slider to select upper and lower bounds for filtering on BPM of songs
    7. Weather Conditions - use this checkbox to toggle the use of weather conditions in playlist generation
    8. Generate Playlist - use this button to begin the song generation process once all desired filters are entered

![Home Page Image](/code/User-Docs-Images/HomePage.PNG "Home Page Image")

# SoundScape Playlist Page
1. Swipe Box - Recommended songs will appear in the swipe box in the middle of the page. Click and drag the song image to the right to add it to the current playlist.
2. Song List - The current list of selected songs will appear above the playlist as they are swiped from the swipe box.
3. *Note there is currently no way to export songs to Spotify yet, this will be added in a future version.

![Playlist Page Image](/code/User-Docs-Images/PlaylistPage.PNG "Playlist Page Image") 

# FAQ
1. How do I link my Spotify account so I get accurate recommendations? - Login to the app with your spotify credentials and the recommendations will be specific to your listening history.
2. What if I don't want to utilize all filter fields on the home page? - Many of these filter fields will be toggleable so that the user can decide whether or not they want certain fields to be used in playlist generation.
3. What if I want to reshuffle a song back into recommendations if I'm not sure I want it yet? - A reshuffle feature will be added in a future version of the app, this will allow users to save a song for later if they aren't sure yet.




