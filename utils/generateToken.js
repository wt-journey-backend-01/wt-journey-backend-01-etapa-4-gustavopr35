const jwt = require('jsonwebtoken')

function generateToken(payload) {
    const secret = process.env.JWT_SECRET || "secret"
    return jwt.sign({ id: payload.id, email: payload.email }, secret, {
        expiresIn: '1h'
    })
}

module.exports = generateToken