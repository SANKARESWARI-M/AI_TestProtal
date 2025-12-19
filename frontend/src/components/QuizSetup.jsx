import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/QuizSetup.css";


function QuizSetup() {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [level, setLevel] = useState("Easy");
  const [quizTime, setQuizTime] = useState("");
  const navigate = useNavigate();

  const calculateTime = (level, questions) => {
    let timePerQ = level === "Easy" ? 30 : level === "Medium" ? 45 : 60;
    return questions * timePerQ; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.userid;

    if (!userId) {
      alert("User not logged in");
      return;
    }

    // If quizTime is provided by user, use that (converted to seconds), else calculate
    const duration = quizTime ? Number(quizTime) * 60 : null;


    try {
      const response = await axios.post("http://localhost:5000/api/quiz/start", {
        topic,
        numQuestions,
        level,
        duration,
        userId, 
      });

      // if (response.data.success) {
      //   navigate("/quiz", { state: response.data.quiz });
      // }
      if (response.data.success) {
  navigate("/quiz", { state: { quiz: response.data.quiz, duration } });
}

    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div id="container">
      <button onClick={()=>navigate("/home") }id="back">back</button>
      <div className="quiz-setup-container">
      <h2>Setup Your Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />

        <input
          type="number"
          min="1"
          max="20"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          placeholder="Number of Questions"
          required
        />

        <select  id="level" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <input
          type="number"
          placeholder="Time (in minutes, optional)"
          value={quizTime}
          onChange={(e) => setQuizTime(e.target.value)}
          min="1"
        />

        <button type="submit"id="start">Start Quiz</button>
      </form>
    </div>
    </div>
  );

}

export default QuizSetup;
