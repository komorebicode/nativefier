#!/usr/bin/env node
var fs = require('fs')
var args = require('minimist')(process.argv.slice(2), {boolean: ['prune', 'asar', 'all', 'overwrite']})
var packager = require('./')
var usage = fs.readFileSync(__dirname + '/usage.txt').toString()

args.dir = './app';
args.name = args._[0];

var protocolSchemes = [].concat(args.protocol || [])
var protocolNames = [].concat(args['protocol-name'] || [])

if (protocolSchemes && protocolNames && protocolNames.length === protocolSchemes.length) {
  args.protocols = protocolSchemes.map(function (scheme, i) {
    return {schemes: [scheme], name: protocolNames[i]}
  })
}

if (!args.dir || !args.name || !args.version || !args.target || (!args.all && (!args.platform || !args.arch))) {
  console.error(usage)
  process.exit(1)
}

var appArgs = {
    name: args.name,
    targetUrl: args.target
};

fs.writeFileSync('./app/targetUrl.txt', JSON.stringify(appArgs));


packager(args, function done (err, appPaths) {
  if (err) {
    if (err.message) console.error(err.message)
    else console.error(err, err.stack)
    process.exit(1)
  }

  if (appPaths.length > 1) console.error('Wrote new apps to:\n' + appPaths.join('\n'))
  else if (appPaths.length === 1) console.error('Wrote new app to', appPaths[0])
})
