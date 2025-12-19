import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignupPage";
import Home from "./components/Home";
import QuizSetup from "./components/QuizSetup";
import Api from "./Api";
import QuizPage from "./components/QuizPage";
import QuizResult from "./components/QuizResult";
import Review from "./components/Review";
import ResetPassword from './components/ResetPassword';
import ProfilePage from "./components/ProfilePage"; 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/landing" element={<div>Landing Page (after login)</div>} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/home" element={<Home />} />
        <Route path="/quiz-setup" element={<QuizSetup />} />
        {/* <Route path="/"element={<Api/>}/> */}
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz-result/:quizId" element={<QuizResult />} />
        <Route path="/quiz-review/:quizId" element={<Review />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
