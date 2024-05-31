const { EmbedBuilder } = require("discord.js");

module.exports = (client, title, description, fields, color, thumbnail) => {
    const logsChannel = client.channels.cache.get("1226592926734352475");
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .addFields(fields)
        .setColor(color)
        .setThumbnail(thumbnail);

    logsChannel.send({ embeds: [embed] });
}
