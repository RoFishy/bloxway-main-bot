require("dotenv").config()
const { ApplicationCommandOptionType } = require("discord.js")
const noblox = require("noblox.js")
const group = process.env.GROUP
const checkAllowance = require("../../utils/checkAllowance")
const getRobloxUser = require("../../utils/getRobloxUser")
const sendLog = require("../../utils/sendLog")
const getUserAvatar = require("../../utils/getUserAvatar")

module.exports = {
   name: "fire",
   description: "fires a user in the group",
   highRankOnly: true,
   options: [
    {
        name: "username",
        description: "the user to fire",
        type: ApplicationCommandOptionType.String,
        required: true
    },
    {
        name: "reason",
        description: "the reason why the user is being fired",
        type: ApplicationCommandOptionType.String,
        required: false
    }
   ],

   run: async(client, interaction) => {

    await interaction.deferReply()


        const runnerid = interaction.member.id
        const username = interaction.options.getString("username")
        
        const runnerUser = await getRobloxUser(runnerid)


        const userId = await noblox.getIdFromUsername(username)
        if(userId == null) {
            return interaction.editReply("The specified username does not exist")
        }
        let currentRank = await noblox.getRankNameInGroup(group, userId)
        if(currentRank == "Hungry Customer") return interaction.editReply("That user is a customer, they cannot be fired.")

        const runnerID = await noblox.getIdFromUsername(runnerUser)


        const isMember = await noblox.getRankInGroup(group, userId)
        

            if(isMember == 0) {
                return interaction.editReply({
                    content: "The specified roblox user is not in the group.",
                })
            }


            if(!await checkAllowance(runnerID, userId)) return interaction.editReply({
                content: "Unauthorized rank change: the user you are trying to fire has a role that is equal to or above your own.",
             })
       
             if((currentRank == "🥪Development Team") || (currentRank == "Developer") || (currentRank == "🥪Ownership Team") || (currentRank == "Chairwoman") || (currentRank == "Chairman")) return interaction.editReply("Their rank is the same as or above mine, I can't do that")

         try {
            await noblox.setRank(group, userId, "Hungry Customer")
         interaction.editReply(`Succesfully fired ${username}!`)


        
        } catch(error) {
            interaction.editReply({
                content: "An error occured, if the issue persists please contact the developer.",
              })
              return console.log(error)
             }

         const embedimage = await getUserAvatar(userId)

         let reason = interaction.options.getString("reason")
         if(!reason) reason = "No reason given"


            sendLog(
                client,
                "User fired",
                "Someone was fired from the staff team",
                [
                    {name: "Username", value: username},
                    {name: "Reason", value: reason},
                    {name: "Responsible user", value: runnerUser}
                ],
                "Red",
                embedimage
            )
    }
}