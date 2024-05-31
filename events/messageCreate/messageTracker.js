const messageSchema = require("../../schemas/messages")

module.exports = async(client, message) => {
  if(message.author.bot) return;
  if(message.channel.id !== "1221931397330112674") return;
  const memberid = message.author.id

  const data = await messageSchema.findOne({ userid: memberid })

  if(data) {
    data.messages++
    await data.save()
  } else {
    let newDoc = new messageSchema({
      userid: message.author.id,
      messages: 1
    })
    await newDoc.save()
  }
}