require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = '!';

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
  try {
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
      const filter = (reaction, user) => {
        return reaction.emoji.name === '✅' && user.id === message.author.id;
      };

      const collector = message.createReactionCollector(filter, { time: 15000 });
      collector.on('collect', (creaction, user) => {
        message.member.user.send('How can I help you?')
      })
      message.channel.send('React to this message to registure for the tournament')
      message.react('✅').then(() => message.react('❌'))
    }
    // if (message.member) {
    //   message.member.user.send('How can I help you?')
    // } else {
    //   message.author.send(`I'm already here to help you, what's up?`)
    // }
    
    const botWasMentioned = message.mentions.users.some(user => user.id === client.user.id);
    if (botWasMentioned) {
      message.react('😀')
    }
  } catch(err) {
    console.log(err)
    message.channel.send('Something went wrong with that command');
  }
})

// !role 

client.login(process.env.BOT_TOKEN);