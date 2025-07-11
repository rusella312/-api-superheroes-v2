import express from "express";
import { check, validationResult } from 'express-validator';
import heroService from "../services/heroService.js";
import Hero from "../models/heroModel.js";

const router = express.Router();

/**
 * @swagger
 * /heroes:
 *   get:
 *     summary: Obtener todos los superhéroes
 *     description: Retorna una lista de todos los superhéroes disponibles
 *     tags: [Héroes]
 *     responses:
 *       200:
 *         description: Lista de superhéroes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hero'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// GET /api/heroes - Obtener todos los héroes
router.get("/heroes", async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroes();
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes:
 *   post:
 *     summary: Crear un nuevo superhéroe
 *     description: Crea un nuevo superhéroe con los datos proporcionados
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
 *                 description: Nombre real del héroe
 *                 example: "Roberto Gómez Bolaños"
 *               alias:
 *                 type: string
 *                 description: Nombre de superhéroe
 *                 example: "Chapulin Colorado"
 *               city:
 *                 type: string
 *                 description: Ciudad donde opera el héroe
 *                 example: "CDMX"
 *               team:
 *                 type: string
 *                 description: Equipo al que pertenece
 *                 example: "Independiente"
 *             required:
 *               - name
 *               - alias
 *     responses:
 *       201:
 *         description: Superhéroe creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hero'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /api/heroes - Crear un nuevo héroe
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
            const { name, alias, city, team } = req.body;
            const newHero = new Hero(null, name, alias, city, team);
            const addedHero = await heroService.addHero(newHero);

            res.status(201).json(addedHero);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

/**
 * @swagger
 * /heroes/{id}:
 *   put:
 *     summary: Actualizar un superhéroe
 *     description: Actualiza los datos de un superhéroe existente
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del superhéroe a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre real del héroe
 *               alias:
 *                 type: string
 *                 description: Nombre de superhéroe
 *               city:
 *                 type: string
 *                 description: Ciudad donde opera el héroe
 *               team:
 *                 type: string
 *                 description: Equipo al que pertenece
 *     responses:
 *       200:
 *         description: Superhéroe actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hero'
 *       404:
 *         description: Superhéroe no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// PUT /api/heroes/:id - Actualizar un héroe
router.put("/heroes/:id", async (req, res) => {
    try {
        const updatedHero = await heroService.updateHero(req.params.id, req.body);
        res.json(updatedHero);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes/{id}:
 *   delete:
 *     summary: Eliminar un superhéroe
 *     description: Elimina un superhéroe de la base de datos
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del superhéroe a eliminar
 *     responses:
 *       200:
 *         description: Superhéroe eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Héroe eliminado"
 *       404:
 *         description: Superhéroe no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// DELETE /api/heroes/:id - Eliminar un héroe
router.delete('/heroes/:id', async (req, res) => {
    try {
        const result = await heroService.deleteHero(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes/city/{city}:
 *   get:
 *     summary: Buscar superhéroes por ciudad
 *     description: Retorna todos los superhéroes que operan en una ciudad específica
 *     tags: [Búsquedas]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la ciudad
 *         example: "New York"
 *     responses:
 *       200:
 *         description: Lista de superhéroes encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hero'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/heroes/city/:city - Buscar héroes por ciudad
router.get('/heroes/city/:city', async (req, res) => {
    try {
        const heroes = await heroService.findHeroesByCity(req.params.city);
        res.json(heroes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /heroes/{id}/enfrentar:
 *   post:
 *     summary: Enfrentar superhéroe con villano
 *     description: Simula un enfrentamiento entre un superhéroe y un villano
 *     tags: [Acciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del superhéroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               villain:
 *                 type: string
 *                 description: Nombre del villano
 *                 example: "Joker"
 *             required:
 *               - villain
 *     responses:
 *       200:
 *         description: Enfrentamiento simulado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Batman enfrenta a Joker"
 *       404:
 *         description: Superhéroe no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /api/heroes/:id/enfrentar - Enfrentar a un héroe con un villano
router.post('/heroes/:id/enfrentar', async (req, res) => {
    try {
        const result = await heroService.faceVillain(req.params.id, req.body.villain);
        res.json({ message: result });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

export default router
