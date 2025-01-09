

require ('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
// Cargar metadatos de NFTs
//const metadatos = JSON.parse(fs.readFileSync('metadatos_nft.json', 'utf8')); //leer metadatos de files json
let outputGifPath;
let secondGifPath;

let cont=1564;

const options = {
  method: 'GET',
  url: 'https://api.opensea.io/api/v2/collection/piggies-4/nfts',
  params: {
    limit: 1
  },
  headers: {
    accept: 'application/json',
    'x-api-key': '7d4c8906f87c4dcbb8114303f0130c9b',
  }
};

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
    secondGifPath = path.join(__dirname, 'piggies',`${nftID}_piggy.gif`);
    //const nft = metadatos[nftID];
    await axios
    .request(options)
    .then((res) => {
      cont= res.data.nfts[0].identifier
      //console.log(res.data);
      console.log(cont);
    })
    .catch((err) => {
      console.error('Error:', err.response?.data || err.message);
    });
    //if (!nft) {
      //message.channel.send('❌ No se encontró un NFT con ese ID.');
      //return;
    //}

    // Ruta del GIF del NFT
    //const gifPath = path.join(__dirname, 'sprites', nft.gif);

    // Verificar si el archivo existe
    if ((fs.existsSync(outputGifPath))&&(cont>=nftID)) {

      const embed1 = new EmbedBuilder()
        
        .setTitle(`Piggies`)
        .setDescription(`**NFT ID: #** ${nftID}\n[Mint Site](https://launchpad.heymint.xyz/mint/piggies)\n[View on Marketplace](https://magiceden.io/collections/polygon/0x268Fba721CFD580FE98d96f1b0249f6871D1Fa09)`)
        .setColor(0xc45682)
        .setImage(`attachment://${nftID}_piggy.gif`);
        
      const embed2 = new EmbedBuilder()
        .setDescription(`Seen in PIXELS`)
        .setColor(0xc45682)
        .setImage(`attachment://${`${nftID}_combinado.gif`}`);
        
        
      await message.channel.send({
        embeds: [embed1, embed2],
        files: [{ attachment: outputGifPath, name: `${nftID}_combinado.gif` },
                { attachment: secondGifPath, name: `${nftID}_piggy.gif` }],

      });
    } else {
      message.channel.send('❌ The NFT is not mint yet.');
    }
  }
});

// Iniciar el bot
client.login(process.env.DISCORD_TOKEN);