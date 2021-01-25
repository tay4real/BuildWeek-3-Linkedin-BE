const router = require('express').Router()

const profileRouter = require('./profile')
const postRouter = require('./post')
const expRouter = require('./experience')

router.use('/profile', profileRouter)
router.use('/post', postRouter)
router.use('/experience', expRouter)

module.exports = router