import express from "express";
import { check, validationResult } from 'express-validator';
import heroService from "../services/heroService.js";
import Hero from "../models/heroModel.js";
import petRepository from '../repositories/petRepository.js';

const router = express.Router();

/**
 * @swagger
 * /api/heroes:
 *   get:
 *     summary: Obtener todos los héroes
 *     tags: [Héroes]
 *     responses:
 *       200:
 *         description: Lista de héroes
 */
router.get("/heroes", async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroes();
        const pets = await petRepository.getPets();
        const heroesWithPets = heroes.map(hero => ({
            ...hero,
            mascotas: pets.filter(pet => pet.ownerId === hero.id)
        }));
        res.json(heroesWithPets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/heroes:
 *   post:
 *     summary: Crear un nuevo héroe
 *     tags: [Héroes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               alias:
 *                 type: string
 *               city:
 *                 type: string
 *               team:
 *                 type: string
 *               ownerId:
 *                 type: string
 *                 description: ID del dueño del héroe (opcional)
 *     responses:
 *       201:
 *         description: Héroe creado
 */
router.post("/heroes",
    [
        check('name').not().isEmpty().withMessage('El nombre es requerido'),
        check('alias').not().isEmpty().withMessage('El alias es requerido')
    ], 
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ error : errors.array()})
        }

        try {
            // Recibe todos los campos, incluyendo ownerId si lo mandan
            const { name, alias, city, team, ownerId } = req.body;
            const newHero = { name, alias, city, team };
            if (ownerId) newHero.ownerId = ownerId;
            const addedHero = await heroService.addHero(newHero);

            res.status(201).json(addedHero);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

/**
 * @swagger
 * /api/heroes/{id}:
 *   put:
 *     summary: Actualizar un héroe
 *     tags: [Héroes]
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
 *     responses:
 *       200:
 *         description: Héroe actualizado
 *       404:
 *         description: Héroe no encontrado
 */
router.put("/heroes/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    // Opcional: aquí puedes validar req.body si lo deseas

    try {
        const updatedHero = await heroService.updateHero(id, req.body);
        if (!updatedHero) {
            return res.status(404).json({ error: "Héroe no encontrado" });
        }
        res.json(updatedHero);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/heroes/{id}:
 *   delete:
 *     summary: Eliminar un héroe
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Héroe eliminado
 *       404:
 *         description: Héroe no encontrado
 */
router.delete('/heroes/:id', async (req, res) => {
    try {
        const result = await heroService.deleteHero(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router
