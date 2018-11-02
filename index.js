const Discord = require("discord.js");
const {get} = require("snekfetch");

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
const request = require('request');
request.get('http://thecatapi.com/api/images/get?format=src&type=gif')
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
	try {
           get('https://random.cat/meow').then(response => {
                 message.channel.send({files: [{attachment: response.body.file, name: `cat.${response.body.file.split('.')[2]}`}]});
                 console.log('random cat picture');
                  })
                  };
             catch (e) {
                       console.log('error!');
                       }
      }, 1 * 3,600,000); 
    }
  const swearWords = ["darn", "shucks", "frak", "shite"];
if( swearWords.some(word => message.content.includes(word)) ) {
  message.delete();
}







});

client.login(process.env.BOT_TOKEN);
