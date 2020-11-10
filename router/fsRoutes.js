const {Router} = require('express')
const Controller= require('../controller/fsController')

const router = Router()
const controller = new Controller()

router.get('/import',controller.readFile)
router.post('/export',controller.writeFile)

module.exports = router