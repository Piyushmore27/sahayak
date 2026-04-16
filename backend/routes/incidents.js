const router = require('express').Router();
const { getIncidents, createIncident, updateIncident, assignVolunteers, deleteIncident } = require('../controllers/incidentController');
const { protect } = require('../middleware/auth');

router.get('/', protect('admin'), getIncidents);
router.post('/', protect('admin'), createIncident);
router.patch('/:id', protect('admin'), updateIncident);
router.post('/:id/assign', protect('admin'), assignVolunteers);
router.delete('/:id', protect('admin'), deleteIncident);

module.exports = router;
