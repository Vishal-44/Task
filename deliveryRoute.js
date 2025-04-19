const { Router } = require('express');
const { minimumCost } = require('./deliveryController');
const router = Router();

router.route('/minimum-cost').post( minimumCost)

module.exports = router;