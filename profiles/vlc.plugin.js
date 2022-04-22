const VlcPlugin = require('vlc.js');
const Spotify = require('node-spotify-api');
const { getLinks } = require('songlink-api');
const fs = require("fs");
const {systemLog, verboseLog} = require("../helpers/logging");

let previousPresence = {
    presence: {
        state: '',
        details: ''
    }
}

const client = new VlcPlugin.VLCClient({
    address:'localhost',
    port: 8080,
    password: 'password'
})

let configHelper = () => {
    if(!fs.existsSync('./config/vlc.config.json')){
        let configJson = {
            "setup": false,
            "spotify": {
                "id":"<idgoeshere>",
                "secret":"<secretgoeshere>",
            }
        }
        fs.writeFileSync('./config/vlc.config.json', JSON.stringify(configJson));
        return configJson
    }
    else{
        return require('../config/vlc.config.json')
    }
}

module.exports = {
    name: 'vlc',
    processName: 'vlc.exe',
    priority: 1,
    update: async (processInfo) => {
        configHelper()
        let config = await configHelper()
        if(!config.setup || config.spotify.id === '<idgoeshere>' || config.spotify.secret === '<secretgoeshere>'){
            let updatedPresence = {
                state: 'Idling..',
                largeImageKey: 'vlc',
                largeImageText: 'VlC Media Player',
                instance: true,
                startTimestamp: Date.now(),
                buttons: [{
                    label: 'Checkout project',
                    url: 'https://github.com/M1nxYT/Universal-Rich-Presence'
                }]
            }
            if (previousPresence.state === updatedPresence.state){
                return previousPresence
            }
            else{
                previousPresence = updatedPresence
                systemLog('vlc', `Appropriate config values need to be filled!`)
                systemLog('vlc', `Check the 'vlc.config.json' file located in '/config/'.`)
                systemLog('vlc', `After these values are filled please change the setup value to true.`)
                systemLog('vlc', `Please create a shortcut for VLC with the following target (Don't forget to fix the path to your actual install):`)
                systemLog('vlc', `C:/Program Files (x86)/VideoLAN/VLC/vlc.exe --extraintf http --http-host localhost --http-password password --http-port 8080`)
                systemLog('vlc', `For more help refer to this projects Github wiki or issues page.`)
                return updatedPresence
            }
        }
        else{
            let spotify = new Spotify(config.spotify);

            let vlcMeta = await client.getStatus()

            if (vlcMeta.state === 'stopped')
                return {
                    state: 'Stopped',
                    details: 'Nothing is playing',
                    largeImageKey: 'vlc',
                    largeImageText: 'VlC Media Player',
                    smallImageKey: 'stopped',
                    smallImageText: 'Stopped',
                    instance: true,
                    buttons: [{
                        label: 'Checkout project',
                        url: 'https://github.com/M1nxYT/Universal-Rich-Presence'
                    }]
                };

            const { meta } = vlcMeta.information.category;
            const output = {
                details: meta.title || meta.filename,
                state: '',
                partySize: 0,
                partyMax: 0,
                largeImageKey: 'vlc',
                largeImageText: 'VLC Media Player',
                smallImageKey: vlcMeta.state,
                smallImageText: vlcMeta.state[0].toUpperCase() + vlcMeta.state.slice(1, vlcMeta.state.length) + '!',
                startTimestamp: 1,
                endTimestamp: 1,
                buttons: [{
                    label: 'Checkout project',
                    url: 'https://github.com/M1nxYT/Universal-Rich-Presence'
                }]
            };

            if (meta.artist) {
                output.details += ` - ${meta.artist}`;
                if (meta.album) output.state = meta.album;
                if (meta.track_number && meta.track_total) {
                    output.partySize = parseInt(meta.track_number, 10);
                    output.partyMax = parseInt(meta.track_total, 10);
                }
            } else {
                output.state = vlcMeta.state;
            }

            const end = Math.floor(Date.now() / 1000 + ((vlcMeta.length - vlcMeta.time) / vlcMeta.rate));

            if (vlcMeta.state === 'playing' && vlcMeta.length !== 0) {
                output.endTimestamp = end;
            }

            if (meta.title && meta.artist && spotify) {

                try {
                    let songData = await spotify.search({ type: 'track', query: `${meta.title} ${meta.artist.replace(' ft. ', ' ')}` });
                    if (!songData) return;

                    if (songData.tracks) {
                        if (songData.tracks.items[0]) {
                            let song = songData.tracks.items[0]
                            let songLink
                            try {
                                songLink = await getLinks({ url: song.external_urls.spotify })
                            }
                            catch (e) { verboseLog('VLC', 'Failed to fetch song.link data') }

                            if (songLink?.pageUrl) {
                                output.buttons.unshift({
                                    label: `View on Songlink`,
                                    url: songLink.pageUrl
                                });
                            }

                            if (song.album.images && song.album.images.length > 0) {
                                output.largeImageKey = song.album.images[0].url
                            }
                        }
                    }
                } catch(e){ return verboseLog('VLC', 'Failed to fetch spotify data') }
            }

            return output;
        }
    }
}
