const { EmbedBuilder } = require("discord.js")
module.exports = (client, guildMember) => {
    if(guildMember.user.bot) return;
    const welcomeChan = guildMember.guild.channels.cache.get("1233966160098361375")

    const welcomeEmbed = new EmbedBuilder()
    .setTitle("Welcome!")
    .setDescription(`Hey ${guildMember.user.username}! Welcome to the Bloxway server! Before you send your first message please read the rules! Enjoy your time in the server.`)
    .setThumbnail(guildMember.guild.iconURL())
    .setColor([0, 255, 255])

    welcomeChan.send({ content: `${guildMember}`, embeds: [welcomeEmbed]})
}