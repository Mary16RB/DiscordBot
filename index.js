
require ('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Cargar metadatos de NFTs
//const metadatos = JSON.parse(fs.readFileSync('metadatos_nft.json', 'utf8')); //leer metadatos de files json
let outputGifPath;
let cont=1521;
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

    outputGifPath = path.join(__dirname, 'output',`${nftID}_combinado.gif`);

    //const nft = metadatos[nftID];

    //if (!nft) {
      //message.channel.send('❌ No se encontró un NFT con ese ID.');
      //return;
    //}

    // Ruta del GIF del NFT
    //const gifPath = path.join(__dirname, 'sprites', nft.gif);

    // Verificar si el archivo existe
    if ((fs.existsSync(outputGifPath))&&(cont>=nftID)) {

      const embed = new EmbedBuilder()
        
        .setTitle(`Piggies`)
        .setDescription(`**NFT ID: #** ${nftID}\n[Mint Site](https://launchpad.heymint.xyz/mint/piggies)\n[View on Marketplase](https://magiceden.io/collections/polygon/0x268Fba721CFD580FE98d96f1b0249f6871D1Fa09)`)
        .setColor(0xc45682)
        .setImage(`attachment://${`${nftID}_combinado.gif`}`);

      await message.channel.send({
        embeds: [embed],
        files: [{ attachment: outputGifPath, name: `${nftID}_combinado.gif` }],

      });
    } else {
      message.channel.send('❌ The NFT is not mint yet.');
    }
  }
});

// Iniciar el bot
client.login(process.env.DISCORD_TOKEN);