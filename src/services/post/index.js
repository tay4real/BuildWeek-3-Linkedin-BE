const router = require('express').Router()

router.get('/', async(req,res,next)=> {
    res.send('ok')
})

module.exports = router