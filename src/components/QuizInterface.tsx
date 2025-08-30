import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Brain, Trophy } from "lucide-react";
import { toast } from "sonner";
import { fetchQuestions, saveQuizAttempt, updateUserProgress, Question } from "@/services/dataService";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

const QuizInterface = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (!showResult && !quizComplete && timeLeft > 0 && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && questions.length > 0) {
      handleSubmitAnswer();
    }
  }, [timeLeft, showResult, quizComplete, questions.length]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedQuestions = await fetchQuestions();
      if (fetchedQuestions.length > 0) {
        // Shuffle and take first 10 questions
        const shuffled = fetchedQuestions.sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 10));
      } else {
        setError("No questions are available at the moment. Please try again later.");
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setError("Failed to load questions. Please check your connection and try again.");
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null && timeLeft > 0) {
      toast.error("Please select an answer first!");
      return;
    }

    setShowResult(true);
    
    const isCorrect = selectedAnswer === questions[currentQuestion].correct_answer;
    if (isCorrect) {
      setScore(score + 1);
      toast.success("Correct! Well done! 🎉");
    } else {
      toast.error("Incorrect. Check the explanation below.");
    }

    // Update user progress
    await updateProgress(isCorrect);
  };

  const updateProgress = async (isCorrect: boolean) => {
    try {
      const currentQ = questions[currentQuestion];
      await updateUserProgress({
        subject: currentQ.subject,
        questions_answered: 1,
        correct_answers: isCorrect ? 1 : 0,
        total_study_time: Math.ceil((30 - timeLeft) / 60),
        streak_days: 1,
        user_id: null
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const finalScore = score + (selectedAnswer === questions[currentQuestion].correct_answer ? 1 : 0);
    
    try {
      await saveQuizAttempt({
        score: finalScore,
        total_questions: questions.length,
        time_taken: (questions.length * 30) - timeLeft,
        subject: questions[0]?.subject || 'Mixed',
        user_id: null
      });
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }

    setQuizComplete(true);
    toast.success(`Quiz completed! Your score: ${finalScore}/${questions.length}`);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(30);
    setQuizComplete(false);
    loadQuestions();
  };

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          <LoadingSpinner size="lg" className="mx-auto" />
          <p className="text-muted-foreground">Loading quiz questions...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Failed to Load Quiz"
        message={error}
        onRetry={loadQuestions}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <ErrorMessage 
        title="No Questions Available"
        message="We couldn't find any questions for the quiz. Please try again later."
        onRetry={loadQuestions}
      />
    );
  }

  const currentQ = questions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  if (quizComplete) {
    const finalScore = score + (selectedAnswer === questions[currentQuestion].correct_answer ? 1 : 0);
    const percentage = Math.round((finalScore / questions.length) * 100);
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Quiz Complete! 🎉</CardTitle>
          <CardDescription>Here's how you performed</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10">
              <div className="text-2xl font-bold text-green-600">{finalScore}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="p-4 rounded-lg bg-red-500/10">
              <div className="text-2xl font-bold text-red-600">{questions.length - finalScore}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10">
              <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Performance Rating</span>
              <span className="font-medium">
                {percentage >= 80 ? "Excellent! 🌟" : percentage >= 60 ? "Good! 👍" : "Keep Practicing! 📚"}
              </span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          <Button onClick={resetQuiz} size="lg" className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Interactive Quiz</h2>
          <p className="text-muted-foreground">Test your knowledge with {questions.length} questions</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {timeLeft}s
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Score: {score}/{questions.length}</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant={currentQ.difficulty === "Easy" ? "secondary" : currentQ.difficulty === "Medium" ? "default" : "destructive"}>
              {currentQ.difficulty}
            </Badge>
            <Badge variant="outline">{currentQ.subject}</Badge>
          </div>
          <CardTitle className="text-xl leading-relaxed">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`justify-start h-auto p-4 text-left whitespace-normal ${
                  showResult && index === currentQ.correct_answer
                    ? "bg-green-500/20 border-green-500 text-green-700"
                    : showResult && selectedAnswer === index && index !== currentQ.correct_answer
                    ? "bg-red-500/20 border-red-500 text-red-700"
                    : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && index === currentQ.correct_answer && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {showResult && selectedAnswer === index && index !== currentQ.correct_answer && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </Button>
            ))}
          </div>

          {showResult && (
            <div className="mt-6 p-4 rounded-lg bg-muted/50">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium mb-2">Explanation:</h4>
                  <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {!showResult ? (
              <Button onClick={handleSubmitAnswer} className="flex-1">
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="flex-1">
                {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizInterface;
