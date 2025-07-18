import express from "express";
import petService from "../services/petService.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Actividades
 *     description: Endpoints para interactuar con las mascotas
 */

/**
 * @swagger
 * /api/pets/{id}/play:
 *   post:
 *     summary: Jugar con la mascota
 *     tags: [Actividades]
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
 *                 type: string
 *     responses:
 *       200:
 *         description: Mascota después de jugar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 pet:
 *                   $ref: '#/components/schemas/Pet'
 *       403:
 *         description: No tienes acceso a esta mascota
 *       404:
 *         description: Mascota no encontrada
 */
router.post("/pets/:id/play", auth, async (req, res) => {
    try {
        const ownerId = req.user.id;
        const pet = await petService.playWithPet(req.params.id, ownerId);
        if (!pet) {
            return res.status(500).json({ error: "No se pudo actualizar la mascota" });
        }
        res.json({ message: '¡Jugar con la mascota fue exitoso!', pet });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{id}/sleep:
 *   post:
 *     summary: Dormir a la mascota
 *     tags: [Actividades]
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
 *         description: Mascota después de dormir
 *       403:
 *         description: No tienes acceso a esta mascota
 *       404:
 *         description: Mascota no encontrada
 */
router.post("/pets/:id/sleep", auth, async (req, res) => {
    try {
        const ownerId = req.user.id;
        const pet = await petService.sleepPet(req.params.id, ownerId);
        if (!pet) {
            return res.status(500).json({ error: "No se pudo actualizar la mascota" });
        }
        res.json({ message: '¡La mascota durmió y recuperó energía!', pet });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{id}/feed:
 *   post:
 *     summary: Dar de comer a la mascota
 *     tags: [Actividades]
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
 *         description: Mascota alimentada
 *       400:
 *         description: La mascota está enferma porque el hambre es 0
 *       403:
 *         description: No tienes acceso a esta mascota
 *       404:
 *         description: Mascota no encontrada
 */
router.post("/pets/:id/feed", auth, async (req, res) => {
    try {
        const ownerId = req.user.id;
        const pet = await petService.feedPet(req.params.id, ownerId);
        if (!pet) {
            return res.status(500).json({ error: "No se pudo actualizar la mascota" });
        }
        res.json({ message: '¡La mascota fue alimentada con éxito!', pet });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{id}/cure:
 *   post:
 *     summary: Curar a la mascota
 *     tags: [Actividades]
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
 *         description: Mascota curada
 *       403:
 *         description: No tienes acceso a esta mascota
 *       404:
 *         description: Mascota no encontrada
 */
router.post("/pets/:id/cure", auth, async (req, res) => {
    try {
        const ownerId = req.user.id;
        const pet = await petService.curePet(req.params.id, ownerId);
        if (!pet) {
            return res.status(500).json({ error: "No se pudo actualizar la mascota" });
        }
        res.json({ message: 'La mascota fue curada y restaurada a su estado sano.', pet });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router; 