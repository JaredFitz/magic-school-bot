require('dotenv').config()
const Discord = require('discord.js');
const redis = require('redis');

// clients
const discordClient = new Discord.Client();
const redisClient = redis.createClient(URL=process.env.REDIS_URL)
redisClient.on('error', function(error) {
  console.log('redis error: ', error);
});

const prefix = '!';

discordClient.once('ready', () => {
	console.log('Ready!');
});

discordClient.on('message', message => {
  try {
    if (message.content.toLowerCase().includes('uwu') && !message.author.bot) message.channel.send('Woop Woop UWU!!')
    if (!message.content.startsWith(prefix) || message.author.bot) return;
  
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    
    if (command === 'create-role') {
      // create a role
      const roleName = args.join(' ');
      if (args.length > 0) {
        message.guild.roles.create({ data: { name: roleName, permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS'] } })
          .then((role) => {
            message.channel.send(`Successfully created a role with id: ${role.id}`)
            message.member.roles.add(role)
            message.aut
          });

      } else {
        message.channel.send('You must pass in a name for the role');
      }
    } else if (command === 'message') {
      message.channel.send('React to this message to register for the tournament!')
        .then((res) => {
          res.react('✅')
          res.react('❌')
        })
    } else if (command === 'add-key') {
      if (args.length >= 2) {
        redisClient.set(args[0], args[1], redis.print)
        message.channel.send('Setting key')
      } else {
        message.channel.send('Please pass at least 2 args in')
      }
    } else if (command === 'get-key') {
      if (args.length === 1) {
        redisClient.get(args[0], (err, val) => {
          if (err) console.log('get single key error: ', err);
          
          if (val) {
            message.channel.send(`${args[0]}: ${val}`)
          } else {
            message.channel.send(`'${args[0]}' not found`)
          }
        })
      } else {
        message.channel.send('You must pass you key in')
      }
    } else if (command === 'get-all-keys') {
      redisClient.keys('*', (err, keys) => {
        if (err) console.log('get all keys error: ', err)
        
        const allKeys = [];

        keys.forEach(k => allKeys.push(k))
        
        message.channel.send(allKeys.toString())
      })
    } else if (command === 'test-json') {
      redisClient.set('testJSON', JSON.stringify({first: 1, second: '2nd', third: {fourth: ['a', 'b', 3]}}))
    } else {
      message.channel.send(`Unrecognized command '${command}'`)
    }
    
    const botWasMentioned = message.mentions.users.some(user => user.id === discordClient.user.id);
    if (botWasMentioned) {
      message.react('😀')
    }
  } catch(err) {
    console.log(err)
    message.channel.send('Something went wrong with that command');
  }
})

// !role 

discordClient.login(process.env.BOT_TOKEN);