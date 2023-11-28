const { Router } = require('express')
const UserModel = require('../dao/models/user.model')
const userRouter = Router()

const userModel = new UserModel()

userRouter.get('/', async (req, res) => {
    
    if (!req.session.counter) {
        req.session.counter = 1
        req.session.name = req.query.name
        
        return res.status(200).json({ status: 'successful', message: `Bienvenido ${req.session.name}`})
    } else {
        req.session.counter++

        return res.status(200).json({ status: 'successful', message: `${req.session.name} has visitado ${req.session.counter} veces el website.`})
    }
})

userRouter.post('/register', async (req, res) => {
    const user = await userModel.create(req.body)
    
    return res.redirect('/login')
})

userRouter.post('/login', async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email })

    if (!user) {
        return res.status(401).json({
            error: 'El usuario no existe en el sistema'
        })
    }

    if (user.password !== req.body.password) {
        return res.status(401).json({
            error: 'Datos incorrectos'
        })
    }

    user = user.toObject()
    delete user.password
    req.session.user = user
    return res.redirect('/products')
})

module.exports = userRouter