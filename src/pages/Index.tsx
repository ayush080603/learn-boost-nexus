import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, BookOpen, BarChart3, Users, Settings, Brain, Target, Trophy, Zap } from "lucide-react";
import QuizInterface from "@/components/QuizInterface";
import FlashcardMode from "@/components/FlashcardMode";
import Dashboard from "@/components/Dashboard";
import AdminPanel from "@/components/AdminPanel";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { makeUserAdmin } from "@/services/dataService";

const Index = () => {
  const [activeMode, setActiveMode] = useState<'home' | 'quiz' | 'flashcards' | 'dashboard' | 'admin'>('home');
  const { user, isAdmin } = useAuth();

  const stats = [
    { icon: Brain, label: "Active Learners", value: "2,847", color: "text-blue-600" },
    { icon: Target, label: "Questions Solved", value: "45,291", color: "text-green-600" },
    { icon: Trophy, label: "Completion Rate", value: "87%", color: "text-purple-600" },
    { icon: Zap, label: "Average Score", value: "78%", color: "text-orange-600" }
  ];

  const features = [
    {
      icon: Play,
      title: "Interactive Quizzes",
      description: "Test your knowledge with timed quizzes across multiple subjects",
      badge: "Popular"
    },
    {
      icon: BookOpen,
      title: "Flashcard Learning",
      description: "Master concepts with spaced repetition and active recall techniques",
      badge: "New"
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Track your learning journey with detailed performance insights",
      badge: "Pro"
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Collaborate with peers and share knowledge in study communities",
      badge: "Coming Soon"
    }
  ];

  if (activeMode === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Button 
                variant="ghost" 
                onClick={() => setActiveMode('home')}
                className="font-bold text-xl"
              >
                ← LearnHub
              </Button>
              <UserMenu />
            </div>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-8">
          <QuizInterface />
        </div>
      </div>
    );
  }

  if (activeMode === 'flashcards') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Button 
                variant="ghost" 
                onClick={() => setActiveMode('home')}
                className="font-bold text-xl"
              >
                ← LearnHub
              </Button>
              <UserMenu />
            </div>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-8">
          <FlashcardMode />
        </div>
      </div>
    );
  }

  if (activeMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Button 
                variant="ghost" 
                onClick={() => setActiveMode('home')}
                className="font-bold text-xl"
              >
                ← LearnHub
              </Button>
              <UserMenu />
            </div>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-8">
          <Dashboard />
        </div>
      </div>
    );
  }

  if (activeMode === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Button 
                variant="ghost" 
                onClick={() => setActiveMode('home')}
                className="font-bold text-xl"
              >
                ← LearnHub
              </Button>
              <UserMenu />
            </div>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-8">
          <AdminPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LearnHub
              </h1>
              <div className="hidden md:flex space-x-6">
                <Button variant="ghost" onClick={() => setActiveMode('quiz')}>
                  <Play className="w-4 h-4 mr-2" />
                  Quiz
                </Button>
                <Button variant="ghost" onClick={() => setActiveMode('flashcards')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Flashcards
                </Button>
                {user && (
                  <Button variant="ghost" onClick={() => setActiveMode('dashboard')}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                )}
                {isAdmin && (
                  <Button variant="ghost" onClick={() => setActiveMode('admin')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
              </div>
            </div>
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            ✨ B.Tech Final Year Project by Ayush Sinha
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Master Your Skills with
            <br />Interactive Learning
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Elevate your knowledge with our comprehensive platform featuring quizzes, flashcards, 
            and detailed analytics. Perfect for students, professionals, and lifelong learners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setActiveMode('quiz')} className="text-lg px-8 py-6">
              <Play className="w-5 h-5 mr-2" />
              Start Learning Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => setActiveMode('flashcards')} className="text-lg px-8 py-6">
              <BookOpen className="w-5 h-5 mr-2" />
              Try Flashcards
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Learning Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to accelerate your learning journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                {feature.badge && (
                  <Badge 
                    variant={feature.badge === "Popular" ? "default" : "secondary"} 
                    className="absolute top-4 right-4 z-10"
                  >
                    {feature.badge}
                  </Badge>
                )}
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners who are already mastering new skills with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => setActiveMode('quiz')} className="text-lg px-8 py-6">
              Start Your First Quiz
            </Button>
            {user && (
              <Button size="lg" variant="outline" onClick={() => setActiveMode('dashboard')} className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-purple-600">
                View Your Progress
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">LearnHub</h3>
          <p className="text-gray-400 mb-6">
            Empowering learners worldwide with interactive education technology.
          </p>
          <p className="text-sm text-gray-500">
            © 2024 LearnHub - B.Tech Final Year Project by Ayush Sinha. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
