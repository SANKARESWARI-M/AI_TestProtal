const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/quiz', require('./routes/QuizGeneration')); 




app.use((req, res, next) => {
  console.warn(`⚠️ Unhandled route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});


// mongoose.connect(process.env.MONGO_URI)
//   .then((connection) => {
//     console.log('MongoDB connected');
//     console.log(" Using database:", connection.connection.name);
//     const collections = await connection.connection.db.listCollections().toArray();
//   console.log(" Collections in database:");
//   collections.forEach((col) => console.log(" -", col.name));
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch(err => console.error('MongoDB connection error:', err));
  
mongoose.connect(process.env.MONGO_URI)
  .then(async (connection) => {
    console.log(' MongoDB connected');
    console.log(" Using database:", connection.connection.name);

    // List collections
    const collections = await connection.connection.db.listCollections().toArray();
    console.log(" Collections in database:");
    collections.forEach((col) => console.log(" -", col.name));

    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch(err => console.error(' MongoDB connection error:', err));


