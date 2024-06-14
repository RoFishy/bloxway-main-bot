module.exports = (client, interaction) => {
    if (!interaction.isButton()) return;

    const { customId, member } = interaction;

    const roles = {
        announcements: "1250881399947268117",
        affiliate: "1250881403948892230",
        giveaway: "1250881411041329163",
        sessions: "1250881413708779541",
        qotd: "1250881416145666068",
        deadchat: "1250881418041757818",
        events: "1250881420637765632"
    };


    if (!Object.keys(roles).includes(customId)) return;

    const role = interaction.guild.roles.cache.get(roles[customId]);
    if (!role) return;

    if (member.roles.cache.has(role.id)) {
        member.roles.remove(role);
        interaction.reply({ content: "Role removed successfully.", ephemeral: true });
    } else {
        member.roles.add(role);
        interaction.reply({ content: "Role added successfully.", ephemeral: true });
    }
};