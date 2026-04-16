const router = require('express').Router();
const {
  getAllVolunteers, getVolunteer, approveVolunteer,
  rejectVolunteer, getPendingVolunteers, getRankings, getDashboardStats
} = require('../controllers/volunteerController');
const { protect } = require('../middleware/auth');

router.use(protect('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/volunteers', getAllVolunteers);
router.get('/volunteers/pending', getPendingVolunteers);
router.get('/volunteers/rankings', getRankings);
router.get('/volunteers/:id', getVolunteer);
router.patch('/volunteers/:id/approve', approveVolunteer);
router.patch('/volunteers/:id/reject', rejectVolunteer);

module.exports = router;
