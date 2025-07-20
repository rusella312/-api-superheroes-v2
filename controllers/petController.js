import express from "express";
import petService from "../services/petService.js";
import Pet from "../models/petModel.js";
import auth from "../middleware/auth.js";

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
        const pets = await petService.getAvailablePets();
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
router.post("/pets/:id/adopt", auth, async (req, res) => {
    try {
        const ownerId = req.user.id;
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
        const pet = await petService.getPetById(req.params.id);
        if (!pet) return res.status(404).json({ error: "Mascota no encontrada" });
        res.json(pet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/by-owner/{name}:
 *   get:
 *     summary: Obtener mascotas adoptadas por un superhéroe usando su nombre
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del superhéroe
 *     responses:
 *       200:
 *         description: Lista de mascotas adoptadas por el superhéroe
 *       404:
 *         description: Superhéroe no encontrado
 */
router.get("/pets/by-owner/:name", async (req, res) => {
    try {
        const db = await (await import('../db.js')).default();
        const hero = await db.collection('superheroes').findOne({ name: req.params.name });
        if (!hero) return res.status(404).json({ error: "Superhéroe no encontrado" });
        const pets = await db.collection('pets').find({
            $or: [
                { ownerId: hero._id },
                { ownerId: hero._id.toString() }
            ]
        }).toArray();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{id}/items:
 *   post:
 *     summary: Agregar un item a una mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item agregado a la mascota
 *       404:
 *         description: Mascota no encontrada
 */
router.post("/pets/:id/items", async (req, res) => {
    try {
        const db = await (await import('../db.js')).default();
        const pet = await db.collection('pets').findOne({ id: parseInt(req.params.id) });
        if (!pet) return res.status(404).json({ error: "Mascota no encontrada" });

        const item = { name: req.body.name };
        // Si la mascota no tiene items, inicializa el array
        if (!pet.items) pet.items = [];
        pet.items.push(item);

        await db.collection('pets').updateOne(
            { id: parseInt(req.params.id) },
            { $set: { items: pet.items } }
        );

        res.json({ message: "Item agregado a la mascota", pet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Eliminar una mascota por id
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la mascota
 *     responses:
 *       200:
 *         description: Mascota eliminada
 *       404:
 *         description: Mascota no encontrada
 */
router.delete("/pets/:id", async (req, res) => {
    try {
        const db = await (await import('../db.js')).default();
        const result = await db.collection('pets').deleteOne({ id: parseInt(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Mascota no encontrada" });
        }
        res.json({ message: "Mascota eliminada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 