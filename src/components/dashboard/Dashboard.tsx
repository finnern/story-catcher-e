import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StoryCard } from './StoryCard';
import { 
  Plus, 
  Search, 
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Book,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for demonstration
const mockStories = [
  {
    id: '1',
    title: 'The Dragon\'s Quest',
    description: 'An epic fantasy adventure where players must navigate through mystical lands and make crucial decisions that determine the fate of the kingdom.',
    author: 'Sarah Johnson',
    lastModified: '2 hours ago',
    status: 'validated' as const,
    scenes: 24,
    locales: ['en-US', 'es-ES', 'fr-FR']
  },
  {
    id: '2',
    title: 'Corporate Espionage',
    description: 'A thrilling corporate thriller where players uncover secrets and navigate office politics in a high-stakes business environment.',
    author: 'Mike Chen',
    lastModified: '1 day ago',
    status: 'draft' as const,
    scenes: 12,
    locales: ['en-US']
  },
  {
    id: '3',
    title: 'Space Colony Alpha',
    description: 'A sci-fi narrative about building and managing a space colony while dealing with alien encounters and resource management.',
    author: 'Alex Rivera',
    lastModified: '3 days ago',
    status: 'published' as const,
    scenes: 31,
    locales: ['en-US', 'de-DE', 'ja-JP']
  },
  {
    id: '4',
    title: 'Mystery at Moonlight Manor',
    description: 'A classic whodunit mystery set in a Victorian mansion where players must solve puzzles and interview suspects.',
    author: 'Emma Thompson',
    lastModified: '1 week ago',
    status: 'error' as const,
    scenes: 18,
    locales: ['en-US', 'en-GB']
  }
];

const stats = [
  {
    title: 'Total Stories',
    value: '12',
    change: '+2.1%',
    changeType: 'positive' as const,
    icon: Book
  },
  {
    title: 'Active Authors',
    value: '8',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: Users
  },
  {
    title: 'Stories Published',
    value: '6',
    change: '+5.2%',
    changeType: 'positive' as const,
    icon: TrendingUp
  },
  {
    title: 'Avg. Completion Time',
    value: '4.2 days',
    change: '-0.8%',
    changeType: 'positive' as const,
    icon: Clock
  }
];

export function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastModified');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleCreateStory = () => {
    console.log('Create new story');
  };

  const handleEditStory = (story: any) => {
    console.log('Edit story:', story);
  };

  const handlePreviewStory = (story: any) => {
    console.log('Preview story:', story);
  };

  const handleDeleteStory = (story: any) => {
    console.log('Delete story:', story);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your interactive stories and track your progress
          </p>
        </div>
        <Button variant="hero" className="gap-2" onClick={handleCreateStory}>
          <Plus className="h-5 w-5" />
          Create Story
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="gradient-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.changeType === 'positive' ? 'text-success' : 'text-destructive'}>
                    {stat.change}
                  </span>
                  {' '}from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-3 items-center w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="validated">Validated</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastModified">Last Modified</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stories Grid */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }>
        {mockStories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onEdit={handleEditStory}
            onPreview={handlePreviewStory}
            onDelete={handleDeleteStory}
          />
        ))}
      </div>

      {/* Empty State (if no stories) */}
      {mockStories.length === 0 && (
        <Card className="gradient-subtle border-dashed border-2 border-border">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Book className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No stories yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start creating your first interactive story and bring your narrative ideas to life.
            </p>
            <Button variant="hero" className="gap-2" onClick={handleCreateStory}>
              <Plus className="h-5 w-5" />
              Create Your First Story
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}