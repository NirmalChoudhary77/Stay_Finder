// ---------- server.js (Backend) ----------

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://nirmalchoudharync123:UMKMgx3do6TXcNiS@cluster0.rmko9a9.mongodb.net/stayfinder?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const User = mongoose.model('User', new mongoose.Schema({
  firstName: String,
  lastName: String,
  dob: String,
  gender: String,
  email: String,
  password: String,
  role: { type: String, default: 'guest' },
}));

const Listing = mongoose.model('Listing', new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  image: String,
  description: String,
  type: String, // e.g. "villa", "apartment"
  amenities: [String], // e.g. ["wifi", "pool"]
}));

const Booking = mongoose.model('Booking', new mongoose.Schema({
  listingId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  dateFrom: String,
  dateTo: String,
}));

// Contact Message Model
const ContactMessage = mongoose.model('ContactMessage', new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
}));

// Auth Routes
app.post('/api/register', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send({ message: 'User registered' });
});

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && user.password === req.body.password) {
    res.send({ message: 'Login successful', user });
  } else {
    res.status(401).send({ message: 'Invalid credentials' });
  }
});

// Listing Routes
// GET /api/listings with filters
app.get('/api/listings', async (req, res) => {
  try {
    const { search, minPrice, maxPrice, type, amenities, dateFrom, dateTo } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (type) filter.type = type;
    if (amenities) filter.amenities = { $all: amenities.split(',') };

    let listings = await Listing.find(filter);

    // Date filtering: exclude listings that are already booked for the requested dates
    if (dateFrom && dateTo) {
      const bookings = await Booking.find({
        $or: [
          { dateFrom: { $lte: dateTo }, dateTo: { $gte: dateFrom } }
        ]
      });
      const bookedListingIds = bookings.map(b => b.listingId.toString());
      listings = listings.filter(l => !bookedListingIds.includes(l._id.toString()));
    }

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
});

app.get('/api/listings/:id', async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.send(listing);
});

// Booking Routes
app.post('/api/bookings', async (req, res) => {
  const { listingId, dateFrom, dateTo, userId } = req.body;

  if (!dateFrom || !dateTo || !userId) {
    return res.status(400).send({ message: 'Missing booking information' });
  }

  const fromDate = new Date(dateFrom);
  const toDate = new Date(dateTo);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (fromDate < today || toDate < fromDate) {
    return res.status(400).send({ message: 'Invalid booking dates' });
  }

  const overlappingBookings = await Booking.find({
    listingId,
    $or: [
      { dateFrom: { $lte: dateTo }, dateTo: { $gte: dateFrom } },
    ]
  });

  if (overlappingBookings.length > 0) {
    return res.status(400).send({ message: 'Selected dates are already booked' });
  }

  const booking = new Booking({ listingId, userId, dateFrom, dateTo });
  await booking.save();
  res.send({ message: 'Booking confirmed' });
});

app.get('/api/bookings/listing/:id', async (req, res) => {
  try {
    const bookings = await Booking.find({ listingId: req.params.id });
    res.send(bookings);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching bookings' });
  }
});

// Contact API endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    await ContactMessage.create({ name, email, message });
    res.json({ message: 'Message received!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
