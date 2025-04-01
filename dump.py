import pandas as pd
from pymongo import MongoClient
from bson.objectid import ObjectId

# Read CSV
csv_file = "indeed_jobs_usa_remote.csv"
data = pd.read_csv(csv_file)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["job_matching"]  # Replace with your database name
collection = db["job_listings"]  # Replace with your collection name

# Add a random ID to each record
data["job_id"] = [str(ObjectId()) for _ in range(len(data))]

# Insert the data into MongoDB
try:
    collection.insert_many(data.to_dict("records"))
    print("CSV data dumped successfully with random job IDs!")
except Exception as e:
    print(f"Error during insertion: {e}")
