const express = require('express')
const router = express.Router()
const agentesController = require('../controllers/agentesController')
const authMiddleware = require('../middlewares/authMiddleware')

/**
 * @swagger
 * tags:
 *   name: Agentes
 *   description: Gerenciamento de agentes
 * components:
 *   schemas:
 *     Agente:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *         - dataDeIncorporacao
 *         - cargo
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *           readOnly: true
 *           description: ID único gerado automaticamente
 *           example: 1
 *         nome:
 *           type: string
 *           example: Gustavo Rodrigues
 *         dataDeIncorporacao:
 *           type: string
 *           example: 2024-08-05
 *         cargo:
 *           type: string
 *           example: delegado
 *     AgenteInput:
 *       type: object
 *       required:
 *         - nome
 *         - dataDeIncorporacao
 *         - cargo
 *       properties:
 *         nome:
 *           type: string
 *           example: Gustavo Rodrigues
 *         dataDeIncorporacao:
 *           type: string
 *           example: 2024-08-05
 *         cargo:
 *           type: string
 *           example: delegado
 *     AgentePatchInput:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           example: Gustavo Rodrigues
 *         dataDeIncorporacao:
 *           type: string
 *           example: 2024-08-05
 *         cargo:
 *           type: string
 *           example: delegado
 */

/**
 * @swagger
 * /agentes:
 *   get:
 *     summary: Retorna uma lista com todos os agentes
 *     tags: [Agentes]
 *     parameters:
 *       - in: query
 *         name: cargo
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtra a lista de agentes por cargo
 *         example: delegado
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [dataDeIncorporacao, -dataDeIncorporacao]
 *         required: false
 *         description: Ordena a lista de agentes por data de incorporação (crescente ou decrescente)
 *         example: dataDeIncorporacao
 *     responses:
 *       200:
 *         description: Retorna lista com todos os agentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agente'
 *       400:
 *         description: Parâmetro sort inválido
 */
router.get('/', authMiddleware, agentesController.getAllAgentes)

/**
 * @swagger
 * /agentes/{id}/casos:
 *   get:
 *     summary: Retorna todos os casos de um agente específico
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID do agente
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de casos do agente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   titulo:
 *                     type: string
 *                     example: Furto de bicicleta
 *                   descricao:
 *                     type: string
 *                     example: Bicicleta furtada na Rua X
 *                   status:
 *                     type: string
 *                     enum: [aberto, solucionado]
 *                     example: aberto
 *                   agente_id:
 *                     type: integer
 *                     example: 1
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Agente não encontrado
 */
router.get('/:id/casos', authMiddleware, agentesController.getCasosByAgente)

/**
 * @swagger
 * /agentes/{id}:
 *   get:
 *     summary: Retorna um agente especificado pelo ID
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID do agente
 *         example: 1
 *     responses:
 *       200:
 *         description: Retorna agente 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado
 */
router.get('/:id', authMiddleware, agentesController.getAgenteById)

/**
 * @swagger
 * /agentes:
 *   post:
 *     summary: Cadastra um novo agente
 *     tags: [Agentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgenteInput'
 *     responses:
 *       201:
 *         description: Agente cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authMiddleware, agentesController.insertAgente)

/**
 * @swagger
 * /agentes/{id}:
 *   put:
 *     summary: Atualiza completamente um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID do agente
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgenteInput'
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado
 */
router.put('/:id', authMiddleware, agentesController.putAgente)

/**
 * @swagger
 * /agentes/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID do agente
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgentePatchInput'
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado
 */
router.patch('/:id', authMiddleware, agentesController.patchAgente)

/**
 * @swagger
 * /agentes/{id}:
 *   delete:
 *     summary: Remove um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID do agente
 *         example: 1
 *     responses:
 *       204:
 *         description: Agente removido com sucesso
 *       404:
 *         description: Agente não encontrado
 */
router.delete('/:id', authMiddleware, agentesController.deleteAgente)

module.exports = router
