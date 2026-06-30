import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AskAI from "./pages/AskAI";
import Summary from "./pages/Summary";
import Quiz from "./pages/Quiz";
import Flashcards from "./pages/Flashcards";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ask-ai" element={<AskAI />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/flashcards" element={<Flashcards />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;