let previousPresence = {
    presence: {
        state: '',
        details: ''
    }
}
let icons = {
    js: {
        icon: 'https://cdn.icon-icons.com/icons2/2107/PNG/128/file_type_js_official_icon_130509.png',
        text: 'JavaScript'
    },
    ts: {
        icon: 'https://cdn.icon-icons.com/icons2/2107/PNG/512/file_type_typescript_official_icon_130107.png',
        text: 'TypeScript'
    },
    json: {
        icon: 'https://cdn.icon-icons.com/icons2/2248/PNG/128/code_json_icon_136758.png',
        text: 'Json'
    },
    default: {
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/WebStorm_Icon.svg/1024px-WebStorm_Icon.svg.png',
        text: 'Webstorm'
    }
}

module.exports = {
    name: 'webstorm',
    processName: 'webstorm64.exe',
    priority: 0,
    update: (processInfo) =>{

        let updatedPresence = {
            state: 'Idling',
            details: 'Webstorm',
            startTimestamp: Date.now(),
            largeImageKey: icons['default'].icon,
            largeImageText: icons['default'].text,
        }

        let fileName = processInfo.windowTitle.split(' - ')[1]
        let fileExt

        if (fileName) {
            fileExt = fileName.split('.').slice(-1)[0]
            updatedPresence.state = `Editing ${fileName}`
        }

        if(icons[fileExt]){
            updatedPresence.largeImageKey = icons[fileExt].icon
            updatedPresence.smallImageKey = icons['default'].icon
            updatedPresence.largeImageText = icons[fileExt].text
            updatedPresence.smallImageText = icons['default'].text
        }


        if (previousPresence.state === updatedPresence.state){
            return previousPresence
        }
        else{
            previousPresence = updatedPresence
            return updatedPresence
        }
    }
}
