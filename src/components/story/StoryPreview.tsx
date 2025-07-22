import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  RotateCcw, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Scene {
  id: string;
  title: string;
  content: string;
  choices: Choice[];
}

interface Choice {
  id: string;
  text: string;
  targetSceneId: string;
  conditions?: string[];
}

interface StoryData {
  id: string;
  title: string;
  description: string;
  scenes: Scene[];
}

interface GameState {
  currentSceneId: string;
  visitedScenes: string[];
  variables: Record<string, any>;
  history: string[];
}

interface StoryPreviewProps {
  story: StoryData;
  onClose?: () => void;
}

// Mock story data for preview
const mockStory: StoryData = {
  id: '1',
  title: 'The Dragon\'s Quest',
  description: 'An epic fantasy adventure',
  scenes: [
    {
      id: 'scene1',
      title: 'The Tavern',
      content: 'You enter a dimly lit tavern. The smell of ale and roasted meat fills the air. The bartender, a grizzled old man with knowing eyes, looks up and nods in your direction. Around you, patrons whisper in hushed tones about strange happenings in the nearby forest. What do you do?',
      choices: [
        { id: 'choice1', text: 'Approach the bartender and ask about the forest', targetSceneId: 'scene2' },
        { id: 'choice2', text: 'Sit in a corner and listen to the whispered conversations', targetSceneId: 'scene3' },
        { id: 'choice3', text: 'Order a drink and mind your own business', targetSceneId: 'scene4' }
      ]
    },
    {
      id: 'scene2',
      title: 'Conversation with the Bartender',
      content: 'The bartender leans in close, his voice barely above a whisper. "Aye, strange things indeed. Travelers speak of a great beast awakening in the depths of Shadowmere Forest. Some say it\'s a dragon, others claim it\'s something far worse." He slides a worn map across the bar. "If you\'re thinking of investigating, you\'ll need this."',
      choices: [
        { id: 'choice4', text: 'Take the map and head to the forest immediately', targetSceneId: 'scene5' },
        { id: 'choice5', text: 'Ask the bartender for more details about the beast', targetSceneId: 'scene6' },
        { id: 'choice6', text: 'Thank him but decide this is too dangerous', targetSceneId: 'scene7' }
      ]
    },
    {
      id: 'scene3',
      title: 'Eavesdropping',
      content: 'From your corner table, you catch fragments of fearful conversations. A merchant speaks of his caravan being attacked by something with glowing red eyes. A farmer tells of livestock found drained of blood. Most disturbing is the tale of a village that went completely silent three nights ago.',
      choices: [
        { id: 'choice7', text: 'Approach the merchant to learn more about the attack', targetSceneId: 'scene8' },
        { id: 'choice8', text: 'Seek out the farmer for details about the livestock', targetSceneId: 'scene9' },
        { id: 'choice9', text: 'Leave the tavern and investigate the silent village', targetSceneId: 'scene10' }
      ]
    },
    {
      id: 'scene4',
      title: 'A Quiet Drink',
      content: 'You order a mug of ale and try to relax, but the atmosphere in the tavern is tense. As you drink, a hooded figure approaches your table. "You have the look of an adventurer," they say in a melodic voice. "Perhaps you would be interested in a proposition that could make you very wealthy... or very dead."',
      choices: [
        { id: 'choice10', text: 'Listen to the hooded figure\'s proposition', targetSceneId: 'scene11' },
        { id: 'choice11', text: 'Politely decline and ask them to leave', targetSceneId: 'scene12' },
        { id: 'choice12', text: 'Demand to know who they are first', targetSceneId: 'scene13' }
      ]
    }
  ]
};

export function StoryPreview({ story = mockStory, onClose }: StoryPreviewProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentSceneId: story.scenes[0]?.id || '',
    visitedScenes: [],
    variables: {},
    history: []
  });
  
  const [debugMode, setDebugMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentScene = story.scenes.find(scene => scene.id === gameState.currentSceneId);

  const handleChoiceClick = (choice: Choice) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        currentSceneId: choice.targetSceneId,
        visitedScenes: [...new Set([...prev.visitedScenes, prev.currentSceneId])],
        history: [...prev.history, prev.currentSceneId]
      }));
      setIsAnimating(false);
    }, 300);
  };

  const handleGoBack = () => {
    if (gameState.history.length > 0 && !isAnimating) {
      const previousSceneId = gameState.history[gameState.history.length - 1];
      setGameState(prev => ({
        ...prev,
        currentSceneId: previousSceneId,
        history: prev.history.slice(0, -1)
      }));
    }
  };

  const handleRestart = () => {
    setGameState({
      currentSceneId: story.scenes[0]?.id || '',
      visitedScenes: [],
      variables: {},
      history: []
    });
  };

  if (!currentScene) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Scene Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The requested scene could not be loaded.
            </p>
            <Button onClick={onClose}>Close Preview</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">{story.title}</h1>
          <Badge variant="outline" className="gap-1">
            <Play className="h-3 w-3" />
            Preview Mode
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleGoBack}
            disabled={gameState.history.length === 0 || isAnimating}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDebugMode(!debugMode)}
            className={debugMode ? 'bg-accent' : ''}
          >
            <Info className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Story Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            <Card className={cn(
              "gradient-card shadow-elegant transition-all duration-300",
              isAnimating && "scale-95 opacity-50"
            )}>
              <CardContent className="p-8">
                {/* Scene Title */}
                <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                  {currentScene.title}
                </h2>
                
                {/* Scene Content */}
                <div className="prose prose-lg max-w-none text-foreground mb-8">
                  <p className="leading-relaxed text-center">
                    {currentScene.content}
                  </p>
                </div>
                
                {/* Choices */}
                {currentScene.choices.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-center mb-4">
                      What do you do?
                    </h3>
                    {currentScene.choices.map((choice, index) => (
                      <Button
                        key={choice.id}
                        variant="outline"
                        className="w-full p-4 h-auto text-left justify-start hover:border-primary transition-all duration-200"
                        onClick={() => handleChoiceClick(choice)}
                        disabled={isAnimating}
                      >
                        <span className="text-primary font-medium mr-3">
                          {index + 1}.
                        </span>
                        <span className="flex-1">{choice.text}</span>
                        <ChevronRight className="h-4 w-4 ml-2 opacity-50" />
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      You have reached the end of this story path.
                    </p>
                    <Button variant="default" onClick={handleRestart}>
                      Start Over
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Debug Panel */}
        {debugMode && (
          <div className="w-80 border-l border-border bg-card p-4 overflow-auto">
            <h3 className="font-semibold text-foreground mb-4">Debug Information</h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-2">Current Scene</h4>
                <Badge variant="outline">{currentScene.id}</Badge>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  Visited Scenes ({gameState.visitedScenes.length})
                </h4>
                <div className="space-y-1">
                  {gameState.visitedScenes.map((sceneId) => (
                    <Badge key={sceneId} variant="secondary" className="mr-1 mb-1">
                      {sceneId}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  Navigation History ({gameState.history.length})
                </h4>
                <div className="space-y-1">
                  {gameState.history.map((sceneId, index) => (
                    <div key={index} className="text-muted-foreground">
                      {index + 1}. {sceneId}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Story Variables</h4>
                <div className="text-muted-foreground">
                  {Object.keys(gameState.variables).length === 0 
                    ? 'No variables set' 
                    : JSON.stringify(gameState.variables, null, 2)
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}