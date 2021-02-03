const { validationResult, check } = require('express-validator')
const cryptojs = require('crypto-js')

const { generateQuery, asyncQuery } = require('../helpers/queryHelp')
const { createToken } = require('../helpers/jwt')

const db = require('../database')

const SECRET_KEY = process.env.CRYPTO_KEY

module.exports = {
    register: async (req, res) => {
        const { username, password, email } = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).send(errors.array()[0].msg)

        const hashpass = cryptojs.HmacMD5(password, SECRET_KEY).toString()

        try {
            const checkUser = `SELECT * FROM users 
                              WHERE username=${db.escape(username)}
                              OR email=${db.escape(email)}`
            const resCheck = await asyncQuery(checkUser)

            if (resCheck.length !== 0) return res.status(400).send('Username or Email is already exist')

            const uniq = Date.now()

            const regQuery = `INSERT INTO users (uid, username, password, email)
                              VALUES (${uniq}, ${db.escape(username)}, ${db.escape(hashpass)}, ${db.escape(email)})`
            const resRegister = await asyncQuery(regQuery)

            const query = `SELECT id, uid, username, email FROM users WHERE Id = ${resRegister.insertId}`
            const result = await asyncQuery(query)

            let token = createToken({ id: result[0].id, username: result[0].username })

            result[0].token = token

            res.status(200).send(result[0])
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    
    login: async(req, res) => {
        const { username, password, email } = req.body

        const hashpass = cryptojs.HmacMD5(password, SECRET_KEY).toString()

        try {
            const query = `SELECT id, uid, username, email, status, role FROM users WHERE username = ${db.escape(username)} AND password = ${db.escape(hashpass)}
            OR email = ${db.escape(email)} AND password = ${db.escape(hashpass)}`

            const result = await asyncQuery(query)

            if (result.length === 0) return res.status(400).send('Invalid username or password')

            let token = createToken({ id: result[0].id, username: result[0].username })

            result[0].token = token

            res.status(200).send(result[0])
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    deactive: async(req, res) => {
        const {token} = req.body

        try {
            const editQuery = `update users set status = 2 
            where token = ${db.escape(parseInt(token))}`

            const result = await asyncQuery(editQuery)

            const getquery = `select uid, status from users`

            const resupdate = await asyncQuery(getquery)

            res.status(200).send(resultUpdate)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    activate: async(req, res) => {
        const {token} = req.body

        try {
            const editQuery = `update users set status = 1 
            where token = ${db.escape(parseInt(token))}`

            const result = await asyncQuery(editQuery)

            const getquery = `select uid, status from users`

            const resupdate = await asyncQuery(getquery)

            res.status(200).send(resultUpdate)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    close: async(req, res) => {
        const {token} = req.body

        try {
            const editQuery = `update users set status = 3 
            where token = ${db.escape(parseInt(token))}`

            const result = await asyncQuery(editQuery)

            const getquery = `select uid, status from users`

            const resupdate = await asyncQuery(getquery)

            res.status(200).send(resultUpdate)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}