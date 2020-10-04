require('dotenv').config()
const Discord = require('discord.js');
const redis = require('redis');
const redisClient = redis.createClient(URL=process.env.REDIS_URL)
const prefix = process.env.PREFIX

redisClient.on('error', function(error) {
  console.log('redis error: ', error);
});

/**
 * Handle all messages posted
 * @param {Discord.Message} message
 */
const handleMessage = (message, redisClient) => {
  // special cases
  if (message.content.toLowerCase().includes('uwu') && !message.author.bot) message.channel.send('Woop Woop UWU!!')
  
  const botWasMentioned = message.mentions.users.some(user => user.id === discordClient.user.id);
  if (botWasMentioned) {
    message.react('😀')
  }
  
  // only work with prefix commands
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // handle different commands
  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  switch(command) {
    case 'create-role':
      createRole(message, args);
      break;
    case 'message':
      sampleMessage(message, args);
      break;
    case 'add-key':
      addKey(message, args);
      break;
    case 'get-key':
      getKey(message, args);
      break;
    case 'get-all-keys':
      getAllKeys(message);
      break;
    default:
      message.channel.send(`Unrecognized command '${command}'`);
  }
}

/**
 * Creating a role
 * @param {Discord.Message} message
 * @param {string[]} args
 */
const createRole = (message, args) => {
  const name = args.join(' ');
  const permissions = ['MANAGE_MESSAGES', 'KICK_MEMBERS'];

  if (args.length > 0) {
    message.guild.roles.create({ data: { name, permissions } })
      .then((role) => {
        message.channel.send(`Successfully created a role with id: ${role.id}`)
        message.member.roles.add(role)
      });

  } else {
    message.channel.send('You must pass in a name for the role');
  }
};

/**
 * Sending a sample message and reacting
 * @param {Discord.Message} message
 * @param {string[]} args
 */
const sampleMessage = (message, args) => {
  message.channel.send('React to this message to register for the tournament!')
    .then((res) => {
      res.react('✅');
      res.react('❌');
      res.react('📛');
    });
};

/**
 * Add a simple redis key
 * @param {Discord.Message} message
 * @param {string[]} args
 */
const addKey = (message, args) => {
  if (args.length === 2) {
    redisClient.set(args[0], args[1], redis.print);
  } else {
    message.channel.send('Please pass exactly 2 args in');
  }
};

/**
 * Return the value associated with a key
 * @param {Discord.Message} message
 * @param {string[]} args
 */
const getKey = (message, args) => {
  if (args.length === 1) {
    redisClient.get(args[0], (err, val) => {
      if (err) console.log('get single key error: ', err);
      
      if (val) {
        message.channel.send(`${args[0]}: ${val}`);
      } else {
        message.channel.send(`'${args[0]}' not found`);
      }
    })
  } else {
    message.channel.send('You must pass exactly 1 argument in');
  }
};

/**
 * returns 
 * @param {Discord.Message} message
 * @param {string[]} args
 */
const getAllKeys = (message, args) => {
  redisClient.keys('*', (err, keys) => {
    if (err) console.log('getAllKeys error: ', err);
    
    const allKeys = [];

    keys.forEach(k => allKeys.push(k));
    
    message.channel.send(allKeys.join(', '));
  });
};

module.exports = {
  handleMessage,
};
