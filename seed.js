const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://nirmalchoudharync123:UMKMgx3do6TXcNiS@cluster0.rmko9a9.mongodb.net/stayfinder?retryWrites=true&w=majority&appName=Cluster0';

const listingSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  image: String,
  description: String,
});

const Listing = mongoose.model('Listing', listingSchema);

const seedListings = [
  {
    title: "Ocean View Apartment",
    location: "Goa",
    price: 4500,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    description: "Relaxing sea-side apartment with a beautiful view.",
  },
  {
    title: "Cozy Hilltop Cabin",
    location: "Manali",
    price: 3000,
    image: "https://images.unsplash.com/photo-1560448075-bb18b7308c57",
    description: "Warm and cozy cabin in the hills, ideal for winters.",
  },
  {
    title: "Luxury Villa with Pool",
    location: "Jaipur",
    price: 7500,
    image: "https://images.unsplash.com/photo-1572120360610-d971b9c7c027",
    description: "Spacious villa with private pool and garden.",
  },
  {
    title: "Heritage Stay",
    location: "Udaipur",
    price: 5000,
    image: "https://images.unsplash.com/photo-1542315192-6d5f0d0a2eb3",
    description: "A royal experience in a restored haveli.",
  },
  {
    title: "Desert Safari Camp",
    location: "Jaisalmer",
    price: 3500,
    image: "https://images.unsplash.com/photo-1582719478181-d992d56fecd4",
    description: "Spend the night under the stars in the Thar Desert.",
  },
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    await Listing.deleteMany(); // optional: clear previous data
    await Listing.insertMany(seedListings);
    console.log("✅ Listings seeded successfully!");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Error seeding listings:", err);
    process.exit(1);
  });
