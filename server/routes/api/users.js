const router = require('express').Router();
const usersCtrl = require('../../controllers/api/usersController');
//const auth = require('../../middleware/authenticate');

router.post('/', usersCtrl.create);
router.post('/login', usersCtrl.login);
router.post('/logout', usersCtrl.logout);
router.post('/refresh', usersCtrl.refresh);

module.exports = router;