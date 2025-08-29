
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, ThumbsUp, ThumbsDown, Brain, BookOpen, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { dataService } from "@/services/dataService";

interface Flashcard {
  id: number;
  front: string;
  back: string;
  difficulty: "Easy" | "Medium" | "Hard";
  subject: string;
  learned: boolean;
}

const FlashcardMode = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studySession, setStudySession] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: 1,
      front: "What is useState in React?",
      back: "useState is a Hook that lets you add React state to functional components. It returns an array with two elements: the current state value and a function that lets you update it.",
      difficulty: "Easy",
      subject: "React",
      learned: false
    },
    {
      id: 2,
      front: "Explain the difference between SQL JOIN types",
      back: "INNER JOIN returns only matching records from both tables. LEFT JOIN returns all records from the left table and matching records from the right. RIGHT JOIN is the opposite of LEFT JOIN. FULL OUTER JOIN returns all records when there's a match in either table.",
      difficulty: "Hard",
      subject: "SQL",
      learned: false
    },
    {
      id: 3,
      front: "What is the purpose of indexing in databases?",
      back: "Database indexing improves query performance by creating a data structure that allows faster data retrieval. It works like a book index - instead of scanning every page, you can quickly locate information using the index.",
      difficulty: "Medium",
      subject: "Database",
      learned: false
    },
    {
      id: 4,
      front: "Define REST API principles",
      back: "REST (Representational State Transfer) principles include: 1) Stateless communication, 2) Uniform interface, 3) Client-server architecture, 4) Cacheable responses, 5) Layered system, 6) Code on demand (optional).",
      difficulty: "Medium",
      subject: "Web Development",
      learned: false
    },
    {
      id: 5,
      front: "What is the Virtual DOM?",
      back: "The Virtual DOM is a JavaScript representation of the real DOM. React uses it to optimize rendering by comparing the virtual DOM with the previous version and only updating the parts that have changed.",
      difficulty: "Medium",
      subject: "React",
      learned: false
    },
    {
      id: 6,
      front: "What is async/await in JavaScript?",
      back: "async/await is a syntax that makes it easier to work with Promises. The async keyword makes a function return a Promise, and await pauses the function execution until the Promise resolves.",
      difficulty: "Medium",
      subject: "JavaScript",
      learned: false
    }
  ]);

  useEffect(() => {
    loadFlashcardProgress();
  }, []);

  const loadFlashcardProgress = async () => {
    try {
      const progress = await dataService.getFlashcardProgress();
      const updatedCards = flashcards.map(card => {
        const cardProgress = progress.find(p => p.card_id === card.id.toString());
        return cardProgress ? { ...card, learned: cardProgress.learned } : card;
      });
      setFlashcards(updatedCards);
    } catch (error) {
      console.error('Error loading flashcard progress:', error);
    }
  };

  const currentFlashcard = flashcards[currentCard];
  const progressPercentage = ((currentCard + 1) / flashcards.length) * 100;
  const learnedCount = flashcards.filter(card => card.learned).length;

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCardResult = async (isCorrect: boolean) => {
    if (!isFlipped) {
      toast.error("Please flip the card first to see the answer!");
      return;
    }

    const newFlashcards = [...flashcards];
    if (isCorrect) {
      newFlashcards[currentCard].learned = true;
      setStudySession(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
      toast.success("Great! Card marked as learned! 🎉");
    } else {
      newFlashcards[currentCard].learned = false;
      setStudySession(prev => ({ ...prev, incorrect: prev.incorrect + 1, total: prev.total + 1 }));
      toast.error("Keep practicing this one! 📚");
    }
    
    setFlashcards(newFlashcards);

    // Save progress to database
    try {
      await dataService.updateFlashcardProgress({
        card_id: currentFlashcard.id.toString(),
        learned: isCorrect,
        review_count: 1,
        user_id: null // For now, anonymous users
      });
    } catch (error) {
      console.error('Error saving flashcard progress:', error);
    }

    nextCard();
  };

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    } else {
      toast.success(`Study session complete! You've learned ${learnedCount + 1} out of ${flashcards.length} cards.`);
      setCurrentCard(0);
      setIsFlipped(false);
    }
  };

  const resetSession = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setStudySession({ correct: 0, incorrect: 0, total: 0 });
    const resetCards = flashcards.map(card => ({ ...card, learned: false }));
    setFlashcards(resetCards);
    toast.success("Study session reset!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Flashcard Study Mode</h2>
          <p className="text-muted-foreground">Master concepts with spaced repetition learning</p>
        </div>
        <Button onClick={resetSession} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Session
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-500/10">
          <CardContent className="pt-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-600">{currentCard + 1}/{flashcards.length}</div>
            <div className="text-sm text-muted-foreground">Current Card</div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-500/10">
          <CardContent className="pt-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">{learnedCount}</div>
            <div className="text-sm text-muted-foreground">Learned</div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-500/10">
          <CardContent className="pt-4 text-center">
            <ThumbsUp className="w-8 h-8 mx-auto text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-purple-600">{studySession.correct}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-500/10">
          <CardContent className="pt-4 text-center">
            <Brain className="w-8 h-8 mx-auto text-orange-600 mb-2" />
            <div className="text-2xl font-bold text-orange-600">{Math.round((learnedCount / flashcards.length) * 100)}%</div>
            <div className="text-sm text-muted-foreground">Mastery</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <div className="relative">
        <Card className={`min-h-[400px] cursor-pointer transition-all duration-500 transform-gpu ${isFlipped ? 'rotate-y-180' : ''}`} onClick={flipCard}>
          <CardContent className="p-8 h-full flex flex-col justify-center">
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant={currentFlashcard.difficulty === "Easy" ? "secondary" : currentFlashcard.difficulty === "Medium" ? "default" : "destructive"}>
                {currentFlashcard.difficulty}
              </Badge>
              <Badge variant="outline">{currentFlashcard.subject}</Badge>
              {currentFlashcard.learned && (
                <Badge className="bg-green-500/20 text-green-700 border-green-500/50">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Learned
                </Badge>
              )}
            </div>

            {!isFlipped ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wide text-muted-foreground mb-4">Question</h3>
                  <p className="text-2xl font-medium leading-relaxed">{currentFlashcard.front}</p>
                </div>
                <p className="text-sm text-muted-foreground">Click to reveal answer</p>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wide text-muted-foreground mb-4">Answer</h3>
                  <p className="text-lg leading-relaxed">{currentFlashcard.back}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isFlipped && (
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => handleCardResult(false)} 
            variant="outline" 
            size="lg"
            className="flex-1 max-w-xs border-red-200 text-red-600 hover:bg-red-50"
          >
            <ThumbsDown className="w-5 h-5 mr-2" />
            Need More Practice
          </Button>
          <Button 
            onClick={() => handleCardResult(true)} 
            size="lg"
            className="flex-1 max-w-xs bg-green-600 hover:bg-green-700"
          >
            <ThumbsUp className="w-5 h-5 mr-2" />
            Got It Right!
          </Button>
        </div>
      )}

      {!isFlipped && (
        <div className="text-center">
          <Button onClick={flipCard} size="lg" className="px-8">
            <RotateCcw className="w-5 h-5 mr-2" />
            Flip Card
          </Button>
        </div>
      )}
    </div>
  );
};

export default FlashcardMode;
