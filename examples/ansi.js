/*
 *
 * A simple bot that logs everything that is said to the console.
 *
 */
const mineflayer = require('mineflayer')

// if (process.argv.length < 4 || process.argv.length > 6) {
//   console.log('Usage : node ansi.js <host> <port> [<name>] [<password>]')
//   process.exit(1)
// }

const bot = mineflayer.createBot({
  host: "keinett.com",
  username: "Snowhelm"
  // username: process.argv[4] ? process.argv[4] : 'ansi',
  // password: process.argv[5],
  // verbose: true
})

bot.on('message', (message) => {
  console.log(message.toAnsi())
})
