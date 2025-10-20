import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor disponible en el puerto ${PORT}`);
});
