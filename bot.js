require('dotenv').config()
const Discord = require('discord.js');

const { handleMessage } = require('./src/messages')

// clients
const discordClient = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

discordClient.once('ready', () => {
  console.log('Ready!');
});

discordClient.on('message', message => {
  try {
    handleMessage(message)
  } catch(err) {
    console.log(err)
    message.channel.send('Something went wrong with that command');
  }
})

discordClient.on('')

// !role 

discordClient.login(process.env.BOT_TOKEN);