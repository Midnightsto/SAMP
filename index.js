// Load up the discord.js library
const Discord = require("discord.js");
var randomCat = require('random-cat');

const fs = require("fs")
var url = randomCat.get();
var urlWithSize = randomCat.get({
  width: 120,
  height: 600
});
const sql =  require("sqlite")
sql.opem("./score.sqlite/")
const prefix = ".";
const client = new Discord.Client()
const MusicBot = require('discord-musicbot');
 'use strict';
 
const SpoilerBot = require('discord-spoiler-bot');
 
let config = {
    token: 'NDYxOTc4MDE2NzEzNTM5NjA1.DhbKEg.4LXerR7BmmNQI1cNfxCr1RrGCyw',
};
 
let bot = new SpoilerBot(config);
bot.connect();
const config = {
  // these 3 are always required.
  token: 'NDYxOTc4MDE2NzEzNTM5NjA1.DhbKEg.4LXerR7BmmNQI1cNfxCr1RrGCyw',
  serverId: '461940895730630677',
  textChannelId: '461944066385641483',
 
  // permissions is technically optional, but if you want to access to all
  // permissions you'll need to at the very least make yourself an admin.
  permissions: {
    users: {
      '329349694314774538': 'admin',
    },
  }
};
 
const musicBot = new MusicBot(config);
 
musicBot.run();
fs.readdir("./cmds/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./cmds/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
})
client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 

  client.user.setActivity(`Playing with pings`);
});

client.on("message",  async message => {
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  try {
    let commandFile = require(`./cmds/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    console.error(err)
  }
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  const swearWords = ["darn", "shucks", "frak", "shite"];
if( swearWords.some(word => message.content.includes(word)) ) {
  message.delete();
}
sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
  if (!row) {
    sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
  } else {
    let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
    if (curLevel > row.level) {
      row.level = curLevel;
      sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
      message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
    }
    sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
  }
}).catch(() => {
  console.error;
  sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
    sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
  });
});

if (!message.content.startsWith(prefix)) return;

if (message.content.startsWith(prefix + "level")) {
  sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
    if (!row) return message.reply("Your current level is 0");
    message.reply(`Your current level is ${row.level}`);
  });
} else

if (message.content.startsWith(prefix + "points")) {
  sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
    if (!row) return message.reply("sadly you do not have any points yet!");
    message.reply(`you currently have ${row.points} points, good going!`);
 

  });
}
sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
  if (row.level === 3 ) member.addrole('462132013311328276')

});





});
//client.login("MjU1NzU5NTkyNjg3MDA5Nzk0.DhAWzw.jnfn7o9LLq6MrvsJ1fA5wcM6WQE");
client.login("NDYxOTc4MDE2NzEzNTM5NjA1.DhbKEg.4LXerR7BmmNQI1cNfxCr1RrGCyw");
