const { ApplicationCommandOptionType } = require("discord.js");
const noblox = require("noblox.js")
require("dotenv").config()
const group = process.env.GROUP
const extractRankName = require("../../utils/extractRankName")
const checkAllowance = require("../../utils/checkAllowance")
const getRobloxUser = require("../../utils/getRobloxUser")
const sendLog = require("../../utils/sendLog")
const getUserAvatar = require("../../utils/getUserAvatar");


module.exports = {
    name: "promote",
    description: "promotes a user in the group",
    highRankOnly: true,
    options: [
        {
            name: "username",
            description: "the user to promote",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async(client, interaction) => {

        await interaction.deferReply()

        const runnerid = interaction.member.id 
        
                    const runnerUser = await getRobloxUser(runnerid)




        const username = interaction.options.getString("username")




        
            const userId = await noblox.getIdFromUsername(username)
            if(userId == null) {
                return interaction.editReply({
                    content: "The specified username does not exist",
                })
            }
            let currentRank = await noblox.getRankNameInGroup(group, userId)
            


    



        const runnerID = await noblox.getIdFromUsername(runnerUser)


        const isMember = await noblox.getRankInGroup(group, userId)
        

        if(isMember == 0) {
            return interaction.editReply({
                content: "The specified roblox user is not in the group.",
            })
        }


        if(runnerUser == username) return interaction.editReply("if only it was that easy lol")
        
        if(!await checkAllowance(runnerID, userId)) return interaction.editReply({
            content: "Unauthorized rank change: the user you are trying to demote has a role that is equal to or above your own.",
         })
        
        
         if((currentRank == "🥪Development Team") || (currentRank == "Developer") || (currentRank == "🥪Ownership Team") || (currentRank == "Chairwoman") || (currentRank == "Chairman")) return interaction.editReply("Their rank is the same as or above mine, I can't do that")
        
       
        
            try {
               await noblox.promote(group, userId)
               let newRank = await noblox.getRankNameInGroup(group, userId)
               const newRankName = extractRankName(newRank)
            interaction.editReply(`Succesfully promoted ${username} to **${newRankName}**!`)


           
        } catch(error) {
            interaction.editReply({
                content: "An error occured, if the issue persists please contact the developer.",
              })
              return console.log(error)
             }

            let newRank = await noblox.getRankNameInGroup(group, userId)

            const embedimage = await getUserAvatar(userId)


            sendLog(
                client,
                "User promoted",
                "Someone was promoted in the group",
                [
                    {name: "Username", value: username},
                    {name: "Old rank", value: currentRank},
                    {name: "New rank", value: newRank},
                    {name: "Responsible user", value: runnerUser}
                ],
                "Green",
                embedimage
            )

    },
    
}