const Discord = require("discord.js");

const fs = require("fs")
const prefix = "/";
const client = new Discord.Client()
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
      if(message.author.bot) return;
    let commandFile = require(`./cmds/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    console.error(err)
  }
  // Let's go with a few common example commands! Feel free to delete or change those.
   if (message.content === "$loop") { 
      var interval = setInterval (function () {
        message.channel.send("@356489931633459200")
      }, 1 * 1000); 
    }
  const swearWords = ["darn", "shucks", "frak", "shite"];
if( swearWords.some(word => message.content.includes(word)) ) {
  message.delete();
}







});

client.login("process.env.BOT_TOKEN");
