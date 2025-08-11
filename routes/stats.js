const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

// router.get('/stats/dashboard-stats', verifyJWT, async (req, res) => {
//   try {
//     const marathonColl = req.app.locals.marathonCollection;
//     const applyColl = req.app.locals.applyCollection;

//     const marathonCount = await marathonColl.countDocuments();
//     const applicationCount = await applyColl.countDocuments();
//     const upcomingCount = await marathonColl.countDocuments({
//       marathonStartDate: { $gt: new Date() }
//     });

    // ✅ Aggregate total registrations across all marathons
    const [{ totalRegistrations = 0 }] = await marathonColl.aggregate([
      { $group: { _id: null, totalRegistrations: { $sum: '$totalRegistration' } } }
    ]).toArray();

    res.send({
      marathonCount,
      applicationCount,
      upcomingCount,
      totalRegistrations // ✅ This was missing before
    });
  } catch (err) {
    console.error('GET /stats error:', err);
    res.status(500).send({ message: 'Internal server error' });
  }
});


// // router.get('/stats', verifyJWT, async (req, res) =>
// router.get('/stats/dashboard-stats', verifyJWT, async (req, res) => {
//   try {
//     const marathonCount = await req.app.locals.marathonCollection.countDocuments();
//     const applicationCount = await req.app.locals.applyCollection.countDocuments();
//     const upcomingCount = await req.app.locals.marathonCollection.countDocuments({
//       marathonStartDate: { $gt: new Date() }
//     });

//     res.send({
//       marathonCount,
//       applicationCount,
//       upcomingCount
//     });
//   } catch (err) {
//     console.error('GET /stats error:', err);
//     res.status(500).send({ message: 'Internal server error' });
//   }
// });

module.exports = router;
