import "./Home.css";
import logo from "../assets/ai22.png";
import {
  FaRobot,
  FaFileAlt,
  FaClipboardList,
  FaLayerGroup,
} from "react-icons/fa";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

function Home() {
  const [selectedTool, setSelectedTool] = useState("");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [quiz, setQuiz] = useState([]);
const [currentQuestion, setCurrentQuestion] = useState(0);
const [score, setScore] = useState(0);
const [flashcards, setFlashcards] = useState([]);
const [currentCard, setCurrentCard] = useState(0);
const [showResult, setShowResult] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const changeTool = (tool) => {
  setSelectedTool(tool);
  setPrompt("");
  setAnswer("");
  setSummary("");
  setQuiz([]);
  setFlashcards([]);
  setCurrentQuestion(0);
  setCurrentCard(0);
  setSelectedOption("");
  setShowResult(false);
  setShowAnswer(false);
  setScore(0);
};

  const askAI = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/ask-ai", {
        tool: "ask",
        prompt,
      });

      setAnswer(res.data.answer);
      setPrompt("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
const summarizeNotes = async () => {
  if (!prompt.trim()) return;

  setLoading(true);

  try {
    const res = await axios.post("http://localhost:5000/ask-ai", {
      tool: "summary",
      prompt,
    });

    setSummary(res.data.answer);
    setPrompt("");
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
const generateQuiz = async () => {
  if (!prompt.trim()) return;

  setLoading(true);

  try {
    const res = await axios.post("http://localhost:5000/ask-ai", {
      tool: "quiz",
      prompt,
    });

    console.log(res.data.answer);
 

    const data = JSON.parse(res.data.answer);
    console.log("Parsed quiz:", data);
console.log("Length:", data.length);


    setQuiz(data);
    console.log("Quiz state updated");
    console.log("Quiz length:", data.length);
    setCurrentQuestion(0);
    setSelectedOption("");
    setShowResult(false);
    setScore(0);
    setPrompt("");

  } catch (err) {
    console.log(err);

    if (err.response) {
      console.log(err.response.data);
    }
  } finally {
    setLoading(false);
  }
};
const generateFlashcards = async () => {
  if (!prompt.trim()) return;

  setLoading(true);

  try {
    const res = await axios.post("http://localhost:5000/ask-ai", {
      tool: "flashcards",
      prompt,
    });

    const data = JSON.parse(res.data.answer);

    setFlashcards(data);
    setCurrentCard(0);
    setShowAnswer(false);
    setPrompt("");
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="home">
      <div className="hero">
        <div className="logo">
          <img src={logo} alt="Skill'IT AI Logo" />
        </div>

        <h1>Skill'IT AI</h1>

        <p className="subtitle">Your Intelligent Learning Companion</p>

        <p className="tagline">Learn • Ask • Practice • Grow</p>
        <div className="welcome">
          <h2>Welcome !👋</h2>
          <p>Explore AI-powered tools designed to help you study smarter.</p>

          <div className="cards">
            <div className="card" onClick={() => changeTool("ask")}>
              <FaRobot className="icon ai-icon" />
              <h3>Ask AI</h3>
              <p>Ask any study related question.</p>
            </div>

            <div className="card" onClick={() => changeTool("summary")}>
              <FaFileAlt className="icon summary-icon" />
              <h3>Summarize Notes</h3>
              <p>Convert lengthy notes into concise summaries.</p>
            </div>

            <div className="card" onClick={() => changeTool("quiz")}>
              <FaClipboardList className="icon quiz-icon" />
              <h3>Quiz Generator</h3>
              <p>Generate MCQs from any topic.</p>
            </div>

            <div className="card" onClick={() => changeTool("flashcards")}>
              <FaLayerGroup className="icon flashcard-icon" />
              <h3>Flashcards</h3>
              <p>Create revision flashcards instantly.</p>
            </div>
          </div>
          <div className="tool-section">
            {selectedTool === "" && (
              <div className="empty-state">
                <h2>✨ Welcome to Skill'IT AI</h2>

                <p>
                  Select one of the AI tools above to begin your learning
                  journey.
                </p>

                <div className="empty-icons">
                  <span>🤖 Ask AI</span>
                  <span>📄 Summarize</span>
                  <span>📝 Quiz</span>
                  <span>🧠 Flashcards</span>
                </div>
              </div>
            )}

            {selectedTool === "ask" && (
              <div className="tool-card">
                <h2>🤖 Ask AI</h2>

                <p>
                  Ask any study-related question and get AI-powered explanations
                  instantly.
                </p>

                <textarea
                  rows="5"
                  placeholder="Ask anything..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!prompt.trim()) return;
                      askAI();
                    }
                  }}
                ></textarea>
                <button className="ai-btn" onClick={askAI} disabled={loading}>
                  {loading ? "🤖 Thinking..." : "✨ Ask AI"}
                </button>

                {answer && (
                  <div className="response-box">
                    <h3>🤖 Skill'IT AI Response</h3>

                    {loading ? (
                      <p>🤖 Thinking...</p>
                    ) : (
                      <ReactMarkdown>{answer}</ReactMarkdown>
                    )}
                  </div>
                )}
              </div>
            )}
            {selectedTool === "summary" && (
              <div className="tool-card">
                <h2>📄 Notes Summarizer</h2>

                <p>Paste your notes below.</p>
                <textarea
  rows="5"
  placeholder="Paste your notes here..."
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!prompt.trim()) return;
      summarizeNotes();
    }
  }}
></textarea>
                <button
                  className="ai-btn"
                  onClick={summarizeNotes}
                  disabled={loading}
                >
                  {loading ? "Summarizing..." : "📄 Summarize"}
                </button>

                {summary && (
  <div className="response-box">
    <h3>📄 Summary</h3>

    <ReactMarkdown>
      {summary}
    </ReactMarkdown>
  </div>
)}
              </div>
            )}

          {selectedTool === "quiz" && (
  <div className="tool-card">
    <h2>📝 Quiz Generator</h2>

    <p>Enter a topic to generate a quiz.</p>



    <input
      type="text"
      className="topic-input"
      placeholder="Example: React, DBMS, Machine Learning..."
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          generateQuiz();
        }
      }}
    />
<button
  className="ai-btn"
  onClick={generateQuiz}
  disabled={loading}
>
  {loading ? "Generating..." : "📝 Generate Quiz"}
</button>

    {quiz.length > 0 && (
<div className="response-box">

<h3>
Question {currentQuestion + 1}
</h3>

<p>
{quiz[currentQuestion].question}
</p>

{quiz[currentQuestion].options.map((option,index)=>(
<div
key={index}
className={`option ${
selectedOption===option?"selected":""
}`}
onClick={() => {
  if (showResult) return;

  setSelectedOption(option);
  setShowResult(true);

  if (option === quiz[currentQuestion].answer) {
    setScore((prev) => prev + 1);
  }
}}
>
{String.fromCharCode(65+index)}. {option}
</div>
))}

{showResult && (

<div style={{marginTop:"20px"}}>

{selectedOption===quiz[currentQuestion].answer ?

<p style={{color:"green"}}>
✅ Correct!
</p>

:

<p style={{color:"red"}}>
❌ Incorrect! Correct answer is
<strong> {quiz[currentQuestion].answer}</strong>
</p>

}

</div>

)}

</div>
)}
{showResult &&
currentQuestion < quiz.length - 1 && (

<button
className="ai-btn"
onClick={() => {
  setCurrentQuestion(currentQuestion + 1);
  setSelectedOption("");
  setShowResult(false);
}}

>
Next Question →
</button>

)}


{showResult && currentQuestion === quiz.length - 1 && (
  <div className="response-box">
    <h3>🎉 Quiz Completed!</h3>

    <h2>Final Score: {score}/{quiz.length}</h2>

    <button
      className="ai-btn"
      onClick={() => {
  setCurrentQuestion(0);
  setSelectedOption("");
  setShowResult(false);
  setScore(0);
  generateQuiz();
}}
    >
      🔄 Try Again
    </button>
  </div>
)}
   
  </div>
)}
  {selectedTool === "flashcards" && (
  <div className="tool-card">
    <h2>🧠 Flashcards</h2>

    <p>Enter a topic to generate flashcards.</p>

    <input
      type="text"
      className="topic-input"
      placeholder="Example: React, DBMS..."
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          generateFlashcards();
        }
      }}
    />

    <button
      className="ai-btn"
      onClick={generateFlashcards}
      disabled={loading}
    >
      {loading ? "Generating..." : "🧠 Generate Flashcards"}
    </button>

    {flashcards.length > 0 && (
      <div className="flashcard">
        <h3>
          Flashcard {currentCard + 1}
        </h3>

        <p>
          {flashcards[currentCard].question}
        </p>

        {!showAnswer ? (
          <button
            className="ai-btn"
            onClick={() => setShowAnswer(true)}
          >
            Show Answer
          </button>
        ) : (
          <>
            <hr />

            <h3>Answer</h3>

            <p>
              {flashcards[currentCard].answer}
            </p>

          {currentCard === flashcards.length - 1 ? (
  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <h3>🧠 Flashcards Completed!</h3>

    <p style={{ color: "green", fontWeight: "bold" }}>
      🎉 Great Job!
    </p>

    <p>
      You have successfully reviewed all the flashcards.
    </p>

    <button
      className="ai-btn"
      onClick={() => {
        setFlashcards([]);
        setCurrentCard(0);
        setShowAnswer(false);
        setPrompt("");
      }}
    >
      📚 New Topic
    </button>
  </div>
) : (
  <button
    className="ai-btn"
    onClick={() => {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    }}
  >
    Next Card →
  </button>
)}
          </>
        )}
      </div>
    )}
  </div>
)}
          </div>
        </div>
        <footer className="footer">
          <p>Built with ❤️ using React, Express & AI</p>
          <small>© 2026 Skill'IT AI</small>
        </footer>
      </div>
    </div>
  );
}

export default Home;
