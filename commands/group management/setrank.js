const noblox = require("noblox.js")
const { ApplicationCommandOptionType } = require("discord.js")
require("dotenv").config()
const group = process.env.GROUP
const extractRankName = require("../../utils/extractRankName")
const checkAllowance = require("../../utils/checkAllowance")
const getRobloxUser = require("../../utils/getRobloxUser")
const sendLog = require("../../utils/sendLog")
const getUserAvatar = require("../../utils/getUserAvatar")




const rankChoices = [
    { name: "Hungry Customer", value: "Hungry Customer" },
    { name: "Noted Customer", value: "Noted Customer" },
    { name: "Investors", value: "Investors"},
    { name: "Partner Representative", value: "Partner Representative"},
    { name: "Awaiting Training", value: "Awaiting Training" },
    { name: "Cashier", value: "Cashier" },
    { name: "Experienced Staff", value: "Experienced Staff" },
    { name: "Senior Staff", value: "Senior Staff" },
    { name: "Management Intern", value: "Management Intern" },
    { name: "Management Assistant", value: "Management Assistant" },
    { name: "Team Leader", value: "Team Leader" },
    { name: "Assistant Manager", value: "Assistant Manager" },
    { name: "General Manager", value: "General Manager" },
    { name: "Corporate Assistant", value: "Corporate Assistant" },
    { name: "Corporate Intern", value: "Corporate Intern" },
    { name: "Corporate officer", value: "Corporate officer" },
    { name: "Senior Corporate", value: "Senior Corporate" },
    { name: "Head Corporate", value: "Head Corporate" },
    { name: "Presidential Assistant", value: "Presidential Assistant" },
    { name: "Vice President", value: "Vice President" },
    { name: "President", value: "President" }
];


module.exports = {
    name: "setrank",
    description: "sets the rank of a user in the group",
   highRankOnly: true,
    options: [
        {
            name: "username",
            description: "the user to update the rank of",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "rank",
            description: "the rank to update the user to",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: rankChoices
        }
    ],

    run : async(client, interaction) => {


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
            


            const isMember = await noblox.getRankInGroup(group, userId)
        

            if(isMember == 0) {
                return interaction.editReply({
                    content: "The specified roblox user is not in the group.",
                })
            }

        const runnerID = await noblox.getIdFromUsername(runnerUser)

        const runnerRank = await noblox.getRankInGroup(group, runnerID)


        const rank = interaction.options.getString("rank")
        
          if(rank == currentRank) return interaction.editReply(`${username} already has the rank ${currentRank}`)



          if(!await checkAllowance(runnerID, userId)) return interaction.editReply({
            content: "Unauthorized rank change: the user you are trying to demote has a role that is equal to or above your own.",
         })

        const roleToUpdateTo = await noblox.getRole(group, rank);

        if(runnerRank <= roleToUpdateTo.rank) return interaction.editReply({
         content: "Unauthorized rank change: the role you are trying to update to is equal to or above your own.",
        })


        try {
            await noblox.setRank(group, userId, rank)
            let newRank = await noblox.getRankNameInGroup(group, userId)
            const newRankName = extractRankName(newRank)
         interaction.editReply(`Succesfully set the rank of ${username} to **${newRankName}**!`)


        
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
                "User rank updated",
                "Someone's rank was updated in the group",
                [
                    {name: "Username", value: username},
                    {name: "Old rank", value: currentRank},
                    {name: "New rank", value: newRank},
                    {name: "Responsible user", value: runnerUser}
                ],
                "Blue",
                embedimage
            )
    }
}