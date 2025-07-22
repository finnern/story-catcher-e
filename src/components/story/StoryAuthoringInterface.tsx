import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Play, 
  Eye, 
  Settings, 
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Globe,
  Layers,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface Scene {
  id: string;
  title: string;
  description: string;
  content: string;
  choices: Choice[];
}

interface Choice {
  id: string;
  text: string;
  targetSceneId: string;
  conditions?: string[];
}

interface Story {
  id: string;
  title: string;
  description: string;
  scenes: Scene[];
  characters: Character[];
  variables: Variable[];
}

interface Character {
  id: string;
  name: string;
  description: string;
}

interface Variable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean';
  defaultValue: any;
}

const mockStory: Story = {
  id: '1',
  title: 'The Dragon\'s Quest',
  description: 'An epic fantasy adventure',
  scenes: [
    {
      id: 'scene1',
      title: 'The Tavern',
      description: 'Starting point of the adventure',
      content: 'You enter a dimly lit tavern. The bartender looks up and nods in your direction. What do you do?',
      choices: [
        { id: 'choice1', text: 'Approach the bartender', targetSceneId: 'scene2' },
        { id: 'choice2', text: 'Sit in a corner and observe', targetSceneId: 'scene3' }
      ]
    }
  ],
  characters: [
    { id: 'char1', name: 'Bartender', description: 'A wise old man who knows many secrets' }
  ],
  variables: [
    { id: 'var1', name: 'playerGold', type: 'number', defaultValue: 100 }
  ]
};

export function StoryAuthoringInterface() {
  const [story, setStory] = useState<Story>(mockStory);
  const [selectedScene, setSelectedScene] = useState<string>('scene1');
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | 'validating'>('valid');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleSave = () => {
    setValidationStatus('validating');
    // Simulate validation and save
    setTimeout(() => {
      setValidationStatus('valid');
      setUnsavedChanges(false);
      toast.success('Story saved successfully!');
    }, 1000);
  };

  const handlePreview = () => {
    toast.info('Opening story preview...');
  };

  const handleAddScene = () => {
    const newScene: Scene = {
      id: `scene${Date.now()}`,
      title: 'New Scene',
      description: '',
      content: '',
      choices: []
    };
    setStory(prev => ({
      ...prev,
      scenes: [...prev.scenes, newScene]
    }));
    setSelectedScene(newScene.id);
    setUnsavedChanges(true);
  };

  const handleAddChoice = (sceneId: string) => {
    const newChoice: Choice = {
      id: `choice${Date.now()}`,
      text: 'New Choice',
      targetSceneId: ''
    };
    
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === sceneId 
          ? { ...scene, choices: [...scene.choices, newChoice] }
          : scene
      )
    }));
    setUnsavedChanges(true);
  };

  const currentScene = story.scenes.find(scene => scene.id === selectedScene);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Story Structure */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Story Structure</h2>
            <Button variant="outline" size="icon" onClick={handleAddScene}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Validation Status */}
          <div className="flex items-center gap-2 text-sm">
            {validationStatus === 'valid' && (
              <>
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-success">Story validated</span>
              </>
            )}
            {validationStatus === 'invalid' && (
              <>
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-destructive">Validation errors</span>
              </>
            )}
            {validationStatus === 'validating' && (
              <>
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-muted-foreground">Validating...</span>
              </>
            )}
          </div>
        </div>

        {/* Scene List */}
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {story.scenes.map((scene) => (
            <Card 
              key={scene.id}
              className={`cursor-pointer transition-colors hover:bg-accent ${
                selectedScene === scene.id ? 'bg-accent border-primary' : ''
              }`}
              onClick={() => setSelectedScene(scene.id)}
            >
              <CardContent className="p-3">
                <h4 className="font-medium text-sm">{scene.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {scene.description || 'No description'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {scene.choices.length} choices
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">{story.title}</h1>
            {unsavedChanges && (
              <Badge variant="warning" className="text-xs">
                Unsaved changes
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={handlePreview}>
              <Play className="h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Flow View
            </Button>
            <Button 
              variant="default" 
              className="gap-2" 
              onClick={handleSave}
              disabled={validationStatus === 'validating'}
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 p-6 overflow-auto">
          {currentScene ? (
            <Tabs defaultValue="content" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content" className="gap-2">
                  <Layers className="h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="characters" className="gap-2">
                  <Users className="h-4 w-4" />
                  Characters
                </TabsTrigger>
                <TabsTrigger value="variables" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Variables
                </TabsTrigger>
                <TabsTrigger value="localization" className="gap-2">
                  <Globe className="h-4 w-4" />
                  Localization
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Scene Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Title</label>
                      <Input 
                        value={currentScene.title}
                        onChange={(e) => {
                          setStory(prev => ({
                            ...prev,
                            scenes: prev.scenes.map(scene => 
                              scene.id === selectedScene 
                                ? { ...scene, title: e.target.value }
                                : scene
                            )
                          }));
                          setUnsavedChanges(true);
                        }}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground">Description</label>
                      <Input 
                        value={currentScene.description}
                        onChange={(e) => {
                          setStory(prev => ({
                            ...prev,
                            scenes: prev.scenes.map(scene => 
                              scene.id === selectedScene 
                                ? { ...scene, description: e.target.value }
                                : scene
                            )
                          }));
                          setUnsavedChanges(true);
                        }}
                        className="mt-1"
                        placeholder="Brief description of this scene"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Content</label>
                      <Textarea 
                        value={currentScene.content}
                        onChange={(e) => {
                          setStory(prev => ({
                            ...prev,
                            scenes: prev.scenes.map(scene => 
                              scene.id === selectedScene 
                                ? { ...scene, content: e.target.value }
                                : scene
                            )
                          }));
                          setUnsavedChanges(true);
                        }}
                        className="mt-1 min-h-32"
                        placeholder="The narrative content that players will see..."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Choices</CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAddChoice(selectedScene)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Choice
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentScene.choices.map((choice, index) => (
                      <div key={choice.id} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Choice {index + 1}</h4>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-foreground">Choice Text</label>
                          <Input 
                            value={choice.text}
                            className="mt-1"
                            placeholder="What the player sees as an option"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground">Target Scene</label>
                          <select className="w-full mt-1 h-10 px-3 rounded-md border border-border bg-background">
                            <option value="">Select target scene...</option>
                            {story.scenes.map(scene => (
                              <option key={scene.id} value={scene.id}>
                                {scene.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                    
                    {currentScene.choices.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No choices defined yet.</p>
                        <p className="text-sm">Add choices to create branching narrative paths.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="characters">
                <Card>
                  <CardHeader>
                    <CardTitle>Characters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Character management coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="variables">
                <Card>
                  <CardHeader>
                    <CardTitle>Story Variables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Variable management coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="localization">
                <Card>
                  <CardHeader>
                    <CardTitle>Localization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Localization tools coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Layers className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No scene selected
                </h3>
                <p className="text-muted-foreground">
                  Select a scene from the sidebar to start editing
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}