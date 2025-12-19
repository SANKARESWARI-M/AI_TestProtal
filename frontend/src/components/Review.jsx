import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function QuizReview() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quiz/${quizId}`);
        console.log("Quiz Data:", res.data.quiz);
        setQuiz(res.data.quiz);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) return <p>Loading quiz review...</p>;

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <p>No quiz data available.</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{quiz.topic} - {quiz.level}</h2>
      {quiz.questions.map((q, index) => (
        <div
          key={index}
          style={{
            marginBottom: "1.5rem",
            background: "#f0f0f0",
            padding: "1rem",
            borderRadius: "8px"
          }}
        >
          <h4>Q{index + 1}: {q.question}</h4>

          <ul>
            {Object.entries(q.options).map(([key, value]) => (
              <li
                key={key}
                style={{
                  color: key === q.answer ? "green" : "black",
                  fontWeight: key === q.answer ? "bold" : "normal"
                }}
              >
                {key}. {value} {key === q.answer && "✔"}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default QuizReview;
