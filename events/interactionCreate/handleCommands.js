const { EmbedBuilder } = require("discord.js");
const devs = ["531479392128598027", "724477870386315376"];
const getLocalCommands = require("../../utils/getLocalCommands");
const staffDB = require("../../schemas/staffMember");

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();
    const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

    if (!commandObject) return;

    if (commandObject.devOnly && !devs.includes(interaction.member.id)) {
        return interaction.reply("Only the devs are able to use this command.");
    }

    if (commandObject.permissionsRequired?.every((permission) => !interaction.member.permissions.has(permission))) {
        return interaction.reply("You do not have permission to run that command!");
    }

    if (commandObject.highRankOnly) {
        const data = await staffDB.findOne({ userid: interaction.user.id });
        if (!data?.hasRankPerms) {
            return interaction.reply("Only high ranks are able to use this command!");
        }
    }

    try {
        await commandObject.run(client, interaction);
    } catch (error) {
        console.log(error)
        if(interaction.replied || interaction.deferred) {
            interaction.followUp(`There was an error while running this command. An error report has been sent to the log channel.`);
        } else interaction.reply(`There was an error while running this command. An error report has been sent to the log channel.`);
        
    }
};
