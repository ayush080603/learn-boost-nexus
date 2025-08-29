import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, BarChart3, Target, Users, Trophy, Play, CreditCard } from "lucide-react";
import QuizInterface from "@/components/QuizInterface";
import FlashcardMode from "@/components/FlashcardMode";
import Dashboard from "@/components/Dashboard";
import { dataService } from "@/services/dataService";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    activeUsers: "10K+",
    completionRate: "94%",
    averageImprovement: "+23%"
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const realStats = await dataService.getStats();
      setStats(realStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      // Keep default stats if error occurs
    }
  };

  const features = [
    {
      icon: Brain,
      title: "Interactive Quizzes",
      description: "Multiple choice, true/false, and fill-in-the-blank questions with instant feedback",
    },
    {
      icon: CreditCard,
      title: "Smart Flashcards",
      description: "Spaced repetition algorithm helps you learn more efficiently",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track your progress with detailed charts and insights",
    },
    {
      icon: Target,
      title: "Personalized Learning",
      description: "AI-powered recommendations based on your learning patterns",
    },
  ];

  const statsData = [
    { label: "Active Learners", value: stats.activeUsers, icon: Users },
    { label: "Quiz Completion Rate", value: stats.completionRate, icon: Target },
    { label: "Average Score Improvement", value: stats.averageImprovement, icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            LearnBoost Nexus
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Your AI-Powered Learning Platform with Quizzes, Flashcards & Analytics
          </p>
          <div className="flex gap-2 justify-center mb-8">
            <Badge variant="secondary">🎯 Adaptive Learning</Badge>
            <Badge variant="secondary">📊 Real-time Analytics</Badge>
            <Badge variant="secondary">🧠 Memory Enhancement</Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Quiz Mode
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center">
                    <feature.icon className="w-12 h-12 mx-auto text-primary mb-4" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statsData.map((stat, index) => (
                <Card key={index} className="text-center bg-gradient-to-br from-primary/5 to-blue-500/5">
                  <CardContent className="pt-6">
                    <stat.icon className="w-8 h-8 mx-auto text-primary mb-4" />
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-4">Ready to Start Learning?</h3>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of students improving their knowledge with our platform
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => setActiveTab("quiz")} size="lg">
                      Start Quiz
                    </Button>
                    <Button onClick={() => setActiveTab("flashcards")} variant="outline" size="lg">
                      Study Flashcards
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz">
            <QuizInterface />
          </TabsContent>

          <TabsContent value="flashcards">
            <FlashcardMode />
          </TabsContent>

          <TabsContent value="analytics">
            <Dashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
