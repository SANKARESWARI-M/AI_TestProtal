import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function QuizResult() {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeTaken, setTimeTaken] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  const userId = location.state?.userId || "guest";

  // Fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quiz/${quizId}`);
        if (res.data.success) {
          setQuiz(res.data.quiz);
        } else {
          console.error("Quiz fetch failed");
        }
      } catch (err) {
        console.error("Error loading quiz:", err.message);
      }
    };

    fetchQuiz();

    // Get data passed from quiz page
    if (location.state) {
      setUserAnswers(location.state.answers || []);
      setTimeTaken(location.state.timeTaken || 0);
    }
  }, [quizId, location.state]);

  // Submit result
  useEffect(() => {
    if (quiz && userAnswers.length && !isSubmitted) {
      const resultData = {
        userId,
        quizId,
        userAnswers: quiz.questions.map((q, i) => ({
          questionIndex: i,
          selectedOption: userAnswers[i],
          isCorrect: userAnswers[i] === q.answer,
        })),
        score: getScore(),
        timeTaken,
      };

      axios
        .post("http://localhost:5000/api/quiz-results/submit", resultData)
        .then((res) => {
          if (res.data.success) {
            setIsSubmitted(true);
          }
        })
        .catch((err) => {
          console.error("Failed to submit quiz:", err.message);
        });
    }
  }, [quiz, userAnswers, isSubmitted, timeTaken, userId]);

  // // Fetch feedback
  // useEffect(() => {
  //   if (quiz && userAnswers.length) {
  //     setLoadingFeedback(true);
  //     axios
  //       .post("http://localhost:5000/api/quiz/feedback", {
  //         quiz: quiz.questions,
  //         userAnswers: userAnswers.reduce((acc, answer, index) => {
  //           acc[index] = answer;
  //           return acc;
  //         }, {}),
  //       })
  //       .then((res) => {
  //         console.log("🧠 AI Feedback response:", res.data);
  //         if (res.data.success) {
  //           setFeedback(res.data.feedback);
  //         } else {
  //           console.warn("Feedback fetch returned success: false");
  //         }
  //       })
  //       .catch((err) => {
  //         console.error("AI Feedback error:", err.message);
  //       })
  //       .finally(() => setLoadingFeedback(false));
  //   }
  // }, [quiz, userAnswers]);

  const getScore = () => {
    if (!quiz || !quiz.questions) return 0;
    return quiz.questions.reduce((acc, q, i) => {
      return acc + (userAnswers[i] === q.answer ? 1 : 0);
    }, 0);
  };

  const formatTime = (seconds) => {
    if (seconds == null) return "N/A";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (!quiz) return <div>Loading quiz result...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <button onClick={() => navigate("/home")} style={{ marginBottom: "1rem" }}>
        ← Back to Home
      </button>
      <h2>Quiz Result</h2>
      <p><strong>Topic:</strong> {quiz.topic}</p>
      <p><strong>Level:</strong> {quiz.level}</p>
      <p><strong>Time Taken:</strong> {formatTime(timeTaken)}</p>
      <p><strong>Score:</strong> {getScore()} / {quiz.questions.length}</p>

      {quiz.questions.map((q, i) => {
        const selected = userAnswers[i];
        const isCorrect = selected === q.answer;

        return (
          <div
            key={i}
            style={{
              backgroundColor: isCorrect ? "#e6ffe6" : "#ffe6e6",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              border: "1px solid #ccc"
            }}
          >
            <p><strong>Q{i + 1}:</strong> {q.question}</p>
            <p><strong>Your Answer:</strong> {selected ? `${selected}. ${q.options[selected]}` : "No Answer"}</p>
            <p><strong>Correct Answer:</strong> {q.answer}. {q.options[q.answer]}</p>
            <p style={{ color: isCorrect ? "green" : "red" }}>
              {isCorrect ? "✔ Correct" : "✘ Incorrect"}
            </p>
          </div>
        );
      })}

      <div style={{ marginTop: "2rem", padding: "1rem", background: "#f5f5f5", borderRadius: "8px" }}>
        <h3>🧠 AI Feedback</h3>
        {loadingFeedback ? (
          <p>Analyzing your performance...</p>
        ) : feedback && Array.isArray(feedback.feedback) ? (
          <>
            {feedback.feedback.map((f, i) => (
              <div key={i} style={{ marginBottom: "1rem" }}>
                <p><strong>Q:</strong> {f.question}</p>
                <p><strong>Your Answer:</strong> {f.userAnswer}</p>
                <p><strong>Correct Answer:</strong> {f.correctAnswer}</p>
                <p><strong>Explanation:</strong> {f.explanation}</p>
              </div>
            ))}
            {feedback.overall && (
              <p><strong>📌 Overall:</strong> {feedback.overall}</p>
            )}
          </>
        ) : (
          <p>No feedback available.</p>
        )}
      </div>
    </div>
  );
}

export default QuizResult;



// import React, { useEffect, useState } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";

// function QuizResult() {
//   const { quizId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [quiz, setQuiz] = useState(null);
//   const [userAnswers, setUserAnswers] = useState([]);
//   const [timeTaken, setTimeTaken] = useState(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const userId = location.state?.userId || "dummyUser"; // Replace with real userId logic

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/quiz/${quizId}`);
//         if (res.data.success) {
//           setQuiz(res.data.quiz);
//         } else {
//           console.error("Quiz fetch failed: success false");
//         }
//       } catch (err) {
//         console.error("Failed to load quiz:", err.message);
//       }
//     };

//     fetchQuiz();

//     if (location.state) {
//       setUserAnswers(location.state.answers || []);
//       setTimeTaken(location.state.timeTaken || 0);
//     }
//   }, [quizId, location.state]);

//   useEffect(() => {
//     console.log("Submitting result...");
//     if (quiz && userAnswers.length && !isSubmitted) {
//       const resultData = {
//         userId,
//         quizId,
//         userAnswers: quiz.questions.map((q, i) => ({
//           questionIndex: i,
//           selectedOption: userAnswers[i],
//           isCorrect: userAnswers[i] === q.answer,
//         })),
//         score: getScore(),
//         timeTaken,
//       };

//       console.log("Submitting resultData to server:", resultData);

//       axios.post("http://localhost:5000/api/quiz-results/submit", resultData)
//         .then(res => {
//           console.log("Server response:", res.data);
//           if (res.data.success) {
//             console.log("✅ Result stored successfully in database.");
//             setIsSubmitted(true);
//           } else {
//             console.warn("⚠️ Result submission failed: success false");
//           }
//         })
//         .catch(err => {
//           console.error("❌ Failed to submit result:", err.message);
//         });
//     }
//   }, [quiz, userAnswers, timeTaken, isSubmitted]);

//   const formatTime = (seconds) => {
//     if (seconds == null) return "N/A";
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//   };

//   const getScore = () => {
//     let score = 0;
//     if (!quiz || !quiz.questions) return 0;
//     quiz.questions.forEach((q, i) => {
//       if (userAnswers[i] === q.answer) score++;
//     });
//     return score;
//   };

//   if (!quiz) return <div>Loading...</div>;

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <button onClick={()=>navigate("/home")}>back</button>
//       <h2>Quiz Result ✅</h2>
//       <h3>Topic: {quiz.topic}</h3>
//       <h4>Level: {quiz.level}</h4>
//       <h4>Time Taken: {formatTime(timeTaken)}</h4>
//       <h4>Your Score: {getScore()} / {quiz.questions.length}</h4>

//       {quiz.questions.map((q, index) => {
//         const selected = userAnswers[index];
//         const isCorrect = selected === q.answer;

//         return (
//           <div
//             key={index}
//             style={{
//               margin: "1rem 0",
//               padding: "1rem",
//               border: "1px solid #ccc",
//               borderRadius: "8px",
//               backgroundColor: isCorrect ? "#e6ffe6" : "#ffe6e6",
//             }}
//           >
//             <p><strong>Q{index + 1}:</strong> {q.question}</p>
//             <p>
//               <strong>Your Answer:</strong>{" "}
//               {selected !== undefined
//                 ? `${selected}. ${q.options[selected]}`
//                 : "No answer selected"}
//             </p>
//             <p>
//               <strong>Correct Answer:</strong>{" "}
//               {q.answer}. {q.options[q.answer]}
//             </p>
//             <p style={{ color: isCorrect ? "green" : "red" }}>
//               {isCorrect ? "✅ Correct" : "❌ Incorrect"}
//             </p>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default QuizResult;
