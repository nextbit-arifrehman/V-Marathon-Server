const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');

// ✅ 🔓 Public route: Get 6 featured marathons (for homepage)
router.get('/public/featured', async (req, res) => {
  try {
    const marathonCollection = req.app.locals.marathonCollection;

    const featuredMarathons = await marathonCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();

    res.send(featuredMarathons);
  } catch (error) {
    console.error('GET /api/marathons/public/featured error:', error);
    res.status(500).send({ message: 'Failed to fetch featured marathons', error });
  }
});

// // ✅ 🔒 Get all marathons (private, JWT required)
// router.get('/', verifyJWT, async (req, res) => {
//   try {
//     const marathonCollection = req.app.locals.marathonCollection;
//     const { sort, location } = req.query;

//     const query = location ? { location: { $regex: location, $options: 'i' } } : {};
//     const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

//     const result = await marathonCollection.find(query).sort(sortOption).toArray();
//     res.send(result);
//   } catch (error) {
//     res.status(500).send({ message: 'Failed to fetch marathons', error });
//   }
// });

// ✅ 🔒 Get single marathon details
router.get('/:id', verifyJWT, async (req, res) => {
  try {
    const marathonCollection = req.app.locals.marathonCollection;
    const marathon = await marathonCollection.findOne({ _id: new ObjectId(req.params.id) });

    if (!marathon) return res.status(404).send({ message: 'Marathon not found' });

    res.send(marathon);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch marathon details', error });
  }
});

// ✅ 🔒 Create a new marathon
router.post('/', verifyJWT, async (req, res) => {
  try {
    const data = req.body;
    data.createdAt = new Date();
    data.totalRegistration = 0;

    const marathonCollection = req.app.locals.marathonCollection;
    const result = await marathonCollection.insertOne(data);

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Failed to create marathon', error });
  }
});

// ✅ 🔒 Update marathon
router.patch('/:id', verifyJWT, async (req, res) => {
  try {
    const updated = req.body;
    const marathonCollection = req.app.locals.marathonCollection;

    const result = await marathonCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updated }
    );

    if (result.matchedCount === 0)
      return res.status(404).send({ message: 'Marathon not found' });

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Failed to update marathon', error });
  }
});

// ✅ 🔒 Delete marathon
router.delete('/:id', verifyJWT, async (req, res) => {
  try {
    const marathonCollection = req.app.locals.marathonCollection;
    const result = await marathonCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0)
      return res.status(404).send({ message: 'Marathon not found' });

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete marathon', error });
  }
});

module.exports = router;





































// c
// const { ObjectId } = require('mongodb');
// const router = express.Router();
// const verifyJWT = require('../middlewares/verifyJWT');

// // 🔒 Get all marathons (private)
// router.get('/', verifyJWT, async (req, res) => {
//   try {
//     const marathonCollection = req.app.locals.marathonCollection;
//     const { sort, location } = req.query;

//     const query = location ? { location: { $regex: location, $options: 'i' } } : {};
//     const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

//     const result = await marathonCollection.find(query).sort(sortOption).toArray();
//     res.send(result);
//   } catch (error) {
//     res.status(500).send({ message: 'Failed to fetch marathons', error });
//   }
// });

// // 🔒 Get single marathon details (private)
// router.get('/:id', verifyJWT, async (req, res) => {
//   try {
//     const marathonCollection = req.app.locals.marathonCollection;
//     const marathon = await marathonCollection.findOne({ _id: new ObjectId(req.params.id) });

//     if (!marathon) return res.status(404).send({ message: 'Marathon not found' });

//     res.send(marathon);
//   } catch (error) {
//     res.status(500).send({ message: 'Failed to fetch marathon details', error });
//   }
// });

// // 🔒 Create marathon (private)
// router.post('/', verifyJWT, async (req, res) => {
//   try {
//     const data = req.body;
//     data.createdAt = new Date();
//     data.totalRegistration = 0;

//     const marathonCollection = req.app.locals.marathonCollection;
//     const result = await marathonCollection.insertOne(data);

//     res.send(result);
//   } catch (error) {
//     res.status(500).send({ message: 'Failed to create marathon', error });
//   }
// });

// // 🔒 Update marathon (private)
// router.patch('/:id', verifyJWT, async (req, res) => {
//   try {
//     const updated = req.body;
//     const marathonCollection = req.app.locals.marathonCollection;

//     const result = await marathonCollection.updateOne(
//       { _id: new ObjectId(req.params.id) },
//       { $set: updated }
//     );

//     if (result.matchedCount === 0)
//       return res.status(404).send({ message: 'Marathon not found' });

//     res.send(result);
//   } catch (error) {
//     res.status(500).send({ message: 'Failed to update marathon', error });
//   }
// });

// // 🔒 Delete marathon (private)
// router.delete('/:id', verifyJWT, async (req, res) => {
//   try {
//     const marathonCollection = req.app.locals.marathonCollection;
//     const result = await marathonCollection.deleteOne({ _id: new ObjectId(req.params.id) });

//     if (result.deletedCount === 0)
//       return res.status(404).send({ message: 'Marathon not found' });

//     res.send(result);
//   } catch (error) {
//     res.status(500).send({ message: 'Failed to delete marathon', error });
//   }
// });

// // 🔓 Public route: Get 6 featured marathons for homepage (no JWT required)
// router.get('/public/featured', async (req, res) => {
//   try {
//     const marathonCollection = req.app.locals.marathonCollection;

//     // Customize your "featured" criteria here if needed
//     // For now, fetching latest 6 marathons sorted by createdAt descending
//     const featuredMarathons = await marathonCollection
//       .find({})
//       .sort({ createdAt: -1 })
//       .limit(6)
//       .toArray();

//     res.send(featuredMarathons);
//   } catch (error) {
//     console.error('GET /api/marathons/public/featured error:', error);
//     res.status(500).send({ message: 'Failed to fetch featured marathons', error });
//   }
// });

// module.exports = router;
