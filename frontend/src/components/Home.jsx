import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/home.css";


function Home() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userid || user?._id || null;

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quiz/user/${userId}`);
        const allQuizzes = res.data.quizzes;
        // ✅ Keep only the last 5 quizzes and show latest first
        const latestFive = allQuizzes.slice(-5).reverse();
        setQuizzes(latestFive);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      }
    };

    if (userId) {
      fetchQuizzes();
    } else {
      console.log("No userId found in localStorage.");
    }
  }, [userId]);

  const handleQuizClick = (quizId) => {
    navigate(`/quiz-review/${quizId}`);
  };

  const handleProfileClick = () => {
    navigate("/profile"); // Redirect to separate profile page
  };
  return (
    <div className="dashboard-container" >
      <h2>Welcome to Your Quiz Dashboard</h2>
      <div className="profile-icon" onClick={handleProfileClick}>👤</div>
      <button onClick={() => navigate("/quiz-setup")} style={{ marginBottom: "20px" }}>
        Create Quiz
      </button>

      {quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <div className="quiz-cards" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              onClick={() => handleQuizClick(quiz._id)}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
                width: "200px",
                cursor: "pointer",
                background: "#f8f8f8",
              }}
            >
              <h3>{quiz.topic}</h3>
              <p>Level: {quiz.level}</p>
              <p>Questions: {quiz.questions?.length || 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
