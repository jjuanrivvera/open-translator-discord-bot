const { MessageEmbed } = require("discord.js");
const { languages } = require('translation-google');
const { 
    ImageToText,
    LibreTranslate,
    GoogleTranslate
} = require("../helpers");

module.exports = {
    name: "image",
    description: "Image translation",
    cooldown: 10,
    usage: "image <language> [link|attachment]",
    requireArgs: 1,
    example: "image en https://image.example.com",
    async execute(message, args, client, guildModel) {
    
        const image = message.attachments.first();
        const recognize = image ? image.attachment : args[1];

        if (!recognize) {
            return message.channel
                .send("Cannot find an image")
                .then((msg) => msg.delete({ timeout: 3000 }));
        }

        message.channel.startTyping();

        try {
            let textToTranslate = "";

            try {
                textToTranslate = await ImageToText.extractImageTextLambda(recognize);
            } catch (error) {
                textToTranslate = await ImageToText.extractImageText(recognize);
            }

            message.channel.stopTyping();
            
            let translatedText = null;
            const from = "auto";
            const to = args[0];

            const embed = new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL());

            try {
                if (guildModel.provider === "google") {
                    const translation = await GoogleTranslate.translate(textToTranslate, from, to);
                    translatedText = translation.text;
                    embed.setFooter(`${languages[translation.from.language.iso.toLowerCase()]} (${translation.from.language.iso}) -> ${languages[to]} (${to})`);
                } else {
                    translatedText = await LibreTranslate.translate(
                        textToTranslate,
                        from,
                        to
                    );
                }

                translatedText = translatedText.replace(/<@! /g, `<@!`);
                translatedText = translatedText.replace(/<@ /g, `<@`);
                translatedText = translatedText.replace(/<@ & /g, `<@&`);

                embed.setDescription(translatedText + `\n[Jump to message](${message.url})`);

                return message.channel.send(embed);
            } catch (error) {
                console.log(error);
                return message.channel
                    .send("Language not supported")
                    .then((msg) => msg.delete({ timeout: 3000 }));
            }
        } catch (error) {
            console.log(error);
            message.channel.stopTyping();
            return message.channel
                    .send(`Cannot extract image text: ${error.response.data.message}`);
        }
    },
};
