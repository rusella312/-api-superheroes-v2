import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectDB from "../db.js";

dotenv.config();

const router = express.Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login de superhéroe (crea el usuario si no existe)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, retorna el token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Error en el login (contraseña incorrecta)
 */
router.post("/login", async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({ error: "Nombre y contraseña requeridos" });
    }
    const db = await connectDB();
    let user = await db.collection("superheroes").findOne({ name });
    if (!user) {
        // Crear el superhéroe con el password proporcionado
        const newUser = { name, password };
        const result = await db.collection("superheroes").insertOne(newUser);
        user = { ...newUser, _id: result.insertedId };
    } else if (!user.password) {
        // Si el usuario existe pero no tiene password, lo asigna
        await db.collection("superheroes").updateOne({ _id: user._id }, { $set: { password } });
        user.password = password;
    } else if (user.password !== password) {
        return res.status(400).json({ error: "Contraseña incorrecta" });
    }
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
});

export default router; 