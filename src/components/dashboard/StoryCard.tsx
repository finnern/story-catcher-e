import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Play, 
  Edit3, 
  Share2, 
  Copy,
  Trash2,
  Clock,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Story {
  id: string;
  title: string;
  description: string;
  author: string;
  lastModified: string;
  status: 'draft' | 'published' | 'validated' | 'error';
  scenes: number;
  locales: string[];
}

interface StoryCardProps {
  story: Story;
  onEdit?: (story: Story) => void;
  onPreview?: (story: Story) => void;
  onDelete?: (story: Story) => void;
}

const statusConfig = {
  draft: { 
    label: 'Draft', 
    icon: Edit3, 
    variant: 'secondary' as const,
    color: 'text-muted-foreground' 
  },
  published: { 
    label: 'Published', 
    icon: CheckCircle, 
    variant: 'default' as const,
    color: 'text-success' 
  },
  validated: { 
    label: 'Validated', 
    icon: CheckCircle, 
    variant: 'success' as const,
    color: 'text-success' 
  },
  error: { 
    label: 'Error', 
    icon: AlertCircle, 
    variant: 'destructive' as const,
    color: 'text-destructive' 
  },
};

export function StoryCard({ story, onEdit, onPreview, onDelete }: StoryCardProps) {
  const statusInfo = statusConfig[story.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="gradient-card hover-lift transition-smooth border-border/50 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-lg text-foreground line-clamp-1">
              {story.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {story.description}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit?.(story)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Story
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPreview?.(story)}>
                <Play className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete?.(story)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status & Metadata */}
        <div className="flex items-center justify-between">
          <Badge 
            variant={statusInfo.variant}
            className="gap-1"
          >
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>
          
          <div className="text-xs text-muted-foreground">
            {story.scenes} scenes
          </div>
        </div>

        {/* Author & Date */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{story.author}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{story.lastModified}</span>
          </div>
        </div>

        {/* Locales */}
        {story.locales.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {story.locales.map((locale) => (
              <Badge 
                key={locale} 
                variant="outline" 
                className="text-xs px-2 py-0.5"
              >
                {locale}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit?.(story)}
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onPreview?.(story)}
          >
            <Play className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}