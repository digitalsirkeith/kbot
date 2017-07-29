/*
 * This example demonstrates how easy it is to create a bot
 * that sends chat messages whenever something interesting happens
 * on the server you are connected to.
 *
 * Below you can find a wide range of different events you can watch
 * but remember to check out the API documentation to find even more!
 *
 * Some events may be commented out because they are very frequent and
 * may flood the chat, feel free to check them out for other purposes though.
 *
 * This bot also replies to some specific chat messages so you can ask him
 * a few informations while you are in game.
 */
const mineflayer = require('mineflayer')
const Vec3 = require('vec3').Vec3

if (process.argv.length < 4 || process.argv.length > 6) {
  console.log('Usage : node chatterbot.js <host> <port> [<name>] [<password>]')
  process.exit(1)
}

const bot = mineflayer.createBot({
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  username: process.argv[4] ? process.argv[4] : 'chatterbox',
  password: process.argv[5],
  verbose: true
})

bot.on('chat', (username, message) => {
  if (username === bot.username) return
  const result = /canSee (-?[0-9]+),(-?[0-9]+),(-?[0-9]+)/.exec(message)
  if (result) {
    canSee(new Vec3(result[1], result[2], result[3]))
    return
  }
  switch (message) {
    case 'pos':
      sayPosition(username)
      break
    case 'wearing':
      sayEquipment()
      break
    case 'spawn':
      saySpawnPoint()
      break
    case 'block':
      sayBlockUnder(username)
      break
    case 'quit':
      quit(username)
      break
    default:
      console.log("That's nice")
  }

  function canSee (pos) {
    const block = bot.blockAt(pos)
    const r = bot.canSeeBlock(block)
    if (r) {
      console.log(`I can see the block of ${block.displayName} at ${pos}`)
    } else {
      console.log(`I cannot see the block of ${block.displayName} at ${pos}`)
    }
  }

  function sayPosition (username) {
    console.log(`I am at ${bot.entity.position}`)
    console.log(`You are at ${bot.players[username].entity.position}`)
  }

  function sayEquipment () {
    const eq = bot.players[username].entity.equipment
    const eqText = []
    if (eq[0]) eqText.push(`holding a ${eq[0].displayName}`)
    if (eq[1]) eqText.push(`wearing a ${eq[1].displayName} on your feet`)
    if (eq[2]) eqText.push(`wearing a ${eq[2].displayName} on your legs`)
    if (eq[3]) eqText.push(`wearing a ${eq[3].displayName} on your torso`)
    if (eq[4]) eqText.push(`wearing a ${eq[4].displayName} on your head`)
    if (eqText.length) {
      console.log(`You are ${eqText.join(', ')}.`)
    } else {
      console.log('You are naked!')
    }
  }

  function saySpawnPoint () {
    console.log(`Spawn is at ${bot.spawnPoint}`)
  }

  function sayBlockUnder () {
    const block = bot.blockAt(bot.players[username].entity.position.offset(0, -1, 0))
    console.log(`Block under you is ${block.displayName} in the ${block.biome.name} biome`)
    console.log(block)
  }

  function quit (username) {
    bot.quit(`${username} told me to`)
  }
})

bot.on('whisper', (username, message, rawMessage) => {
  console.log(`I received a message from ${username}: ${message}`)
  bot.whisper(username, 'I can tell secrets too.')
})
bot.on('nonSpokenChat', (message) => {
  console.log(`Non spoken chat: ${message}`)
})

bot.on('login', () => {
  console.log('Hi everyone!')
})
bot.on('spawn', () => {
  console.log('I spawned, watch out!')
})
bot.on('spawnReset', (message) => {
  console.log('Oh noez! My bed is broken.')
})
bot.on('forcedMove', () => {
  console.log(`I have been forced to move to ${bot.entity.position}`)
})
bot.on('health', () => {
  console.log(`I have ${bot.health} health and ${bot.food} food`)
})
bot.on('death', () => {
  console.log('I died x.x')
})
bot.on('kicked', (reason) => {
  console.log(`I got kicked for ${reason}`)
})

bot.on('time', () => {
  // console.log("Current time: " + bot.time.day % 24000);
})
bot.on('rain', () => {
  if (bot.isRaining) {
    console.log('It started raining.')
  } else {
    console.log('It stopped raining.')
  }
})
bot.on('noteHeard', (block, instrument, pitch) => {
  console.log(`Music for my ears! I just heard a ${instrument.name}`)
})
bot.on('chestLidMove', (block, isOpen) => {
  const action = isOpen ? 'open' : 'close'
  console.log(`Hey, did someone just ${action} a chest?`)
})
bot.on('pistonMove', (block, isPulling, direction) => {
  const action = isPulling ? 'pulling' : 'pushing'
  console.log(`A piston is ${action} near me, i can hear it.`)
})

bot.on('playerJoined', (player) => {
  if (player.username !== bot.username) {
    console.log(`Hello, ${player.username}! Welcome to the server.`)
  }
})
bot.on('playerLeft', (player) => {
  if (player.username === bot.username) return
  console.log(`Bye ${player.username}`)
})
bot.on('playerCollect', (collector, collected) => {
  if (collector.type === 'player' && collected.type === 'object') {
    const rawItem = collected.metadata[10]
    const item = mineflayer.Item.fromNotch(rawItem)
    console.log(`${collector.username !== bot.username ? ("I'm so jealous. " + collector.username) : 'I '} collected ${item.count} ${item.displayName}`)
  }
})

bot.on('entitySpawn', (entity) => {
  if (entity.type === 'mob') {
    console.log(`Look out! A ${entity.mobType} spawned at ${entity.position}`)
  } else if (entity.type === 'player') {
    console.log(`Look who decided to show up: ${entity.username}`)
  } else if (entity.type === 'object') {
    console.log(`There's a ${entity.objectType} at ${entity.position}`)
  } else if (entity.type === 'global') {
    console.log('Ooh lightning!')
  } else if (entity.type === 'orb') {
    console.log('Gimme dat exp orb!')
  }
})
bot.on('entityHurt', (entity) => {
  if (entity.type === 'mob') {
    console.log(`Haha! The ${entity.mobType} got hurt!`)
  } else if (entity.type === 'player') {
    console.log(`Aww, poor ${entity.username} got hurt. Maybe you shouldn't have a ping of ${bot.players[entity.username].ping}`)
  }
})
bot.on('entitySwingArm', (entity) => {
  console.log(`${entity.username}, I see that your arm is working fine.`)
})
bot.on('entityCrouch', (entity) => {
  console.log(`${entity.username}: you so sneaky.`)
})
bot.on('entityUncrouch', (entity) => {
  console.log(`${entity.username}: welcome back from the land of hunchbacks.`)
})
bot.on('entitySleep', (entity) => {
  console.log(`Good night, ${entity.username}`)
})
bot.on('entityWake', (entity) => {
  console.log(`Top of the morning, ${entity.username}`)
})
bot.on('entityEat', (entity) => {
  console.log(`${entity.username}: OM NOM NOM NOMONOM. That's what you sound like.`)
})
bot.on('entityAttach', (entity, vehicle) => {
  if (entity.type === 'player' && vehicle.type === 'object') {
    console.log(`Sweet, ${entity.username} is riding that ${vehicle.objectType}`)
  }
})
bot.on('entityDetach', (entity, vehicle) => {
  if (entity.type === 'player' && vehicle.type === 'object') {
    console.log(`Lame, ${entity.username} stopped riding the ${vehicle.objectType}`)
  }
})
bot.on('entityEquipmentChange', (entity) => {
  console.log('entityEquipmentChange', entity)
})
bot.on('entityEffect', (entity, effect) => {
  console.log('entityEffect', entity, effect)
})
bot.on('entityEffectEnd', (entity, effect) => {
  console.log('entityEffectEnd', entity, effect)
})
