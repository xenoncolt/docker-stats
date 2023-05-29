const Discord = require('discord.js');
const axios = require('axios');
const dotenv = require('dotenv').config();
const { dockerSockPath, channelId } = require('./config/config.json');

const client = new Discord.Client({ 
  intents: [
      Discord.GatewayIntentBits.Guilds,
      Discord.GatewayIntentBits.GuildMessages
  ] 
});


axios.defaults.socketPath = dockerSockPath;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  updateStats();
  setInterval(updateStats, 3000); // Update stats every 5 minutes (300,000 milliseconds)
});

async function updateStats() {
  try {
    const containerStats = await getContainerStats();
    const message = buildStatsMessage(containerStats);
    const channel = await client.channels.fetch(channelId);
    if (channel) {
      const botMessage = await channel.messages.fetch({ limit: 1 });
      if (botMessage.size > 0) {
        await botMessage.first().edit(message);
      } else {
        await channel.send(message);
      }
    } else {
      console.log(`Could not find a channel with ID ${channelId}`);
    }
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

async function getContainerStats() {
  const url = 'http://localhost/containers/json';
  const response = await axios.get(url);
  const containers = response.data;
  const statsPromises = containers.map(async (container) => {
    const statsUrl = `http://localhost/containers/${container.Id}/stats?stream=false`;
    const statsResponse = await axios.get(statsUrl);
    return { name: container.Names[0], stats: statsResponse.data };
  });
  return Promise.all(statsPromises);
}

function buildStatsMessage(containerStats) {
  let message = 'Docker Container Stats:\n';
  containerStats.forEach((container) => {
    message += `\nContainer: ${container.name}\n`;
    message += `Memory Usage: ${formatMemoryUsage(container.stats.memory_stats.usage)}\n`;
    message += `Network Rx: ${formatNetworkUsage(container.stats.networks.eth0.rx_bytes)}\n`;
    message += `Network Tx: ${formatNetworkUsage(container.stats.networks.eth0.tx_bytes)}\n`;
  });
  return message;
}


function formatMemoryUsage(usage) {
  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;

  if (usage >= gb) {
    return `${(usage / gb).toFixed(2)} GB`;
  } else if (usage >= mb) {
    return `${(usage / mb).toFixed(2)} MB`;
  } else {
    return `${(usage / kb).toFixed(2)} KB`;
  }
}

function formatNetworkUsage(usage) {
  const kbps = 1024;
  const mbps = kbps * 1024;

  if (usage >= mbps) {
    return `${(usage / mbps).toFixed(2)} Mbps`;
  } else {
    return `${(usage / kbps).toFixed(2)} Kbps`;
  }
}


client.login(process.env.TOKEN); // Replace with your Discord bot token
