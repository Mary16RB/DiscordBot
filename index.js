
require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Cargar metadatos de NFTs
const metadatos = JSON.parse(fs.readFileSync('metadatos_nft.json', 'utf8'));

// Crear cliente de Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Evento: El bot está listo
client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

// Evento: Mensajes recibidos
client.on('messageCreate', async (message) => {
  // Ignorar mensajes del bot
  if (message.author.bot) return;

  // Buscar comandos tipo "!piggies<ID>"
  const commandRegex = /^!piggies(\d+)$/;
  const match = message.content.match(commandRegex);

  if (match) {
    const nftID = match[1]; // Extraer ID del NFT
    const nft = metadatos[nftID];

    if (!nft) {
      message.channel.send('❌ No se encontró un NFT con ese ID.');
      return;
    }

    // Ruta del GIF del NFT
    const gifPath = path.join(__dirname, 'sprites', nft.gif);

    // Verificar si el archivo existe
    if (fs.existsSync(gifPath)) {
      const embed = new EmbedBuilder()
        .setTitle(nft.name)
        .setDescription(`**Rareza:** ${nft.rareza}\n**ID:** ${nftID}`)
        .setColor(0x00ff00)
        .setImage(`attachment://${nft.gif}`);

      await message.channel.send({
        embeds: [embed],
        files: [{ attachment: gifPath, name: nft.gif }],
      });
    } else {
      message.channel.send('❌ No se encontró el GIF para este NFT.');
    }
  }
});

// Iniciar el bot
client.login(process.env.DISCORD_TOKEN);