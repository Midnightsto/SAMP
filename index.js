// Load up the discord.js library
const Discord = require("discord.js");
var randomCat = require('random-cat');
var url = randomCat.get();
var urlWithSize = randomCat.get({
  width: 120,
  height: 600
});
const request = require('request');

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.
client.on('guildMemberAdd', member => {
   return member.send("Welcome to the Official Nin-mmo Discord Server ${member} please enjoy your stay. Be sure to read #rules and #general-info. For more info on the game, check #game-description. Theres also a channel for community feedback, where you can help the creation of the game by supplying feedback and ideas, called #community-feedback.");
});
client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => {
 if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Dev", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Dev"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
     if(!message.member.roles.some(r=>["Dev"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
  if(command === "tg!arima"){
    if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
      return message.reply("Sorry, you are not a manga reader")
     return message.channel.send({embed: {
      color: 3447003,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      title: "Arima Kishou",
      thumbnail: {
        "url": "https://t00.deviantart.net/ay342j73jxfwq6SAV3k-Z8MPGo4=/fit-in/300x900/filters:no_upscale():origin()/pre00/98d1/th/pre/f/2016/227/9/8/follow__kishou_arima_x_reader__tokyo_ghoul__by_truth4sanity-dae0476.jpg"
      },
      url: "http://tokyoghoul.wikia.com/wiki/Kishou_Arima",
      description: "Here are the details you requested",
      fields: [{
          name: "Affilation:CCG",
          value: "Name:	Kishou Arima\nJapanese name:有馬 貴将 （ありま きしょう\nAlias: CCG's Reaper\nSpecies:Half Human\nGender:Male\nOccupation:Ghoul investigator\nWard:1\nQuinque:Yukimura 1/3 (Koukaku, Rate B) IXA (Koukaku, Rate S+) Narukami (Ukaku, Rate S+) Owl (Ukaku, Rate SSS)\nRank:Special Class"
        }
        
      ],
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "© TG Fan"
      }
    }
  });

  }
  if(command === "tg!touka"){
    if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
      return message.reply("Sorry, you are not a manga reader")
    return message.channel.send({embed: {
     color: 3447003,
     author: {
       name: client.user.username,
       icon_url: client.user.avatarURL
     },
     title: "Touka Kirishima",
     thumbnail: {
       "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/f/f9/Touka_Kirishima.png/revision/latest/scale-to-width-down/280?cb=20140202181308"
     },
     url: "http://tokyoghoul.wikia.com/wiki/Touka_Kirishima",
     description: "Here are the details you requested",
     fields: [{
         name: "Affilation:Anteiku(formely),:Re(formely),Goat",
         value: "Name:	Touka Kirishima\nJapanese name:霧嶋 董香 （きりしま とうか）\nAlias: 	Rabbit\nSpecies: Ghoul\nGender:Female\nnWard:20\nRC Type: Ukaku\n"
       }
       
     ],
     timestamp: new Date(),
     footer: {
       icon_url: client.user.avatarURL,
       text: "© TG Fan"
     }
   }
 });
}
if(command === "tg!ayato"){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")
  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Ayato Kirishima",
   thumbnail: {
     "url": "https://orig00.deviantart.net/b5f2/f/2015/095/5/7/curfew____ayato_kirishima_by_summerlove57-d8o8u83.jpg"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Ayato_Kirishima",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:Aogiri Tree - Executive (Formerly) :re - Associates (Formerly) Goat",
       value: "Name:	Ayato Kirishima\nJapanese name	霧嶋 絢都 （きりしま あやと）\nAlias: 	Black Rabbit\nSpecies: Ghoul\nGender:Male\nnWard:20th Ward (Formerly) 11th Ward (Formerly) 14th Ward (Formerly) 19th Ward (Formerly) 24th Ward (Currently)\nRC Type: Ukaku\nRating:SS"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   
 }
}
});
}
 if(command === "tg!renji" || command === "tg!yomo"){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")
  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Renji Yomo",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/5/50/Yomo_watching_Takatsuki%27s_press_conference.jpg"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Renji_Yomo",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:Anteiku (Formerly) :re (Formerly) Goat",
       value: "Name:	Renji Yomo\nJapanese name:四方 蓮示 （よも れんじ）\nAlias: 	Raven\nSpecies: Ghoul\nGender:Male\nnWard:4th Ward (Formerly) 20th Ward(Formerly) 24th Ward (Currently)\nRC Type: Ukaku"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
 
});

}
if(command === "tg!yoshimura" || command === "tg!kuzen"){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")
  
  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Yoshimura",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/a/a8/Yoshimura_manga.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Yoshimura",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:V (Defected) Anteiku (Formerly)",
       value: "Name:Yoshimura\nJapanese name:芳村 （よしむら\nAlias: 	Kuzen,Manager,Non-Killing Owl\nSpecies: Ghoul\nGender:Male\nnWard: 20th Ward\nRC Type: Ukaku\nRating:SSS"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
 
});

}
if(command === "tg!eto" ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Eto Yoshimura",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/1/18/Eto_short_hair.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Eto_Yoshimura",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:Aogiri Tree - Founder/Leader",
       value: "Name:Eto Yoshimura Sen Takatsuki\nJapanese name:芳村 エト, 高槻 泉\nAlias: 	X, One-Eyed Owl, Taxidermied Owl\nSpecies: 	One-eyed ghoul\nGender:Female\nnWard: 24th Ward (Formerly) 23rd Ward (Imprisoned, Formerly)\nRC Type: Ukaku\nRating:SSS( as Owl),S( as Eto)"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!noro" ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Eto Yoshimura",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/4/49/Noro_in_re.jpg/"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Noroi",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:Aogiri Tree ",
       value: "Name:Noro\nJapanese name:ノロ\nSpecies: 	 Ghoul\nGender:Male\nWard: 24th Ward\nRC Type: Bikaku\nRating:SS~"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!tatara" ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Tatara",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/6/62/Tatara_re.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Tatara",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:Aogiri Tree,Chi She Lian (Formerly) ",
       value: "Name:Tatara\nJapanese name:	タタラ\nSpecies: 	 Ghoul\nGender:Male\nRC Type: Unknown\nRating:SS~"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!yamori" ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Yakumo Oomori",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/d/d2/Yamori_re.png/"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Yakumo_Oomori",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:Aogiri Tree - Executive White Suits - Founding Leader ",
       value: "Name:Yakumo Oomori\nJapanese name:	大守 八雲 （おおもり やくも）\nAlias:Yamori,Jason\nSpecies: 	 Ghoul\nGender:Male\nWard:13 Ward\nRC Type: Rinkaku\nRating:S"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!naki" ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Naki",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/f/f5/Naki_TGre2.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Naki",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:Aogiri Tree - Executive (Formerly), White Suits - Leader Goat",
       value: "Name:Naki\nJapanese name:	ナキ\nSpecies: 	 Ghoul\nGender:Male\nWard:23rd Ward (Imprisoned, Formerly) 13th Ward (Formerly) 24th Ward (Currently)\nRC Type: Koukaku\nRating:S"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!tsukiyama" ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Shuu Tsukiyama",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/4/4f/Shuu_Tsukiyama_re_volume_4_cover.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Shuu_Tsukiyama",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:Tsukiyama family - Family Head Seinan Gakuin University (Formerly) Ghoul Restaurant (Defected) Kaneki's group (Formerly) :re - Associates (Formerly) Goat",
       value: "Name:Shuu Tsukiyama\nJapanese name:	月山 習 （つきやま しゅう）\nSpecies: 	 Ghoul\nGender:Male\n Alias: Gourmet,MM\nWard: 21st Ward (Formerly) 20th Ward (Formerly) 24th Ward (Currently)\nRC Type: Koukaku\nRating:S"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!hinami" ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Hinami Fueguchi",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/4/4c/Hinami_checks_up_on_Banjou.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Hinami_Fueguchi",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:Kaneki's group (Formerly) Aogiri Tree (Formerly) :re - Associates (Formerly) Goat",
       value: "Name:Hinami Fueguchi\nJapanese name:	笛口 雛実 （ふえぐち ひなみ）\nSpecies: 	 Ghoul\nGender:Female\n Alias: Daughter Ghoul, Number 745, Yotsume\nWard: 20th Ward (Formerly) 6th Ward (Formerly) 23rd Ward (Imprisoned, Formerly) 24th Ward (Currently)\nRC Type: Koukaku,Rinkaku\nRating:SS"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!takizawa" ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Seidou Takizawa",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/f/fa/Takizawabrains.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Seidou_Takizawa",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG (Formerly) Aogiri Tree (Defected) Goat (Formerly)",
       value: "Name:Seidou Takizawa\nJapanese name:滝澤 政道 （たきざわ せいどう）\nSpecies: 	Artificial One-eyed ghoul, Human (Formerly)\nGender:Male\n Alias:Owl,T-OWL \nWard: 20th Ward (Formerly) \nRC Type: Ukaku\nRank:Rank 2\nRating:SS"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!akira" ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Akira Mado",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/3/33/Akira_promotion_ceremony.png/"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Akira_Mado",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG (Defected) Mado Squad (Defected)",
       value: "Name:Akira Mado\nJapanese name:真戸 暁 （まど アキラ）\nSpecies:Human \nGender:Female\n Alias:Spine User \nWard: 20th Ward (Formerly) 1st Ward (Formerly) \n Rank: Rank 2 (Tokyo Ghoul) Rank 1 (Tokyo Ghoul Epilogue) First Class (until :re Ch. 32) Associate Special Class (after :re Ch. 32)\nQuinque:Amatsu (Koukaku/Bikaku) Fueguchi One (Rinkaku) Fueguchi Two (Koukaku)"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!shinohara" ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Yukinori Shinohara",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/4/4d/Shinohara_1.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Yukinori_Shinohara",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG  ",
       value: "Name:Yukinori Shinohara\nJapanese name:	篠原 幸紀 （しのはら ゆきのり）\nSpecies: Human  \nGender:Male\n Alias:The Invulnerable Shinohara \nWard: 1st Ward (Currently) 20th ward (Formerly)\n Rank:  Special Class \nQuinque:Demon Yamada 1 (Bikaku, Rate S) Arata series: Arata proto, Arata β 0.8, Arata (Koukaku)\n"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!amon" ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Amon Koutarou",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/0/0c/Amon_Holding_Maris_Stella.png/"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Amon_Koutarou",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG (Defected) ",
       value: "Name:Amon Koutarou\nJapanese name:亜門 鋼太朗 （あもん こうたろう）\nSpecies:Artificial One-eyed ghoul Human (Formerly) \nGender:Male\n Alias:Floppy, Robed Giant, A-OWL \nWard: 20th Ward (Formerly) 1st Ward (Formerly)\n Rank: Rank 1 (until Ch. 80) First Class (after Ch. 80) Special Class (Posthumous, after Ch. 143)\nQuinque:Doujima 1/2 (Koukaku/Bikaku) Kura (Koukaku) Arata proto • II (Koukaku)\nRC Type:Ukaku"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!juuzu" || command === "tg!suzuya" ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Juuzo Suzuya",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/1/13/Juuzou_profile.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Juuzo_Suzuya",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:Ghoul Restaurant (Defected) CCG Suzuya Squad - Squad Leader S3 Squad - Squad Leader ",
       value: "Name:Juuzu Suzuya\nJapanese name:鈴屋 什造 （すずや じゅうぞう）\nSpecies: Human  \nGender:Male\n Alias:Rei Suzuya CCG's Jason The Next Arima The Reaper \nWard: 20th Ward (Formerly) 1st Ward (Formerly)\n Rank: Rank 3 (debut), Rank 2 (after Ch. 80), First Class (Joker), Associate Special Class (Tokyo Ghoul:re) ,Special Class (after :re Ch. 32)\nQuinque:Scorpion 1/56 (Bikaku, Rate B)[4] 13's Jason (Rinkaku, Rate S+)[4] Arata Joker (Koukaku)"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!hanbee" || command === "tg!abara" ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Hanbee Abara",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/c/c7/Hanbee14.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Hanbee_Abara",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG ,Suzuya Squad, S3 Squad",
       value: "Name:Hanbee Abara\nJapanese name:	阿原 半兵衛 （あばら はんべえ）\nSpecies: Human  \nGender:Male\n \nWard: 13th Ward \n Rank:  Rank 2 (until :re Ch. 32) Rank 1 (after :re Ch. 32)\nQuinque :Silver Skull (Ukaku, Rate A)[1] Arata Ⅱ (Koukaku)"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!saiko"  ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Saiko Yonebayashi",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/4/46/Saikopromise.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Saiko_Yonebayashi",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG, Mado Squad (Formerly), Quinx Squad - Deputy Squad Leader, S2 Squad",
       value: "Name:Saiko Yonebayashi\nJapanese name:	米林 才子 (よねばやし さいこ)\nSpecies: Quinx Human (Formerly)  \nGender:Female\n \nWard: 1'st Ward \n Rank:  Rank 3 (until :re Ch. 32) Rank 2 (after :re Ch. 32)\nRC Type:Rinkaku"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!shirazu"  ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Ginshi Shirazu",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/1/11/Shirazu_bald.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Ginshi_Shirazu",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG, Mado Squad, Quinx Squad - Leader",
       value: "Name:Ginshi Shirazu\nJapanese name:	不知 吟士\nSpecies: Quinx Human (Formerly)  \nGender:Male\nWard: 1'st Ward \n Rank:  Rank 3 (until :re Ch. 32) Rank 2 (after :re Ch. 32)\nRC Type:Ukaku"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!urie"  ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Kuki Urie",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/2/28/Kuki_Urie_as_Qs_squad_leader.jpeg"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Kuki_Urie",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG, Quinx Squad - Mentor / Squad Leader ,Mado Squad (Formerly), S2 Squad - Leader (after :re Ch. 117)",
       value: "Name:Kuki Urie\nJapanese name:	瓜江 久生 （うりえ くき）\nSpecies: Quinx Human (Formerly)  \nGender:Male\nWard: 1'st Ward \n Rank:  Rank 2 (until :re Ch. 32) Rank 1 (after :re Ch. 32) First Class (after :re Ch. 117)\nRC Type:Koukaku\nQuinque:Ginkui (Bikaku, Rate SS)Tsunagi <plain> (Bikaku, Rate C)"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!mutsuki"  ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Tooru Mutsuki",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/d/dd/Mutsuki_orders_Oggai_to_eliminate_all_ghouls.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Tooru_Mutsuki",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG (Defected) Mado Squad (Formerly) Quinx Squad (Formerly) Hachikawa Squad (Formerly) S3 Squad (Formerly) Suzuya Squad (Formerly) Oggai Squads - Mentor (Formerly)",
       value: "Name:Tooru Mutsuki\nJapanese name:		六月 透 （むつき とおる）\nSpecies: Quinx Human (Formerly)\nAlias: Eyepatch  \nGender:Female\nWard: 1'st Ward \n Rank:  Rank 3 (until :re Ch. 32) Rank 1 (after :re Ch. 32) \nRC Type:Bikaku\nQuinque:Ifraft (Rinkaku, Rate B) Abksol (Rinkaku, Rate B) Black Linshing Nut 16/16 (Koukaku, Rate B+) White Loosting Nut 16/16 (Koukaku, Rate B+)"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!aura"  ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Shinsanpei Aura",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/e/e4/Shinsanpei_murder_intention_of_killing_Kaneki.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Shinsanpei_Aura",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG, Mado Squad (Formerly), Quinx Squad (Formerly), S2 Squad, Suzuya Squad (Formerly), S3 Squad (Formerly)",
       value: "Name:Shinsanpei Aura\nJapanese name:		安浦 晋三平 （あうら しんさんぺい\nSpecies: Quinx Human (Formerly)  \nGender:Male\nWard: 1'st Ward \n Rank:  Rank 2\nRC Type:Ukaku\nQuinque:Tsunagi <hard> (Bikaku, Rate C"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!hsiao"  ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Ching-Li Hsiao",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/5/50/Ching-Li_scolding_Aura.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Ching-Li_Hsiao",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG, Mado Squad (Formerly), Quinx Squad, S2 Squad",
       value: "Name:Ching-Li Hsiao Genie Hsiao\nJapanese name:	小 静麗 （シャオ・ジンリー） ジーニーシャオ\nSpecies: Quinx,Half Human (Formerly)  \nGender:Female\nWard: 1'st Ward \n Rank:  Rank 1\nRC Type:Koukaku\nQuinque:Kuai 1/4 (Rinkaku, Rate A)"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!higemaru"  ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Touma Higemaru",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/f/f1/Higemaru_intro.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Touma_Higemaru",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG, Mado Squad (Formerly), Quinx Squad, S2 Squad",
       value: "Name:Touma Higemaru\nJapanese name:		髯丸 トウマ （ひげまる トウマ）\nSpecies: Quinx, Human (Formerly)  \nGender:Male\nWard: 1'st Ward \n Rank:  Rank 3\nRC Type:Bikaku\nQuinque:Hige Onimaru (Bikaku, Rate A)"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!matsuri"  ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Matsuri Washuu",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/0/0e/Matsuri.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Matsuri_Washuu",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG,Washuu Clan (Formerly), S2 Squad - Leader (Formerly), V (Formerly)",
       value: "Name:Matsuri Washuu\nJapanese name:			和修 政 （わしゅう まつり）\nSpecies: Ghoul \nGender:Male \n Rank:  Associate Special Class (until :re Ch. 32) Special Class (after :re Ch. 32)"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!yoshitoki"  ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Yoshitoki Washuu",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/2/24/Yoshitoki_Washuu.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Yoshitoki_Washuu",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG,Washuu Clan, V",
       value: "Name:Matsuri Washuu\nJapanese name:		和修 吉時 （わしゅう よしとき）\nSpecies: Ghoul \nGender:Male \n Ward:1st Ward"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!tsuneyoshi"  ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: "Tsuneyoshi Washuu",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/4/4c/Tsuneyoshi_Washuu.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Tsuneyoshi_Washuu",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG,Washuu Clan, V",
       value: "Name:Tsuneyoshi Washuu\nJapanese name:		和修 吉時 （わしゅう よしとき）\nAlias:Demon Tsune\nSpecies: Ghoul \nGender:Male \n Ward:1st Ward"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!furuta"  ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: " Furuta Washuu",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/0/02/Furuta_Nimura_Vol_6.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Kichimura_Washuu",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG (Resigned), Washuu Clan, V ,Sunlit Garden, Akihiro Kanou (Formerly) Clowns, Ghoul Restaurant (Formerly)",
       value: "Name:Kichimura Washuu ,Nimura Furuta\nJapanese name:	和修 吉福 和修旧多 宗太\nAlias:Souta, PG, Washuu King\nSpecies: Artificial One-eyed ghoul, Half-human (Formerly) \nGender:Male \n Ward:1st Ward\nRank:Bureau Director (Formerly)[8] Rank 1 (until Ch. 117)\nRC Type:Rinkaku\nQuinque:Tsunagi <custom> (Bikaku, Rate C) Rotten Follow (Rinkaku, Rate S)"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
if(command === "tg!furuta"  ){
  if(!message.member.roles.some(r=>["Manga Reader"].includes(r.name)) )
    return message.reply("Sorry, you are not a manga reader")


  return message.channel.send({embed: {
   color: 3447003,
   author: {
     name: client.user.username,
     icon_url: client.user.avatarURL
   },
   title: " Furuta Washuu",
   thumbnail: {
     "url": "https://vignette.wikia.nocookie.net/tokyoghoul/images/0/02/Furuta_Nimura_Vol_6.png"
   },
   url: "http://tokyoghoul.wikia.com/wiki/Kichimura_Washuu",
   description: "Here are the details you requested",
   fields: [{
       name: "Affilation:CCG (Resigned), Washuu Clan, V ,Sunlit Garden, Akihiro Kanou (Formerly) Clowns, Ghoul Restaurant (Formerly)",
       value: "Name:Kichimura Washuu ,Nimura Furuta\nJapanese name:	和修 吉福 和修旧多 宗太\nAlias:Souta, PG, Washuu King\nSpecies: Artificial One-eyed ghoul, Half-human (Formerly) \nGender:Male \n Ward:1st Ward\nRank:Bureau Director (Formerly)[8] Rank 1 (until Ch. 117)\nRC Type:Rinkaku\nQuinque:Tsunagi <custom> (Bikaku, Rate C) Rotten Follow (Rinkaku, Rate S)"
     }
     
   ],
   timestamp: new Date(),
   footer: {
     icon_url: client.user.avatarURL,
     text: "© TG Fan"
   }
 }
});
}
  if(message.content === "despacito"){
    message.delete();
  }
  if(command === "cat"){
    request.get('http://thecatapi.com/api/images/get?format=src&type=png', {

}, function(error, response, body) {
	if(!error && response.statusCode == 200) {
		message.channel.send(response.request.uri.href);
	} else {
		console.log(error);
	}
})
  }
  if(message.content === "addrole Manga Reader"){
    let role = message.guild.roles.find("name", "Manga Reader");
let member = message.member;

// Add the role!
member.addRole(role).catch(console.error);

// Remove a role!
member.removeRole(role).catch(console.error);
  }

});

client.login(config.token);
