const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js")

module.exports = {
    name: "training",
    description: "Announce a training session",
    options: [
        {
            name: "co-host",
            description: "the co-host of the training",
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],

    run: async(client, interaction) => {


        const permRoles = ["1231292653908394168", "1231292650498560131", "1231292648795410494", "1231292645150822481"]
         const hasPerms = interaction.member.roles.cache.some(role => permRoles.includes(role.id))
        
        if(!hasPerms) return interaction.reply({
            content: "Only high ranks can announce trainings!",
            ephemeral: true
        })

        const trainingChannel = interaction.guild.channels.cache.get("1076683229001682954")

        const cohost = interaction.options.getUser("co-host") || "N/A"
        const trainingEmbed = new EmbedBuilder()
        .setTitle("Bloxway Training")
        .setDescription(`A training will be commencing soon, head on down to the training centre for a chance to rank up! \n \n Host: ${interaction.member} \n Co-host: ${cohost} \n \n **Game Link:** https://www.roblox.com/games/14555601476/NEW-Training-Center`)
        .setColor("LuminousVividPink")
        .setImage("https://tr.rbxcdn.com/d2ff2dcfdfd43e6e2670c5dda9a7d353/768/432/Image/Png")
        .setFooter({text: "We hope to see you there!"})

        trainingChannel.send("<@&1089490250524536922>")
        trainingChannel.send({embeds: [trainingEmbed]})

        interaction.reply({
            content: "Succesfully sent training announcement!",
            ephemeral: true
        })
    }
}