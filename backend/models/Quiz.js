const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  topic: { type: String, required: true },
  level: { type: String, required: true },
  questions: [
    {
      question: String,
      options: {
        A: String,
        B: String,
        C: String,
        D: String,
      },
      answer: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);
