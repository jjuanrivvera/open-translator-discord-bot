const axios = require('axios');

const { OCR_URL } = require('../config');
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

            message.channel.startTyping();

            const response = await axios({
                method: "POST",
                url: OCR_URL,
                data: JSON.stringify({
                    image: recognize
                })
            });

            if (response.data.error) {
                message.channel.stopTyping();
                console.log(data.error);
                return message.channel
                    .send("Cannot extract image text")
                    .then((msg) => msg.delete({ timeout: 3000 }));
            }

            const to = args[0];
            const textToTranslate = response.data.text;
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

            message.channel.stopTyping();

            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(translatedText);

            await message.channel.send(embed);
        } catch (error) {
            console.log(error);
            message.channel.stopTyping();
            await message.channel
                .send("Language not supported")
                .then((msg) => msg.delete({ timeout: 3000 }));
        }
    },
};
