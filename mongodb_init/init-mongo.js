db.createUser(
  {
    user: "falcon_db",
    pwd: "6783",
    roles: [
      {
        role: "readWrite",
        db: "falcon_mongo"
      }
    ]
  }
);
db.createCollection("falcon_collection");