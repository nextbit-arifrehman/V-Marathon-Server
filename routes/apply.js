const express = require('express');
const { ObjectId } = require('mongodb');
const verifyJWT = require('../middlewares/verifyJWT');
const router = express.Router();

// // Apply for marathon (with duplicate check)
// router.post('/', verifyJWT, async (req, res) => {
//   try {
//     const data = req.body;
//     data.createdAt = new Date();

//     // 🔁 Prevent duplicate application
//     const existing = await req.app.locals.applyCollection.findOne({
//       email: data.email,
//       marathonId: data.marathonId
//     });
    
//     if (existing) {
//       return res.status(400).send({ message: 'You have already applied for this marathon.' });
//     }

//     // ✅ Insert new application
//     const result = await req.app.locals.applyCollection.insertOne(data);

//     // ✅ Increment total registration
//     await req.app.locals.marathonCollection.updateOne(
//       { _id: new ObjectId(data.marathonId) },
//       { $inc: { totalRegistration: 1 } }
//     );

    res.send(result);
  } catch (err) {
    console.error('POST /api/apply error:', err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Get logged-in user's applies (with optional search)
router.get('/my', verifyJWT, async (req, res) => {
  try {
    const email = req.user.email;
    const search = req.query.search;
    const query = {
      email,
      ...(search && {
        marathonTitle: { $regex: search, $options: 'i' }
      })
    };
    const applies = await req.app.locals.applyCollection.find(query).toArray();
    res.send(applies);
  } catch (err) {
    console.error('GET /api/apply/my error:', err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Update application
router.patch('/:id', verifyJWT, async (req, res) => {
  try {
    const result = await req.app.locals.applyCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.send(result);
  } catch (err) {
    console.error('PATCH /api/apply/:id error:', err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Delete application
router.delete('/:id', verifyJWT, async (req, res) => {
  try {
    const doc = await req.app.locals.applyCollection.findOne({ _id: new ObjectId(req.params.id) });

    if (!doc) {
      return res.status(404).send({ message: 'Application not found' });
    }

    const result = await req.app.locals.applyCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    // Decrease registration count
    await req.app.locals.marathonCollection.updateOne(
      { _id: new ObjectId(doc.marathonId) },
      { $inc: { totalRegistration: -1 } }
    );

    res.send(result);
  } catch (err) {
    console.error('DELETE /api/apply/:id error:', err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
