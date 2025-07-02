from pymongo import MongoClient

# Connect to MongoDB Atlas
client = MongoClient("mongodb+srv://nirmalchoudharync123:UMKMgx3do6TXcNiS@cluster0.rmko9a9.mongodb.net/stayfinder?retryWrites=true&w=majority&appName=Cluster0")
db = client["stayfinder"]
listings_collection = db["listings"]

# Clear existing listings (optional)
listings_collection.delete_many({})

# Sample listings
sample_listings = [
    {
        "title": "Cozy Beach House",
        "location": "Goa, India",
        "price": 3500,
        "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        "description": "A relaxing beach house with sea views and modern amenities. Perfect for your vacation!"
    },
    {
        "title": "Mountain View Cabin",
        "location": "Manali, India",
        "price": 2800,
        "image": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
        "description": "Escape to the mountains in this cozy wooden cabin surrounded by nature."
    },
    {
        "title": "Modern City Apartment",
        "location": "Bangalore, India",
        "price": 4200,
        "image": "https://source.unsplash.com/800x600/?apartment,city",
        "description": "A stylish city apartment located in the heart of Bangalore. Walkable to shops and cafes."
    }
]

# Insert sample listings
listings_collection.insert_many(sample_listings)
print("✅ Sample listings added successfully!")
