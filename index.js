const Discord = require('discord.js');
const fs = require('fs');
const { Docker } = require('docker-cli-js');
const dotenv = require('dotenv').config();
const { dockerSockPath, channelId } = require('./config/config.json');

const client = new Discord.Client({ 
  intents: [
      Discord.GatewayIntentBits.Guilds,
      Discord.GatewayIntentBits.GuildMessages
  ] 
});

const docker = new Docker({ socketpath: dockerSockPath });


// fetch all stats from docker
async function getDockerStats() {
  const getStats = await docker.command('stats --no-stream --format "{{.Container}}|{{.Name}}|{{.CPUPerc}}|{{.MemUsage}}|{{.NetIO}}|{{.BlockIO}}|{{.PIDs}}"');
  const statsArray = getStats.raw.split('\n').slice(1, -1);
  const activeStats = statsArray.map((stat) => {
    const [containerId, name, cpu, mem, netIO, blockIO, pids] = stat.trim().split('|');
    return { containerId, name, cpu, mem, netIO, blockIO, pids };
  });

  return activeStats;
}



// Building Embed
function createEmbed(stats) {
  const embed = new Discord.EmbedBuilder()
    .setTitle('Docker Stats')
    .setColor('#00FF00')
    .setDescription('Current Docker container statistics:')
    .addFields(
      { name: `Container ID`, 
        value: `${stats.containerId}`
      },
      {
        name: `Name`,
        value: `${stats.name}`
      },
      {
        name: `Cpu Usage`,
        value: `${stats.cpu}`
      },
      {
        name: `Memory Usage`,
        value: `${stats.mem}`
      },
      {
        name: `Network I/O`,
        value: `${stats.netIO}`
      },
      {
        name: `Disk Read/Write`,
        value: `${stats.blockIO}`
      },
      {
        name: `Number of Processes`,
        value: `${stats.pids}`
      }
    )
    .setTimestamp();

  return embed;
}




// Send docker stats to discord
async function sendDockerStatsToDiscord() {
  try {
    const dockerStats = await getDockerStats();
    const jsonStats = JSON.stringify(dockerStats, null, 2)

    const channel = await client.channels.fetch(channelId);

    // Fetch all bot messages in the channel
    const messages = await channel.messages.fetch();
    const botMessages = messages.filter((msg) => msg.author.bot);


    // If the bot message exist, edit the first message and delete any additional messages
    if (botMessages.size > 0) {
      const firstMessage = botMessages.first();
      const embed = createEmbed(dockerStats[0]);
      await firstMessage.edit({ embeds: [embed.toJSON()] });


      // Delete additional messages
      botMessages.forEach(async (msg) => {
        if (msg.id !== firstMessage.id) {
          await msg.delete();
        }
      });
    } else {
      //If no bot messages exist, Send a new message
      const embed = createEmbed(dockerStats[0]);
      await channel.send({ embeds: [embed.toJSON()] });
    }
    setInterval(async () => {
      const updatedStats = await getDockerStats();
      updatedStats.forEach((stats) => {
        const embed = createEmbed(stats);
        const existingMessage = channel.messages.cache.find((m) =>
          m.embeds.length && m.embeds[0].fields[0]?.value === stats.containerId
        );

        if (existingMessage) {
          existingMessage.edit({ embeds: [embed.toJSON()] });
        } else {
          channel.send({ embeds: [embed.toJSON()] });
        }
      });
    }, 5000);
  } catch (error) {
    console.error('Error fetching Docker stats:', error);
  }
}



// Login to bot and sent message
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  sendDockerStatsToDiscord();
})




client.login(process.env.TOKEN);
