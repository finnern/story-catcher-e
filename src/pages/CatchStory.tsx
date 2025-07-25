
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Zap, Users, CheckCircle, ChevronDown, ChevronUp, Mic, MicOff, Square, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export default function CatchStory() {
  const [storyPrompt, setStoryPrompt] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyDescription, setStoryDescription] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const navigate = useNavigate();
  
  // Use the new robust speech recognition hook
  const { 
    isRecording, 
    isLoading, 
    startRecording, 
    stopRecording, 
    transcript, 
    error 
  } = useSpeechRecognition();

  // Update storyPrompt when transcript changes
  useEffect(() => {
    if (transcript && transcript !== storyPrompt) {
      setStoryPrompt(prev => prev + ' ' + transcript);
    }
  }, [transcript]);

  const handleVoiceRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const handleCatchStory = () => {
    if (storyPrompt.trim() || storyTitle.trim()) {
      // For now, navigate to dashboard - in a real app this would create the story
      navigate('/dashboard');
    }
  };

  const memoryPrompts = [
    "What's a moment that changed you?",
    "What story wants to be told?",
    "Remember a choice you made that mattered?",
    "What experience shaped who you are?",
    "What's something only you could share?"
  ];

  const [currentPrompt] = useState(memoryPrompts[Math.floor(Math.random() * memoryPrompts.length)]);

  const features = [
    {
      icon: BookOpen,
      title: 'Your Story Matters',
      description: 'Every experience has value - we help you discover it'
    },
    {
      icon: Zap,
      title: 'Start Simply',
      description: 'Begin with just a thought - we guide you from there'
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
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground"
            >
              Dashboard
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
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Every story matters. Every perspective is unique. Start with whatever comes to mind.
          </p>
          <p className="text-sm text-muted-foreground/80 mb-12">
            No pressure - just begin with what feels right
          </p>

          {/* Simplified Story Prompt */}
          <Card className="max-w-lg mx-auto mb-8 border-primary/20 shadow-elegant">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-primary">{currentPrompt}</CardTitle>
              <CardDescription>
                Share your story
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Type here or use voice recording..."
                value={storyPrompt}
                onChange={(e) => setStoryPrompt(e.target.value)}
                className="text-lg py-4 border-2 focus:border-primary/50 min-h-[120px] resize-none"
                rows={4}
              />
              
              {isRecording && (
                <div className="flex items-center justify-center gap-2 text-red-600 animate-pulse">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                  <span className="text-sm font-medium">Recording... Speak now</span>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleVoiceRecording}
                  variant="record"
                  size="round"
                  className={`flex-1 text-lg py-8 text-white rounded-full transition-all ${
                    isRecording ? 'animate-pulse bg-red-600 hover:bg-red-700' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                      Loading AI...
                    </>
                  ) : isRecording ? (
                    <>
                      <Square className="h-6 w-6 mr-3" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-6 w-6 mr-3" />
                      Record Story
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleCatchStory}
                  variant="secondary"
                  size="round"
                  className="px-6 text-lg py-8 rounded-full"
                  disabled={!storyPrompt.trim()}
                >
                  Submit
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                ✨ Your story is safe with us
              </p>
            </CardContent>
          </Card>

          {/* Simplified Features */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-lift transition-smooth border-primary/10">
                <CardContent className="pt-6">
                  <feature.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Encouraging Community Hint */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Join thousands sharing their unique perspectives
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 px-6">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            Every story begins with a single moment of courage
          </p>
        </div>
      </footer>
    </div>
  );
}
