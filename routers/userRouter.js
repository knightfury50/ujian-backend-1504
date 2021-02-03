const router = require('express').Router()
const { body } = require('express-validator')

const { userController } = require('../controllers')

const { verifyToken } = require('../helpers/jwt')

const registerValidation = [
    body('username')
        .notEmpty()
        .withMessage('Username can\'t empty')
        .isLength({ min: 6 })
        .withMessage('Username must have 6 character'),
    body('password')
        .notEmpty()
        .withMessage('Password can\'t empty')
        .isLength({ min: 6 })
        .withMessage('Password must have 6 character')
        .matches(/[0-9]/)
        .withMessage('Password must include number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must include symbol'),
    body('email')
        .isEmail()
        .withMessage('Invalid email')
]

// create router
router.post('/register', registerValidation, userController.register)
router.post('/login', userController.login)
router.patch('/deactive', userController.deactive)
router.patch('/activate', userController.activate)
router.patch('/close', userController.close)


module.exports = router