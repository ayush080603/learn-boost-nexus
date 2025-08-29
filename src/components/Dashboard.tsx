
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Target, Clock, Brain, Trophy, BookOpen, Zap } from "lucide-react";
import { dataService } from "@/services/dataService";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    weeklyProgress: [
      { day: "Mon", quizzes: 0, flashcards: 0, score: 0 },
      { day: "Tue", quizzes: 0, flashcards: 0, score: 0 },
      { day: "Wed", quizzes: 0, flashcards: 0, score: 0 },
      { day: "Thu", quizzes: 0, flashcards: 0, score: 0 },
      { day: "Fri", quizzes: 0, flashcards: 0, score: 0 },
      { day: "Sat", quizzes: 0, flashcards: 0, score: 0 },
      { day: "Sun", quizzes: 0, flashcards: 0, score: 0 }
    ],
    subjectPerformance: [],
    stats: {
      overallScore: "0%",
      studyStreak: "0 days",
      totalStudyTime: "0h",
      cardsMastered: "0"
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [quizAttempts, userProgress, flashcardProgress] = await Promise.all([
        dataService.getQuizAttempts(),
        dataService.getUserProgress(),
        dataService.getFlashcardProgress()
      ]);

      // Calculate subject performance
      const subjectPerformance = userProgress.map(progress => ({
        subject: progress.subject,
        score: progress.questions_answered > 0 
          ? Math.round((progress.correct_answers / progress.questions_answered) * 100) 
          : 0,
        color: getSubjectColor(progress.subject)
      }));

      // Calculate overall stats
      const totalQuestions = userProgress.reduce((sum, p) => sum + p.questions_answered, 0);
      const totalCorrect = userProgress.reduce((sum, p) => sum + p.correct_answers, 0);
      const totalStudyTime = userProgress.reduce((sum, p) => sum + p.total_study_time, 0);
      const maxStreak = Math.max(...userProgress.map(p => p.streak_days), 0);
      const learnedCards = flashcardProgress.filter(fp => fp.learned).length;

      const overallScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      // Generate mock weekly data based on real data
      const weeklyProgress = [
        { day: "Mon", quizzes: Math.floor(quizAttempts.length * 0.1), flashcards: Math.floor(learnedCards * 0.15), score: Math.max(overallScore - 5, 70) },
        { day: "Tue", quizzes: Math.floor(quizAttempts.length * 0.12), flashcards: Math.floor(learnedCards * 0.12), score: Math.max(overallScore - 3, 75) },
        { day: "Wed", quizzes: Math.floor(quizAttempts.length * 0.18), flashcards: Math.floor(learnedCards * 0.2), score: Math.max(overallScore + 2, 80) },
        { day: "Thu", quizzes: Math.floor(quizAttempts.length * 0.08), flashcards: Math.floor(learnedCards * 0.08), score: Math.max(overallScore - 2, 78) },
        { day: "Fri", quizzes: Math.floor(quizAttempts.length * 0.2), flashcards: Math.floor(learnedCards * 0.25), score: Math.max(overallScore + 5, 85) },
        { day: "Sat", quizzes: Math.floor(quizAttempts.length * 0.15), flashcards: Math.floor(learnedCards * 0.18), score: Math.max(overallScore, 82) },
        { day: "Sun", quizzes: Math.floor(quizAttempts.length * 0.1), flashcards: Math.floor(learnedCards * 0.1), score: Math.max(overallScore - 1, 80) }
      ];

      setDashboardData({
        weeklyProgress,
        subjectPerformance,
        stats: {
          overallScore: `${overallScore}%`,
          studyStreak: `${maxStreak} days`,
          totalStudyTime: `${Math.round(totalStudyTime / 60)}h`,
          cardsMastered: learnedCards.toString()
        }
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'React': '#3B82F6',
      'SQL': '#10B981',
      'Database': '#F59E0B',
      'Web Development': '#EF4444',
      'JavaScript': '#8B5CF6',
      'CSS': '#EC4899'
    };
    return colors[subject as keyof typeof colors] || '#6B7280';
  };

  const stats = [
    {
      title: "Overall Score",
      value: dashboardData.stats.overallScore,
      change: "+5%",
      trend: "up",
      icon: Target,
      description: "Average across all subjects"
    },
    {
      title: "Study Streak",
      value: dashboardData.stats.studyStreak,
      change: "+3 days",
      trend: "up",
      icon: Zap,
      description: "Current consecutive study days"
    },
    {
      title: "Total Study Time",
      value: dashboardData.stats.totalStudyTime,
      change: "+6h",
      trend: "up",
      icon: Clock,
      description: "This month"
    },
    {
      title: "Cards Mastered",
      value: dashboardData.stats.cardsMastered,
      change: "+12",
      trend: "up",
      icon: Brain,
      description: "Flashcards learned"
    }
  ];

  const achievements = [
    { title: "Quiz Master", description: "Complete 50 quizzes", progress: 84, icon: "🏆" },
    { title: "Streak Keeper", description: "Study 30 days in a row", progress: 50, icon: "🔥" },
    { title: "Perfect Score", description: "Get 100% on 5 quizzes", progress: 60, icon: "💯" },
    { title: "Subject Expert", description: "Master all React concepts", progress: 92, icon: "🧠" }
  ];

  const studyStreak = [
    { month: "Jan", days: 18 },
    { month: "Feb", days: 22 },
    { month: "Mar", days: 25 },
    { month: "Apr", days: 28 },
    { month: "May", days: 30 },
    { month: "Jun", days: 26 }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <p className="text-muted-foreground">Track your learning progress and identify improvement areas</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          Level 12 Learner
        </Badge>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <stat.icon className="w-8 h-8 text-primary" />
                <Badge variant={stat.trend === "up" ? "default" : "secondary"} className="text-xs">
                  {stat.trend === "up" ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Weekly Activity
            </CardTitle>
            <CardDescription>Quiz attempts and flashcard reviews this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              quizzes: { label: "Quizzes", color: "hsl(var(--primary))" },
              flashcards: { label: "Flashcards", color: "hsl(var(--secondary))" }
            }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dashboardData.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="quizzes" fill="var(--color-quizzes)" />
                  <Bar dataKey="flashcards" fill="var(--color-flashcards)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Score Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Score Trend
            </CardTitle>
            <CardDescription>Your average quiz scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              score: { label: "Score %", color: "hsl(var(--primary))" }
            }}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dashboardData.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="var(--color-score)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--color-score)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>Your mastery level across different topics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.subjectPerformance.length > 0 ? (
              dashboardData.subjectPerformance.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{subject.subject}</span>
                    <span className="text-sm text-muted-foreground">{subject.score}%</span>
                  </div>
                  <Progress value={subject.score} className="h-2" />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Complete some quizzes to see your subject performance!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Achievements
            </CardTitle>
            <CardDescription>Your learning milestones and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    </div>
                  </div>
                  <Badge variant="outline">{achievement.progress}%</Badge>
                </div>
                <Progress value={achievement.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Study Streak Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Study Consistency
          </CardTitle>
          <CardDescription>Your study streak over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            days: { label: "Study Days", color: "hsl(var(--primary))" }
          }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={studyStreak}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="days" 
                  fill="var(--color-days)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
