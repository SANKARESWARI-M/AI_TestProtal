const express = require("express");
const router = express.Router();
const fetch = require("node-fetch"); 

const GEMINI_API_KEY = 'AIzaSyBiqdmJOoS6cNC6Uw4k1IIZmCUo_dK7lmQ'; 

// Function to ask Gemini for questions
async function generateQuizWithGemini(topic, numQuestions, level) {
const prompt = `
Generate ${numQuestions} ${level} level multiple-choice questions on "${topic}".

RULES:
- Return ONLY valid JSON
- NO explanation text
- NO markdown
- NO backticks

JSON format:
[
  {
    "question": "Question text",
    "options": {
      "A": "Option A",
      "B": "Option B",
      "C": "Option C",
      "D": "Option D"
    },
    "answer": "A"
  }
]
`;


  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();
  // const data = await response.json();
  console.log("🔍 Gemini Full Response:", JSON.stringify(data, null, 2));

  // const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  let text = "";

if (
  data &&
  data.candidates &&
  data.candidates.length > 0 &&
  data.candidates[0].content &&
  data.candidates[0].content.parts &&
  data.candidates[0].content.parts.length > 0
) {
  text = data.candidates[0].content.parts
    .map(p => p.text || "")
    .join("");
}

if (!text) {
  throw new Error("Gemini returned empty text");
}


  // try {
  //   const cleanedText = text.replace(/```json|```/g, '').trim(); 
  //   const questions = JSON.parse(cleanedText);
  //   return questions;
  // } catch (e) {
  //   console.error("Failed to parse Gemini response:", text);
  //   throw new Error("Invalid response from Gemini.");
  // }

  try {
  const cleanedText = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const questions = JSON.parse(cleanedText);
  return questions;
} catch (e) {
  console.error("❌ Failed to parse Gemini response");
  console.log("👀 Raw text:\n", text);
  throw new Error("Invalid response from Gemini.");
}

}


const Quiz = require('../models/Quiz'); 

// Route: /api/quiz/start
router.post("/start", async (req, res) => {
  const { topic, numQuestions, level, duration, userId } = req.body; 

  try {
    const questions = await generateQuizWithGemini(topic, numQuestions, level);

    const newQuiz = new Quiz({
      userId,
      topic,
      level,
      duration,
      questions
    });

    await newQuiz.save();
     console.log("Quiz saved successfully to DB:", newQuiz);

    res.json({
      success: true,
      quiz: newQuiz 
    });
  } catch (error) {
    console.error("Error generating quiz:", error.message);
    res.status(500).json({ success: false, message: "Failed to generate quiz" });
  }
});

// GET all quizzes for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.params.userId });
    res.json({ success: true, quizzes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch quizzes" });
  }
});

// GET quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    res.status(200).json({ success: true, quiz });
  } catch (error) {
    console.error('Error fetching quiz by ID:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.get("/:quizId", async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// router.post("/feedback", async (req, res) => {
//   const { quiz, userAnswers } = req.body;




//   const prompt = `
// You are an AI tutor. Analyze the user's quiz performance.

// Quiz:
// ${JSON.stringify(quiz, null, 2)}

// User Answers:
// ${JSON.stringify(userAnswers, null, 2)}

// Evaluate the answers. For each incorrect answer, explain the correct choice briefly. At the end, provide overall feedback about topics the user should revise or improve.

// Return in this JSON format:
// {
//   "feedback": [
//     {
//       "question": "Question text here",
//       "userAnswer": "B",
//       "correctAnswer": "C",
//       "explanation": "Explanation for why C is correct"
//     }
//   ],
//   "overall": "General advice or topics to improve"
// }
// `;

//   console.log(" Incoming User Answers:", userAnswers);
// console.log(" Quiz Questions:", quizData.questions);

// console.log(" Gemini Request Prompt:", JSON.stringify(prompt, null, 2));

//   const body = {
//     contents: [
//       {
//         parts: [{ text: prompt }],
//       },
//     ],
//   };

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       }
//     );
//     console.log(" Gemini Raw Response:", JSON.stringify(data, null, 2));


//     const data = await response.json();

//     const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

//     if (!rawText) {
//       console.error(" Empty response from Gemini:", JSON.stringify(data, null, 2));
//       return res.status(500).json({ success: false, message: "Empty response from Gemini" });
//     }

//     const cleaned = rawText.replace(/```json|```/g, "").trim();

//    let feedback;
// try {
//   feedback = JSON.parse(cleaned);
// } catch (parseError) {
//   console.error("❌ JSON parse error:", parseError.message);
//   console.log("👀 Raw Gemini response:\n", rawText);
//   console.log("🧹 Cleaned version:\n", cleaned);
//   return res.status(500).json({
//     success: false,
//     message: "Invalid JSON format from Gemini. Check console for response format.",
//   });
// }


//     res.json({ success: true, feedback });
//   } catch (error) {
//     console.error("❌ Error generating feedback:", error.message);
//     res.status(500).json({ success: false, message: "Failed to generate feedback" });
//   }
// });



module.exports = router;
