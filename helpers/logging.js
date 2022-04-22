let config = require('../config.json')
let { blue, green, yellow } = require('colors');

module.exports.systemLog = (plugin, data) => {
    console.log(`[${blue(plugin.toUpperCase())}] ${green(data)}`)
}
module.exports.verboseLog = (plugin, data) => {
    if(process.argv.indexOf('--verbose=true') !== -1){
        console.log(`[${blue(plugin.toUpperCase())}] ${yellow(data)}`)
    }
    else if(config.verboseLog){
        console.log(`[${blue(plugin.toUpperCase())}] ${yellow(data)}`)
    }

}
