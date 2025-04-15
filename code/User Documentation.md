# Publicly Available Site
SoundScape is available for anyone to use. If you would like to use the app and are not worried about the process of running the code, please visit the publicly available site at [this link](https://senior-design-soundscape.vercel.app/) and log in with your Spotify account
   - *IMPORTANT: To have access to SoundScape, you must contact one of the developers (see [project description](../assignments/Fall/Assignment%202%20-%20Project%20Description/project-description.md) for contact information) to have the email associated with your Spotify account added to the list of approved users*

*NOTE: The following steps outline how to run the code in a development environment. If you are simply interested in using SoundScape, please visit the publicly available site at [this link](https://senior-design-soundscape.vercel.app/). Further instructions on how to use the app can be found below*

# Steps Before Launch
1. Install all dependencies
    1. First, install [Node.js](https://nodejs.org/en/download) if necessary
    2. Then run *npm install express*, *npm install react*, and *npm i*
3. Obtain the .env file from one of the developers and add this inside the [server](/code/server) folder
4. Have a Spotify associated email address added to the Spotify developer console by an admin

# Steps to Run the Code
*Note: This assumes you have all required packages and dependencies installed. You will need to download node.js, install express, and run npm i in both the code and code/client folders to run the code*
1. Open a terminal and navigate to code/server
2. Run *node server.js*
3. Open another terminal and navigate to code/client
4. Run *npm start*

# Application Running
1. When you run *npm start*, it will launch the application. Otherwise, by default, it will run on port 3000 so you can navigate to [localhost:3000](http://localhost:3000) to access the app
2. Log into the application with the credentials associated with the email that was entered in the spotify developer console
3. Upon logging in, you will be brought to the home page of the application. Here you may enter any contextual inputs or criteria you are interested in for song generation.
4. Once the criteria is entered, click 'Generate Playlist' at the bottom of the page to begin.

---
*The following sections outline how to use the SoundScape app*

# SoundScape Home Page
1. Top Bar Buttons for Navigation and Testing
    1. Home Button - use this button to navigate to the home page from any other page on the site.
    2. Playlist Button - use this button to navigate to the playlist generation page at any time.
    3. Login/Logout Button - use this button to login or logout of the application whenever necessary.
    4. Generate Playlist Button - use this button to begin the generation process using the currently selected criteria and prompts.
2. Page Fields for Filtering Songs
    1. Top Checkboxes - use these ceckboxes to enable or disable contextual inputs. When deselected, a contextual input will not be used in the generation process.
    2. Mood - use this checkbox selection to choose your current mood(s) for playlist generation
    3. Genres - use this checkbox selection to choose genres to include in the playlist 
    4. Minimum Song Duration - use this to enter the lower bound for song duration filtering
    5. Maximum Song Duration - use this to enter the upper bound for song duration filtering
    6. Discovery % - use this slider to select the amount of songs to generate that are new to you based on Spotify listening habits
    7. Tempo (BPM) - use this slider to select upper and lower bounds for filtering on BPM of songs
    8. Weather Conditions - use this toggle to enable the use of weather conditions in playlist generation
    9. Top Artists - use this selection field to choose from your current top artists to include them in the playlist generation
    10. Special Instructions - use this text input to write any special instructions for the AI model to take into account when generating recommendations
    11. Generate Playlist - use this button to begin the song generation process once all desired filters are entered

![Home Page Image 1](./User-Docs-Images/HomePage1.PNG "Home Page Image 1")
![Home Page Image 2](./User-Docs-Images/HomePage2.PNG "Home Page Image 2")

# SoundScape Playlist Page
1. Swipe Box - Recommended songs will appear in the swipe box in the middle of the page. Click and drag the song image to the right to add it to the current playlist. Click and drag the song to the left to add the song to the discard list.
2. Playlist - The current list of selected songs will appear in the 'Playlist' section as they are swiped from the center swipe box. Songs in the 'Playlist' section can be re-arranged using the drag handles, or reshuffled to the center using the reshuffle button.
3. Discarded Songs - The current list of discarded songs will appear in the 'Discarded Songs' section as they are swiped from the center swipe box. Songs in the 'Discarded Songs' section can be re-arranged using the drag handles, or reshuffled to the center using the reshuffle button.
4. Plus / Minus Buttons - The plus and minus buttons can be used to achieve the same result as swiping the songs left or right with the cursor. Plus will add the song to the Playlist, and Minus will add the song to the discard list.
5. Export Playlist - The export playlist button will display a pop up box prompting the user to enter a name for their playlist and a back button option, or a submit button option. On submission, the user will recieve a message confirming that the playlist has been successfully exported to their Spotify account.
6. Get More Recommendations - When the user has exhausted their recommendations, the Get More Recommendations button will appear. This button allows the user to generate a new round of recommendations and continue adding them to their playlist.

![Playlist Page Image 1](./User-Docs-Images/PlaylistPage1.PNG "Playlist Page Image 1") 
![Playlist Page Image 2](./User-Docs-Images/PlaylistPage2.PNG "Playlist Page Image 2") 

# FAQ
1. How do I link my Spotify account so I get accurate recommendations? - Login to the app with your spotify credentials and the recommendations will be specific to your listening history.
2. What if I don't want to utilize all filter fields on the home page? - Many of these filter fields will be toggleable so that the user can decide whether or not they want certain fields to be used in playlist generation.
3. What if I want to reshuffle a song back into recommendations if I'm not sure I want it yet? - Use the reshuffle button on the song tiles in the playlist and discard lists.




