const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ message: "Token faltante" });

  const token = authHeader.split(" ")[1]; 
  if (!token) return res.status(401).json({ message: "Token faltante" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secreto_local");
    req.user = verified;  
    next();  
  } catch (error) {
    res.status(400).json({ message: "Token inválido" });
  }
}

module.exports = verificarToken;