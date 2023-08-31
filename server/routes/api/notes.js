const router = require('express').Router();
const notesCtrl = require('../../controllers/api/notesController');
const auth = require('../../middleware/authenticate');

router.get('/',auth,notesCtrl.getAll);
router.get('/:id',auth, notesCtrl.getOne);
router.post('/',auth, notesCtrl.new);
router.put('/:id',auth, notesCtrl.updateOne);
router.delete('/:id',auth, notesCtrl.delete);

module.exports = router;