const express = require('express')
const router = express.Router()
const casosController = require('../controllers/casosController')
const authMiddleware = require('../middlewares/authMiddleware')

/**
 * @swagger
 * tags:
 *  name: Casos
 *  description: Gerenciamento de casos
 * components:
 *  schemas:
 *      Caso:
 *          type: object
 *          required:
 *              - id
 *              - titulo
 *              - descricao
 *              - status
 *              - agente_id
 *          properties:
 *              id:
 *                  type: integer
 *                  minimum: 1
 *                  readOnly: true
 *                  description: ID único gerado automaticamente
 *                  example: 1
 *              titulo:
 *                  type: string
 *                  example: vandalismo
 *              descricao:
 *                  type: string
 *                  example: Durante a madrugada de 21/11/2020, diversas paredes de um prédio público foram pichadas e vidros foram quebrados.
 *              status:
 *                  type: string
 *                  enum: [aberto, solucionado]
 *                  example: solucionado
 *              agente_id:
 *                  type: integer
 *                  minimum: 1
 *                  example: 1
 *      CasoInput:
 *          type: object
 *          required:
 *              - titulo
 *              - descricao
 *              - status
 *              - agente_id
 *          properties:
 *              titulo:
 *                  type: string
 *                  example: vandalismo
 *              descricao:
 *                  type: string
 *                  example: Durante a madrugada de 21/11/2020, diversas paredes de um prédio público foram pichadas e vidros foram quebrados.
 *              status:
 *                  type: string
 *                  enum: [aberto, solucionado]
 *                  example: solucionado
 *              agente_id:
 *                  type: integer
 *                  minimum: 1
 *                  example: 1
 *      CasoPatchInput:
 *          type: object
 *          properties:
 *              titulo:
 *                  type: string
 *                  example: vandalismo
 *              descricao:
 *                  type: string
 *                  example: Durante a madrugada de 21/11/2020, diversas paredes de um prédio público foram pichadas e vidros foram quebrados.
 *              status:
 *                  type: string
 *                  enum: [aberto, solucionado]
 *                  example: solucionado
 *              agente_id:
 *                  type: integer
 *                  minimum: 1
 *                  example: 1
 *      Agente:
 *          type: object
 *          required:
 *              - id
 *              - nome
 *              - dataDeIncorporacao
 *              - cargo
 *          properties:
 *              id:
 *                  type: integer
 *                  minimum: 1
 *                  readOnly: true
 *                  description: ID único gerado automaticamente
 *                  example: 1
 *              nome:
 *                  type: string
 *                  example: Gustavo Rodrigues
 *              dataDeIncorporacao:
 *                  type: string
 *                  example: 2024-08-05
 *              cargo:
 *                  type: string
 *                  example: Delegado
 */

/**
 * @swagger
 * /casos:
 *   get:
 *     summary: Retorna uma lista com todos os casos
 *     tags: [Casos]
 *     parameters:
 *       - in: query
 *         name: agente_id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: ID de um agente específico
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [aberto, solucionado]
 *         required: false
 *         description: Status dos casos, que pode ser aberto ou solucionado
 *     responses:
 *       200:
 *         description: Lista de casos retornada com sucesso
 *         content:
 *           application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Caso'
 *       400:
 *         description: ID do agente inválido ou status inválido
 */
router.get('/', authMiddleware, casosController.getAllCasos)

/**
 * @swagger
 * /casos/search:
 *   get:
 *     summary: Pesquisa casos com os termos no título e/ou descrição
 *     tags: [Casos]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Termos de pesquisa
 *     responses:
 *       200:
 *         description: Casos que possuem os termos de pesquisa no título ou descrição retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Termos de pesquisa não fornecidos
 */
router.get('/search', authMiddleware, casosController.searchInCaso) // rota /casos/search está declarada antes da rota /casos/:id

/**
 * @swagger
 * /casos/{id}/agente:
 *   get:
 *     summary: Retorna o agente responsável por um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID do caso
 *     responses:
 *       200:
 *         description: Agente responsável pelo caso retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       400:
 *         description: ID do caso inválido
 *       404:
 *         description: Caso ou agente não encontrado
 */
router.get('/:id/agente', authMiddleware, casosController.getAgenteByCaso) // a rota /casos/:id/agente está registrada corretamente no casosRoutes.js

/**
 * @swagger
 * /casos/{id}:
 *   get:
 *     summary: Retorna um caso específico pelo ID
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID do caso
 *     responses:
 *       200:
 *         description: Caso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado
 */
router.get('/:id', authMiddleware, casosController.getCasoById)

/**
 * @swagger
 * /casos:
 *   post:
 *     summary: Registra um novo caso
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CasoInput'
 *     responses:
 *       201:
 *         description: Caso cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authMiddleware, casosController.insertCaso)

/**
 * @swagger
 * /casos/{id}:
 *   put:
 *     summary: Atualiza completamente um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID do caso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CasoInput'
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado
 */
router.put('/:id', authMiddleware, casosController.putCaso)

/**
 * @swagger
 * /casos/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID do caso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CasoPatchInput'
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado
 */
router.patch('/:id', authMiddleware, casosController.patchCaso)

/**
 * @swagger
 * /casos/{id}:
 *   delete:
 *     summary: Remove um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID do caso
 *     responses:
 *       204:
 *         description: Caso removido com sucesso
 *       404:
 *         description: Caso não encontrado
 */
router.delete('/:id', authMiddleware, casosController.deleteCaso)

module.exports = router