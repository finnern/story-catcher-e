import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Zap, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CatchStory() {
  const [storyTitle, setStoryTitle] = useState('');
  const [storyDescription, setStoryDescription] = useState('');
  const navigate = useNavigate();

  const handleCreateStory = () => {
    if (storyTitle.trim()) {
      // For now, navigate to dashboard - in a real app this would create the story
      navigate('/dashboard');
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Storytelling',
      description: 'Create branching narratives with choices and consequences'
    },
    {
      icon: Zap,
      title: 'Real-time Validation',
      description: 'Catch errors instantly as you build your story'
    },
    {
      icon: Users,
      title: 'Character Management',
      description: 'Develop rich characters with dynamic relationships'
    },
    {
      icon: CheckCircle,
      title: 'Export Ready',
      description: 'Generate validated JSON for any platform'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg"></div>
              <span className="text-xl font-semibold text-foreground">Story Catcher</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Catch Your Story
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Transform your narrative ideas into interactive experiences. Create, validate, and export 
            professional story content without the complexity.
          </p>

          {/* Quick Start Form */}
          <Card className="max-w-lg mx-auto mb-16">
            <CardHeader>
              <CardTitle>Start Your First Story</CardTitle>
              <CardDescription>
                Give your story a name and watch it come to life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Story title..."
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                className="text-lg"
              />
              <Textarea
                placeholder="Brief description (optional)..."
                value={storyDescription}
                onChange={(e) => setStoryDescription(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleCreateStory}
                className="w-full text-lg py-6"
                disabled={!storyTitle.trim()}
              >
                Catch This Story
              </Button>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-lift transition-smooth">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 px-6">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            Start crafting your interactive story today
          </p>
        </div>
      </footer>
    </div>
  );
}