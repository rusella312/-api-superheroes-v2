import express from "express";
import petService from "../services/petService.js";
import Pet from "../models/petModel.js";

const router = express.Router();

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtener todas las mascotas
 *     tags: [Mascotas]
 *     responses:
 *       200:
 *         description: Lista de mascotas
 */
router.get("/pets", async (req, res) => {
    try {
        const pets = await petService.getAllPets();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Crear una nueva mascota
 *     tags: [Mascotas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               superPower:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mascota creada
 */
router.post("/pets", async (req, res) => {
    try {
        const { name, type, superPower } = req.body;
        const newPet = new Pet(null, name, type, superPower);
        const addedPet = await petService.addPet(newPet);
        res.status(201).json(addedPet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{id}/adopt:
 *   post:
 *     summary: Adoptar una mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mascota adoptada
 *       400:
 *         description: Mascota no encontrada o ya adoptada
 */
router.post("/pets/:id/adopt", async (req, res) => {
    try {
        const { ownerId } = req.body;
        const adoptedPet = await petService.adoptPet(req.params.id, ownerId);
        res.json(adoptedPet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Obtener una mascota por id
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mascota encontrada
 *       404:
 *         description: Mascota no encontrada
 */
router.get("/pets/:id", async (req, res) => {
    try {
        const pets = await petService.getAllPets();
        const pet = pets.find(p => p.id === parseInt(req.params.id));
        if (!pet) return res.status(404).json({ error: "Mascota no encontrada" });
        res.json(pet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 