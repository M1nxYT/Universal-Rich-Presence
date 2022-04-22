# Universal-Rich-Presence

## Setup
1. Clone repo: `https://github.com/Zemyoro/Universal-Rich-Presence` and `cd` into it.
1. Run `npm run start` and open in your text editor or IDE.
1. To add more plugins, download their `pluginName.plugin.js` file and place it in your plugins folder.<br>
**Note: Some plugins require setup and will inform on first usage.**<br>

## VLC Plugin Setup
1. Run `npm run start` while VLC is open.<br>
1. Create an application on the [<ins>Spotify for Developers Dashboard</ins>](https://developer.spotify.com/dashboard/applications)
1. Copy your Client ID and Client Secret then replace the matching values in the `/config/vlc.config.json` file
1. Update the setup value to true (default: false)
1. Create a shortcut with the following target and correct file location for your VLC install:<br>
`C:/Program Files (x86)/VideoLAN/VLC/vlc.exe --extraintf http --http-host localhost --http-password password --http-port 8080`
1. Run `npm run start` and open VLC via the shortcut from above to check that it is working