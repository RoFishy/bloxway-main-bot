const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const staffSchema = require('../../schemas/staffMember');

module.exports = {
    name: "viewstrikes", 
    description: "Displays strikes for a user",
    options: [
        {
            name: "user",
            description: "The user to display strikes for",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        await interaction.deferReply();
        
        const roleIdsToCheck = ["1231292650498560131", "1231292648795410494", "1231292645150822481"];
        const user = interaction.options.getUser("user");
        const userId = user.id;

        const isHr = interaction.member.roles.cache.some(role => roleIdsToCheck.includes(role.id));

        if (!isHr && interaction.user.id !== userId) {
            return interaction.editReply("Only SHR+ or the user themselves can use this command");
        }

        const staffMember = await staffSchema.findOne({ userid: userId });
        if(!staffMember) return interaction.editReply("That user is not a staff member.")
        
        if (staffMember.strikes.length == 0) {
            return interaction.editReply("No strikes found for that user.");
        }

        const strikeEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`${user.username}'s strikes`)
            .setDescription(
                staffMember.strikes
                    .map((strike, index) => `\`${index + 1}\` - ID: ${strike.strikeId}\nReason: ${strike.reason}`)
                    .join("\n\n")
            )
            .setFooter({ text: `Total strikes: ${staffMember.strikes.length}` })
            .setThumbnail(user.displayAvatarURL());

        interaction.editReply({ embeds: [strikeEmbed] });
    },
};
