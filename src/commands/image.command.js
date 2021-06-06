const { createWorker } = require('tesseract.js');
const { MessageEmbed } = require("discord.js");
const { LibreTranslate, GoogleTranslate } = require("../helpers");

module.exports = {
    name: "image",
    description: "Image translation",
    cooldown: 10,
    usage: "image <language> [link|attatchment]",
    requireArgs: 1,
    example: "image en https://image.example.com",
    async execute(message, args, client, guildModel) {
      try {
        const image = message.attachments.first();
        const recognize = image ? image.attachment : args[1];

        if (!recognize) {
            return message.channel
                .send("Cannot find an image")
                .then((msg) => msg.delete({ timeout: 3000 }));
        }

        const worker = createWorker({
            logger: m => console.log(m)
        });
        
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        const { data: { text } } = await worker.recognize(recognize);

        await worker.terminate();

        const to = args[0];
        const textToTranslate = text;
        const from = "auto";

        let translatedText = null;

        if (guildModel.provider === "google") {
            translatedText = await GoogleTranslate.translate(
                textToTranslate,
                from,
                to
            );
        } else {
            translatedText = await LibreTranslate.translate(
                textToTranslate,
                from,
                to
            );
        }

        translatedText = translatedText.replace(/<@! /g, `<@!`);
        translatedText = translatedText.replace(/<@ & /g, `<@&`);

        const embed = new MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(translatedText);

        await message.channel.send(embed);
      } catch (error) {
          console.log(error);
        await message.channel
            .send("Language not supported")
            .then((msg) => msg.delete({ timeout: 3000 }));
      }
    },
};
