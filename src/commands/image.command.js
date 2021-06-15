const sentry = require('../config/sentry');

const { MessageEmbed } = require("discord.js");
const { languages } = require('translation-google');
const { 
    ImageToText,
    LibreTranslate,
    GoogleTranslate
} = require("../helpers");
const {
    Logger
} = require("../util");

module.exports = {
    name: "image",
    description: "Image translation",
    cooldown: 10,
    usage: "image <language> [link|attachment]",
    requireArgs: 1,
    example: "image en https://image.example.com",
    accessibility: "everyone",
	clientPermissions: [
		"SEND_MESSAGES",
		"EMBED_LINKS"
	],
    async execute(message, args, _, guildModel) {
    
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
                Logger.log('error', error);
                sentry.captureException(error);
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

                embed.setDescription(translatedText + `\n[Jump to message](${message.url})`);

                return message.channel.send(embed);
            } catch (error) {
                Logger.log('error', error);
                sentry.captureException(error);
                return message.channel
                    .send("Language not supported")
                    .then((msg) => msg.delete({ timeout: 3000 }));
            }
        } catch (error) {
            Logger.log('error', error);
            sentry.captureException(error);
            message.channel.stopTyping();
            return message.channel
                    .send(`Cannot extract image text`);
        }
    }
};
