const mineflayer = require('mineflayer');
const windows = require('prismarine-windows').windows;

if (process.argv.length != 3) {
  console.log('Usage : node echo.js <name>');
  process.exit(1);
}

let name = process.argv[2];
let email = process.argv[2] + '@eee.upd.edu.ph';
let password = name+name+name;

const bot = mineflayer.createBot({
	host: "mc.keinett.com",
	username: name,
});

bot.on('message', (message) => {
  console.log(message.toAnsi());
});

var isIn = true;

bot.on('spawn', function(){
  if (isIn) {
    bot.chat("/register " + password + " " + email);
    bot.chat("/login " + password);
    bot.chat("/server skyblock");
    isIn = false;
  } else  {
    bot.chat("/is");
  }
  console.log(Object.keys(bot.players));
});

bot.on('windowOpen', (window) => {
  bot.clickWindow(1,0,0);
});