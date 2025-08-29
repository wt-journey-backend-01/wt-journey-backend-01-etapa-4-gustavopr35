const express = require('express')
const app = express()
const agentesRouter = require('./routes/agentesRoutes')
const casosRouter = require('./routes/casosRoutes')
const authRouter = require('./routes/authRoutes')
const usuariosRouter = require('./routes/usuariosRoutes')
const setupSwagger = require('./docs/swagger')
const errorHandler = require('./utils/errorHandler')
const cookieParser = require('cookie-parser')
const PORT = 3000

app.use(express.json())
app.use(cookieParser())

// Configurar Swagger
setupSwagger(app)

app.use('/agentes' ,agentesRouter)

app.use('/casos', casosRouter)

app.use('/auth', authRouter)

app.use('/', usuariosRouter)

app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: 'Página não encontrada.'
    })
})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`)
})