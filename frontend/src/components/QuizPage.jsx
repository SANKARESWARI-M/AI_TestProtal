import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/QuizPage.css";


function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const quiz = location.state?.quiz;
const quizId = quiz?._id;

  const questions = quiz?.questions || [];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // 👇 initialize only after quiz is loaded
  const [timeLeft, setTimeLeft] = useState(null);
 const totalTime = location.state?.duration || null;


  // 🕒 Start timer when quiz starts
  useEffect(() => {
    if (hasStarted && totalTime && timeLeft === null) {
      setTimeLeft(totalTime);
    }
  }, [hasStarted, totalTime, timeLeft]);

  // ⏳ Timer countdown logic
  useEffect(() => {
    if (submitted || !hasStarted || timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, hasStarted, timeLeft]);

  // 📺 Fullscreen exit & warning logic
  useEffect(() => {
    const onFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;

      if (isFullscreen && showWarning) {
        setShowWarning(false);
        setCountdown(10);
        return;
      }

      if (!isFullscreen && hasStarted && !submitted) {
        setShowWarning(true);
        setCountdown(10);
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [hasStarted, submitted, showWarning]);

  // 🚨 Countdown to auto-submit if fullscreen exit
  useEffect(() => {
    if (showWarning && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (showWarning && countdown === 0 && !submitted) {
      handleSubmit();
    }
  }, [showWarning, countdown, submitted]);

  const enterFullscreenAndStart = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
        .then(() => {
          setHasStarted(true);
          setShowWarning(false);
        })
        .catch(() => alert("Fullscreen mode is required to start the quiz."));
    }
  };

  const handleOptionChange = (e) => {
    setAnswers({ ...answers, [currentQ]: e.target.value });
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const getScore = () => {
    return questions.reduce((score, q, i) => (
      answers[i] === q.answer ? score + 1 : score
    ), 0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setSubmitted(true);
    const timeTaken = totalTime !== null ? totalTime - timeLeft : null;

    navigate(`/quiz-result/${quizId}`, {
      state: {
        answers,
        questions,
        timeTaken,
        score: getScore(),
      },
    });
  };

  const currentQuestion = questions[currentQ];

  if (!quiz || !questions.length) return <div>No quiz data found.</div>;

  if (!hasStarted) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2>Ready to start the quiz?</h2>
        <p>This quiz will open in fullscreen and auto-submit if exited.</p>
        <button id="startbtn"onClick={enterFullscreenAndStart}>Start Quiz</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>Quiz on {quiz.topic}</h2>
      <p>
        Difficulty: {quiz.level} | Total Questions: {questions.length}
      </p>

     {timeLeft !== null && (
  <p>⏳ Time Left: {formatTime(timeLeft)}</p>
)}


      <h3>Question {currentQ + 1}:</h3>
      <p>{currentQuestion.question}</p>
      <div className="options">
  {Object.entries(currentQuestion.options).map(([key, value]) => (
    <label key={key}>
      <input
        type="radio"
        name={`question-${currentQ}`}
        value={key}
        checked={answers[currentQ] === key}
        onChange={handleOptionChange}
      />
      <span>{key}. {value}</span>
    </label>
  ))}
</div>


      <div style={{ marginTop: "1rem" }}>
        <button onClick={handlePrev} disabled={currentQ === 0}>Previous</button>
        {currentQ < questions.length - 1 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>

      {showWarning && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%",
          background: "#ffe6e6", padding: "1rem", textAlign: "center",
          zIndex: 9999, boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
        }}>
          <strong>⚠️ You exited fullscreen!</strong><br />
          Re-enter fullscreen in <strong>{countdown}</strong> seconds or the quiz will be submitted.
          <div style={{ marginTop: "0.5rem" }}>
            <button onClick={enterFullscreenAndStart} className="fullscreen-warning-btn">
  Re-enter Fullscreen
</button>
<button onClick={handleSubmit} className="fullscreen-warning-btn">
  Submit Now
</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
