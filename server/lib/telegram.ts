const botToken = process.env.BOT_TOKEN
const chatId = process.env.BOT_CHAT_ID

const sendMessage = async (text) => {
  await $fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    body: {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    },
  })
}

export { sendMessage }
