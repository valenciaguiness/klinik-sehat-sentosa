const express = require("express");
const app = express();

app.use(express.json());

app.post("/simpan", (req, res) => {
  console.log("📥 Data pasien:", req.body);
  res.send({ status: "ok" });
});

app.listen(3000, () => {
  console.log("Server aktif di http://localhost:3000");
});
