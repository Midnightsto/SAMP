// Load up the discord.js library
const Discord = require("discord.js");
var randomCat = require('random-cat');

const fs = require("fs")
var url = randomCat.get();
var urlWithSize = randomCat.get({
  width: 120,
  height: 600
});
const prefix = ".";
const client = new Discord.Client()
const MusicBot = require('discord-musicbot');
 'use strict';
 
const SpoilerBot = require('discord-spoiler-bot');
 
let config = {
    token: 'NDYxOTc4MDE2NzEzNTM5NjA1.DhbKEg.4LXerR7BmmNQI1cNfxCr1RrGCyw',
};
bot.connect();
const config = {
  // these 3 are always required.
  token: 'NDYxOTc4MDE2NzEzNTM5NjA1.DhbKEg.4LXerR7BmmNQI1cNfxCr1RrGCyw',
  serverId: '465475303284932608',
  textChannelId: '465475303284932610',
 
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
