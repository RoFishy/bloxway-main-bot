const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'sendreactionroles',
    description: 'Send the reaction roles message',
    permissionsRequired: [PermissionsBitField.Flags.Administrator],


    run: async(client, interaction) => {

        const rrEmbed = new EmbedBuilder()
        .setTitle("Self Roles")
        .setDescription("Press the buttons below to get your self roles! You may press again to remove the role.")


        const rrButtons1 = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId("announcements").setLabel("Announcements").setStyle(ButtonStyle.Primary).setEmoji("📢"),
            new ButtonBuilder().setCustomId("affiliate").setLabel("Affiliates").setStyle(ButtonStyle.Danger).setEmoji("🤝"),
            new ButtonBuilder().setCustomId("giveaway").setLabel("Giveaways").setStyle(ButtonStyle.Primary).setEmoji("🥳"),
            new ButtonBuilder().setCustomId("sessions").setLabel("Sessions").setStyle(ButtonStyle.Secondary).setEmoji("📲")
        )

        const rrButtons2 = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId("qotd").setLabel("QOTD").setStyle(ButtonStyle.Success).setEmoji("🤔"),
            new ButtonBuilder().setCustomId("deadchat").setLabel("Dead Chat").setStyle(ButtonStyle.Secondary).setEmoji("💀"),
            new ButtonBuilder().setCustomId("events").setLabel("Events").setStyle(ButtonStyle.Success).setEmoji("🎮"),
        )

        const rrChannel = interaction.guild.channels.cache.get("1226309237043363870")

        await rrChannel.send({ embeds: [rrEmbed], components: [rrButtons1, rrButtons2] })

        await interaction.reply({ content: "Reaction roles sent!", ephemeral: true })
    }
}