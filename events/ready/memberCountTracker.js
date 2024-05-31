const getMemberCount = require("../../utils/getMemberCount")
const fs = require("fs")
const { EmbedBuilder } = require("discord.js")

let lastMemberCount;
let jsonData;

module.exports = async(client) => {
    lastMemberCount = await getMemberCount()

    const memChannel = client.channels.cache.get("1246163906498662511")
    const VC = client.channels.cache.get("1246163814416781434")
    const memberJoinedEmbed = new EmbedBuilder()
        .setTitle("New member joined")
        .setColor("Aqua")
        .setThumbnail(
            "https://images-ext-1.discordapp.net/external/DmkRlkzzRWlRSnMnKyFTaVdIxlq0HZdvmf9u7X1NdsY/https/cdn.discordapp.com/icons/1221931396755623947/23e11763294ff1cb8daef507dc906a2a.webp?format=webp&width=140&height=140"
        )
    const memberLeftEmbed = new EmbedBuilder()
        .setTitle("Member left")
        .setColor("Red")
        .setThumbnail(
            "https://images-ext-1.discordapp.net/external/DmkRlkzzRWlRSnMnKyFTaVdIxlq0HZdvmf9u7X1NdsY/https/cdn.discordapp.com/icons/1221931396755623947/23e11763294ff1cb8daef507dc906a2a.webp?format=webp&width=140&height=140"
        )

    async function updateMemberCount() {
        fs.readFile("goal.json", (err, data) => {
            if (err) throw err;
            jsonData = JSON.parse(data);
        });

        const currentCount = await getMemberCount()

        if (currentCount !== lastMemberCount) {
            if(currentCount == undefined) return;
            const currentTarget = jsonData.goal
            const amountLeft = currentTarget - currentCount

            if(amountLeft == 0) {
                memberJoinedEmbed.setDescription(
                    `We now have ${currentCount} members! We have reached our goal! 🥳`
                )
                memberJoinedEmbed.setFooter({text: `New goal: ${currentTarget + 50}`})
            } else {
                memberJoinedEmbed.setDescription(`We now have ${currentCount} members! Only ${amountLeft} to go to reach our goal of ${currentTarget}!`)
            }

            memberLeftEmbed.setDescription(
                `We now have ${currentCount} members! Only ${amountLeft} to go to reach our goal of ${currentTarget}!`
            )

            if(currentCount > lastMemberCount) {
                memChannel.send({ embeds: [memberJoinedEmbed] })
            } else if(currentCount < lastMemberCount) {
                memChannel.send({embeds: [memberLeftEmbed]})
            }

            if(currentCount >= currentTarget) {
                let newGoal = currentTarget + 50
                jsonData.goal = newGoal
                const updatedGoalData = JSON.stringify(jsonData, null, 2)
                const filePath = 'goal.json';
                fs.writeFile(filePath, updatedGoalData, "utf8", (err) => {
                    if (err) throw err;
                    console.log(`Goal updated to ${newGoal}`)
                });
            }

            VC.setName(`Group Members: ${currentCount}`)
            lastMemberCount = currentCount

        }
        setTimeout(updateMemberCount, 60 * 1000);
    }
    updateMemberCount();
}