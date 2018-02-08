#!/usr/bin/env node

var config = require('./config.json')
var pack = require('./package.json')
var pm2 = require('pm2')
var request = require('request')
const cTable = require('console.table') // eslint-disable-line
var program = require('commander')

program
  .version(pack.version, '-v, --version')

program
  .command('list')
  .alias('ls')
  .description('Return a List of all Services')
  .action(function () {
    var services = []
    for (var service of config) {
      services.push(service.name)
    }
    console.table('TIMO Serices', services)
  })

program
  .command('status')
  .alias('st')
  .description('Gets the Status for all Services')
  .action(function () {
    pm2.connect(function (err) {
      if (err) {
        console.error(err)
        process.exit(2)
      } else {
        pm2.list(function (err, list) {
          if (err) {
            console.error(err)
            process.exit(2)
          } else {
            var status = []
            for (var service of config) {
              var obj = {}
              obj.name = service.name
              var pm2Desc = list.find(o => o.name === service.pm2)
              obj.id = pm2Desc.id
              obj.uptime = pm2.pm2_env.pm2_uptime
              obj.status = pm2.pm2_env.status
              status.push(obj)
            }
            // TODO: Add Arduino
            console.table('TIMO Status', status)
          }
        })
      }
    })
  })

program
  .command('check [service]')
  .action(function (service) {
    if (service === 'all' || service === '') {
      // TODO: for all
    } else {
      var localVersion = require(config[service].version.local).version
      request(config[service].version.repo, function (error, response, body) {
        if (error) {
          console.error(error)
          process.exit(2)
        } else {
          var repoVersion = body.version
        }
        var version = [{
          name: service,
          local: localVersion,
          repo: repoVersion
        }]
        console.table('TIMO Version', version)
      })
    }
  })

program
  .command('update <service>')
  .action(function (service) {
    // TODO: Updates. Uses lib-update
  })

program
  .command('stop <service>')
  .action(function (service) {
    // TODO: uses pm2 to stop a service
  })
program
  .command('start <service>')
  .action(function (service) {
    // TODO: uses pm2 to start a service
  })
program
  .command('restart <service>')
  .action(function (service) {
    // TODO: uses pm2 to restart a service
  })
program
  .command('coldstart')
  .action(function (service) {
    // TODO: calls shutdown -r now
  })
program
  .command('shutdown')
  .action(function (service) {
    // TODO: calls shutdown -h now
  })
program
  .command('config <name>')
  .command('get <key>')
  .action(function (service) {
    // TODO: get key from config of service
  })
  .command('config <name>')
  .command('set <key> ')
  .option('--value [newvalue]', 'Value to set to')
  .action(function (service) {
    // TODO: set key for config of asks for it
  })

program
  .command('flightcheck')
  .action(function (service) {
    // TODO: checks, if all is ok (folders there, permissions correct, pm2 running, etc…
  })
program.parse(process.argv)
