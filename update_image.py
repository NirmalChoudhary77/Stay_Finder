from pymongo import MongoClient

client = MongoClient("mongodb+srv://nirmalchoudharync123:UMKMgx3do6TXcNiS@cluster0.rmko9a9.mongodb.net/stayfinder?retryWrites=true&w=majority&appName=Cluster0")
db = client['stayfinder']
listings = db['listings']

result = listings.update_one(
    {"title": "Modern City Apartment"},
    {
        "$set": {
            "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
        }
    }
)

if result.modified_count > 0:
    print("✅ Image updated successfully.")
elif result.matched_count > 0:
    print("⚠️ Image already set.")
else:
    print("❌ No listing found with that title.")
