const router = require('express').Router()

// import controller
const { moviesController } = require('../controllers')

// create router
router.get('/get/all', moviesController.All)
router.get('/get', moviesController.Separate)
router.post('/add', moviesController.AddMovies)

// export router
module.exports = router