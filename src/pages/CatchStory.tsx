
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Zap, Users, CheckCircle, ChevronDown, ChevronUp, Mic, MicOff, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function CatchStory() {
  const [storyPrompt, setStoryPrompt] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyDescription, setStoryDescription] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      console.log('Speech recognition is supported');
      
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        
        // Optimized settings for better recognition
        recognitionRef.current.continuous = true; // Keep listening
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US'; // English language
        recognitionRef.current.maxAlternatives = 3; // More alternatives
        
        console.log('Speech recognition initialized with lang:', recognitionRef.current.lang);
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
        setIsSupported(false);
        return;
      }

      recognitionRef.current.onresult = (event: any) => {
        console.log('Speech recognition result received:', event.results.length);
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          console.log(`Result ${i}: "${transcript}" (confidence: ${event.results[i][0].confidence}, final: ${event.results[i].isFinal})`);
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Show real-time transcription with interim results
        if (finalTranscript) {
          console.log('Adding final transcript:', finalTranscript);
          setStoryPrompt(prev => prev + ' ' + finalTranscript);
        }
        
        // Update textarea field with interim results for real-time feedback
        if (interimTranscript && isRecording) {
          console.log('Showing interim transcript:', interimTranscript);
          const currentValue = storyPrompt + ' ' + finalTranscript;
          const tempElement = document.querySelector('textarea[placeholder*="Tippen Sie hier"]') as HTMLTextAreaElement;
          if (tempElement) {
            tempElement.value = currentValue + ' ' + interimTranscript;
          }
        }
      };

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsRecording(true);
      };

      recognitionRef.current.onspeechstart = () => {
        console.log('Speech detected');
      };

      recognitionRef.current.onspeechend = () => {
        console.log('Speech ended');
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error, 'Error details:', event);
        setIsRecording(false);
        
        let errorMessage = "";
        switch(event.error) {
          case 'no-speech':
            errorMessage = "No speech detected. Please speak louder and more clearly.";
            // Don't stop, try to restart automatically
            setTimeout(() => {
              if (recognitionRef.current && !isRecording) {
                console.log('Auto-restarting speech recognition after no-speech');
                try {
                  recognitionRef.current.start();
                  setIsRecording(true);
                } catch (e) {
                  console.error('Failed to restart:', e);
                }
              }
            }, 1000);
            break;
          case 'audio-capture':
            errorMessage = "Microphone access failed. Please check your microphone settings.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone access denied. Please allow microphone access.";
            break;
          case 'network':
            errorMessage = "Network error. Please check your internet connection.";
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        toast({
          title: "Recording Issue",
          description: errorMessage,
          variant: event.error === 'no-speech' ? "default" : "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [toast]);

  const handleVoiceRecording = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      console.log('Stopping speech recognition');
      recognitionRef.current?.stop();
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Voice recording has been stopped."
      });
    } else {
      try {
        console.log('Requesting microphone access...');
        
        // Test microphone access with more specific constraints
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        // Test audio levels
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        
        console.log('Microphone access granted, starting speech recognition...');
        
        // Stop the test stream
        stream.getTracks().forEach(track => track.stop());
        
        recognitionRef.current?.start();
        console.log('Speech recognition start() called');
        
        toast({
          title: "Recording Started",
          description: "Speak clearly and loudly. The system is listening..."
        });
      } catch (error) {
        console.error('Microphone or speech recognition error:', error);
        toast({
          title: "Error Starting Recording",
          description: "Microphone access or speech recognition failed. Please check your browser settings.",
          variant: "destructive"
        });
      }
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
                  disabled={!isSupported}
                >
                  {isRecording ? (
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
