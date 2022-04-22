const fs = require('fs');
const processlist = require('node-processlist');
const config = require('./config.json')
const RPC = require("discord-rpc");
const { systemLog, verboseLog } = require("./helpers/logging");

let client = new RPC.Client({
    transport: 'ipc',
});

let profilesDir = fs.readdirSync(config.profilesDir).filter(files => files.endsWith('.js'));
let profiles = []

let previousProfile
for (let file of profilesDir) {
    let profile = require(`./profiles/${file}`);
    profiles.push(profile)
}
console.clear()

if (!fs.existsSync('./config')) {
    fs.mkdirSync('./config')
    verboseLog('system', 'Config folder created.')
}

async function fetchRunningProfiles(){
    let tasks = await processlist.getProcesses({verbose: false})
    let newArray = []
    for(let task of tasks){
        profiles.includes(task.name)

        let filteredArray = profiles.filter(function (object) {return object.processName === task.name})

        if(filteredArray.length > 0) {
            filteredArray[0].processID = task.pid
            newArray = newArray.concat(filteredArray);
        }
    }
    return newArray
}

function sortByPriority( a, b ) {
    if ( a.priority > b.priority ){
        return -1;
    }
    if ( a.priority < b.priority ){
        return 1;
    }
    return 0;
}

async function setCurrentPresence(){
    if(await fetchRunningProfiles().length === 0) return;
    let runningProfiles = (await fetchRunningProfiles()).sort( sortByPriority )
    let currentProfile = runningProfiles[0]
    if(currentProfile){
        let taskInfo = await processlist.getProcessById(currentProfile.processID, { verbose: true })
        try{
            await client.setActivity(await currentProfile.update(taskInfo));
            verboseLog('VLC', 'Presence updated.')
        } catch (e) {
            verboseLog('VLC', 'Presence failed to update.')
        }

    }
}

client.on("ready", () => {
    systemLog('system', `Displaying rich presence for ${client.user.username}#${client.user.discriminator}.`)
    verboseLog('system', 'Starting Refresh loop.')
    setInterval(() => {
        void setCurrentPresence();
    }, 5e3);
});

void client.login({
    clientId: config.clientID,
})
