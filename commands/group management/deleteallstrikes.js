const staffSchema = require("../../schemas/staffMember");

module.exports = {
    name: "deleteallstrikes",
    description: "deletes all strikes",

    run: async(client, interaction) => {
        await interaction.deferReply();

        const shrRoles = ["1231292648795410494", "1231292645150822481", "1231292650498560131"]

        const isShr = interaction.member.roles.cache.some(role => shrRoles.includes(role.id));

        if(!isShr) return interaction.editReply("Only SHRs can use this command");
        
        await staffSchema.updateMany({}, { strikes: [] });

        await interaction.editReply("All strikes have been deleted.");


    }
}