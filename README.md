# Universal-Rich-Presence

## Setup
Clone this repo locally and `cd` into it.<br>
Run `npm run start` and open either VLC or Webstorm.<br>
To add more plugins just download their `pluginName.plugin.js` file and place it in your plugins folder.<br>
**Note: Some plugins will require setup and should inform you on first usage.**<br>

## VLC Plugin Setup
Run `npm run start` while vlc is open.<br>
Create and application on the [<ins>Spotify developer dashboard</ins>](https://developer.spotify.com/dashboard/applications).<br>
Copy your Client id and secret and replace the matching values in the `/config/vlc.config.json` file. <br>
Update the setup value to true (default: false).<br>
Run `npm run start` to check that it is working.
