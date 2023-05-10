import { config } from "dotenv";
config();
import {
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  Message,
  Partials,
} from "discord.js";
import axios from "axios";
import { prefix } from "./config.json";
const { Guilds, GuildMessages, DirectMessages, MessageContent } =
  GatewayIntentBits;
const { Channel, User, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMessages, DirectMessages, MessageContent],
  partials: [Channel, User, GuildMember, ThreadMember],
});
const {NIKE_URL}: any = process.env

client.on("ready", () => {
  console.log(`Logged in as!`);
});

client.on("messageCreate", async (msg: Message) => {
   
  if (msg.content.startsWith(`${prefix}ping`)) {
    const nikeResponse = await axios.get( NIKE_URL);
    let i = 0
    const nikeData = nikeResponse.data.objects.filter(
      (product: { productInfo: string | any[] }) =>{
        console.log(product.productInfo.length)
        i += product.productInfo.length
        console.log(i)
        return product.productInfo.length !== 1
    });


    // const [valor1, valor2] = texto.match(/\d+/g);

    console.log(nikeData[0].productInfo)
    // console.log(nikeData[producto].productInfo[0].skus.length)

    // console.log(nikeData[producto].productInfo[0].availableGtins)

    // console.log(nikeData[producto].productInfo[0].availableGtins.length)
    // console.log(nikeData[producto].productInfo[0].launchView.method)

    // let num = valor1 - .5

    // console.log(nikeData[0].publishedContent.nodes[0].properties.jsonBody.content[0].content[0].text)
    // console.log(nikeData[0].productInfo[0].skus.length)
    // console.log(nikeData[0].productInfo[0].skus[9])

    const familia = 0;
    // console.log(nikeData[10])
    // console.log(nikeData[10].productInfo[familia].availableGtins)
    // console.log(nikeData[10].productInfo[familia])

    for (let index = 0; index < nikeData.length; index++) {
    //   if (index == 9)
    //     nikeData[index].productInfo[familia]?.skus.map((e: any) =>
    //       console.log(e?.countrySpecifications[0]?.localizedSize)
    //     );

      const texto =
        nikeData[index].publishedContent.nodes[0].properties.jsonBody.content[0]
          .content[0].text;
      const quantity = nikeData[index].productInfo[familia].availableGtins.filter(
        (n: { level: string }) => n.level !== "OOS"
      );

      const tallasObj = quantity.map(
        (
          talla: {
            level: any;
          },
          i: string | number
        ) => {
          const disponibilidad = {
            name:
              nikeData[index].productInfo[familia]?.skus[i]
                ?.countrySpecifications[0]?.localizedSize !== undefined
                ? nikeData[index].productInfo[familia].skus[i]
                    .countrySpecifications[0].localizedSize
                : "empty",
            value: talla.level,
            inline: true,
          };
          return disponibilidad;
        }
      );

      let embed = new EmbedBuilder()
        .setTitle(nikeData[index].publishedContent.nodes[0].properties.title)
        .setThumbnail(
          nikeData[index].publishedContent.nodes[0].nodes[0].properties
            .squarishURL
        )
        // .setImage(nikeData[0].publishedContent.nodes[0].nodes[0].properties.squarishURL)
        .setDescription(texto)

        // .setURL('https://api.nike.com/product_feed/threads/v3/?anchor=0&count=50&filter=marketplace%28MX%29&filter=language%28es-419%29&filter=upcoming%28true%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&sort=effectiveStartSellDateAsc')
        .setAuthor({
          name: "DisponiBot",
          iconURL:
            "https://png.pngitem.com/pimgs/s/157-1570213_kool-aid-man-kool-aid-man-png-transparent.png",
        })
        // .setDescription(nikeData[0].publishedContent.properties.seo.description)
        .addFields([
          // { name: 'Regular field title', value: 'Some value here' },
          { name: "\u200B", value: "\u200B" },
        ])
        .addFields(tallasObj)
        .setColor("Blurple");

      const channel: any = client.channels.cache.find(
        (channel: any) => channel.name === "new"
      );
      await channel.send({
        embeds: [embed],
      });
    }
  }
});

client.login(process.env.TOKEN);
