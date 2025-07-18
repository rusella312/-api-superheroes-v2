import express from "express";
import petRepository from "../repositories/petRepository.js";

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
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mascota después de jugar
 *       403:
 *         description: No tienes acceso a esta mascota
 *       404:
 *         description: Mascota no encontrada
 */
router.post("/pets/:id/play", async (req, res) => {
    const { ownerId } = req.body;
    const pets = await petRepository.getPets();
    const idx = pets.findIndex(p => p.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Mascota no encontrada" });
    if (pets[idx].ownerId !== ownerId) return res.status(403).json({ error: "No tienes acceso a esta mascota" });
    if (pets[idx].salud === "enfermo") return res.status(400).json({ error: "La mascota está enferma y no puede jugar. Debe ser curada primero.", pet: pets[idx] });
    if (pets[idx].energia < 10) return res.status(400).json({ error: "La mascota no tiene suficiente energía para jugar" });
    pets[idx].felicidad = Math.min(100, (pets[idx].felicidad || 0) + 10);
    pets[idx].energia = Math.max(0, (pets[idx].energia || 0) - 10);
    pets[idx].actividades = pets[idx].actividades || [];
    pets[idx].actividades.push({ tipo: 'jugar', fecha: new Date().toISOString(), felicidadAumentada: 10, energiaConsumida: 10 });
    await petRepository.savePets(pets);
    res.json({ message: '¡Jugar con la mascota fue exitoso!', pet: pets[idx] });
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
router.post("/pets/:id/sleep", async (req, res) => {
    const { ownerId } = req.body;
    const pets = await petRepository.getPets();
    const idx = pets.findIndex(p => p.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Mascota no encontrada" });
    if (pets[idx].ownerId !== ownerId) return res.status(403).json({ error: "No tienes acceso a esta mascota" });
    if (pets[idx].salud === "enfermo") return res.status(400).json({ error: "La mascota está enferma y no puede dormir. Debe ser curada primero.", pet: pets[idx] });
    pets[idx].energia = Math.min(100, (pets[idx].energia || 0) + 20);
    pets[idx].hambre = Math.max(0, (pets[idx].hambre || 0) - 10);
    pets[idx].actividades = pets[idx].actividades || [];
    pets[idx].actividades.push({ tipo: 'dormir', fecha: new Date().toISOString(), energiaAumentada: 20, hambreReducida: 10 });
    await petRepository.savePets(pets);
    res.json({ message: '¡La mascota durmió y recuperó energía!', pet: pets[idx] });
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
router.post("/pets/:id/feed", async (req, res) => {
    const { ownerId } = req.body;
    const pets = await petRepository.getPets();
    const idx = pets.findIndex(p => p.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Mascota no encontrada" });
    if (pets[idx].ownerId !== ownerId) return res.status(403).json({ error: "No tienes acceso a esta mascota" });
    if (pets[idx].salud === "enfermo") return res.status(400).json({ error: "La mascota está enferma y no puede ser alimentada. Debe ser curada primero.", pet: pets[idx] });
    if (pets[idx].hambre === 0 && pets[idx].salud === "sano") {
        pets[idx].salud = "enfermo";
        pets[idx].actividades = pets[idx].actividades || [];
        pets[idx].actividades.push({ tipo: 'alimentar', fecha: new Date().toISOString(), resultado: 'enfermo por hambre en 0' });
        await petRepository.savePets(pets);
        return res.status(400).json({ error: 'La mascota está enferma porque el hambre es 0', pet: pets[idx] });
    }
    pets[idx].felicidad = Math.min(100, (pets[idx].felicidad || 0) + 10);
    pets[idx].hambre = Math.max(0, (pets[idx].hambre || 0) - 10);
    pets[idx].actividades = pets[idx].actividades || [];
    pets[idx].actividades.push({ tipo: 'alimentar', fecha: new Date().toISOString(), felicidadAumentada: 10, hambreReducida: 10 });
    await petRepository.savePets(pets);
    res.json({ message: '¡La mascota fue alimentada con éxito!', pet: pets[idx] });
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
router.post("/pets/:id/cure", async (req, res) => {
    const { ownerId } = req.body;
    const pets = await petRepository.getPets();
    const idx = pets.findIndex(p => p.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Mascota no encontrada" });
    if (pets[idx].ownerId !== ownerId) return res.status(403).json({ error: "No tienes acceso a esta mascota" });
    if (pets[idx].salud === "enfermo") {
        pets[idx].salud = "sano";
        pets[idx].hambre = 50;
        pets[idx].energia = 50;
        pets[idx].actividades = pets[idx].actividades || [];
        pets[idx].actividades.push({ tipo: 'curar', fecha: new Date().toISOString(), resultado: 'curada' });
    }
    await petRepository.savePets(pets);
    res.json({ message: 'La mascota fue curada y restaurada a su estado sano.', pet: pets[idx] });
});

export default router; 