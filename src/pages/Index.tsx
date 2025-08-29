import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, BarChart3, Target, Users, Trophy, Play, CreditCard, Sparkles } from "lucide-react";
import QuizInterface from "@/components/QuizInterface";
import FlashcardMode from "@/components/FlashcardMode";
import Dashboard from "@/components/Dashboard";
import { dataService } from "@/services/dataService";
import LoadingSpinner from "@/components/LoadingSpinner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    activeUsers: "10K+",
    completionRate: "94%",
    averageImprovement: "+23%"
  });
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const realStats = await dataService.getStats();
      setStats(realStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      // Keep default stats if error occurs
    } finally {
      setStatsLoading(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "Interactive Quizzes",
      description: "Multiple choice questions with instant feedback and detailed explanations",
    },
    {
      icon: CreditCard,
      title: "Smart Flashcards",
      description: "Spaced repetition algorithm helps you learn more efficiently and retain knowledge",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track your progress with detailed charts and insights into your learning patterns",
    },
    {
      icon: Target,
      title: "Personalized Learning",
      description: "Adaptive difficulty and subject-focused content to match your learning goals",
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
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              LearnBoost Nexus
            </h1>
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Your AI-Powered Learning Platform with Interactive Quizzes, Smart Flashcards & Real-time Analytics
          </p>
          <div className="flex gap-2 justify-center flex-wrap mb-8">
            <Badge variant="secondary" className="px-3 py-1">🎯 Adaptive Learning</Badge>
            <Badge variant="secondary" className="px-3 py-1">📊 Real-time Analytics</Badge>
            <Badge variant="secondary" className="px-3 py-1">🧠 Memory Enhancement</Badge>
            <Badge variant="secondary" className="px-3 py-1">⚡ Instant Feedback</Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Quiz Mode</span>
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Flashcards</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
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
                <Card key={index} className="text-center bg-gradient-to-br from-primary/5 to-blue-500/5 border-2">
                  <CardContent className="pt-6">
                    <stat.icon className="w-8 h-8 mx-auto text-primary mb-4" />
                    <div className="text-3xl font-bold text-primary mb-2">
                      {statsLoading ? <LoadingSpinner size="sm" className="mx-auto" /> : stat.value}
                    </div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-2 border-primary/20">
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-4">Ready to Start Learning?</h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Join thousands of students improving their knowledge with our interactive platform
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button onClick={() => setActiveTab("quiz")} size="lg" className="px-8">
                      <Play className="w-5 h-5 mr-2" />
                      Start Quiz
                    </Button>
                    <Button onClick={() => setActiveTab("flashcards")} variant="outline" size="lg" className="px-8">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Study Flashcards
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    No registration required - start learning immediately!
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Quick Facts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Question Bank:</span>
                    <span className="font-medium">10+ Questions Ready</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subjects Available:</span>
                    <span className="font-medium">React, SQL, JavaScript, CSS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty Levels:</span>
                    <span className="font-medium">Easy, Medium, Hard</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Study Modes:</span>
                    <span className="font-medium">Quiz & Flashcards</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Learning Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Instant feedback on answers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Detailed explanations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Progress tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Timed challenges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Performance analytics</span>
                  </div>
                </CardContent>
              </Card>
            </div>
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
