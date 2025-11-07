import { Copy, ExternalLink, Award } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { motion } from 'framer-motion';

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  contributor: string;
  cid: string;
  rewardStatus: 'Claimable' | 'Pending' | 'Claimed';
  citations: number;
  rewardAmount?: string;
  onClaim?: (id: string) => Promise<void>;
  onView?: (id: string) => void;
  hideClaimButton?: boolean;
}

export const ProjectCard = ({
  id,
  title,
  description,
  contributor,
  cid,
  rewardStatus,
  citations,
  rewardAmount,
  onClaim,
  onView,
  hideClaimButton,
}: ProjectCardProps) => {
  const { toast } = useToast();
  const [isClaiming, setIsClaiming] = useState(false);

  const handleCopyCID = () => {
    navigator.clipboard.writeText(cid);
    toast({
      title: 'Copied!',
      description: 'IPFS CID copied to clipboard',
    });
  };

  const handleClaim = async () => {
    if (!onClaim) return;
    setIsClaiming(true);
    try {
      await onClaim(id);
      toast({
        title: 'Reward Claimed!',
        description: `Successfully claimed ${rewardAmount || '0'} tokens`,
      });
    } catch (error) {
      toast({
        title: 'Claim Failed',
        description: 'Failed to claim reward. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsClaiming(false);
    }
  };

  const getStatusColor = () => {
    switch (rewardStatus) {
      case 'Claimable':
        return 'bg-accent text-accent-foreground';
      case 'Pending':
        return 'bg-muted text-muted-foreground';
      case 'Claimed':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="relative overflow-hidden glass border border-white/10 hover:border-purple-500/30 transition-all duration-200 backdrop-blur-sm bg-white/5 shadow-md hover:shadow-lg group">
      
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-2 text-gray-100 group-hover:text-white transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors">{description}</p>
          </div>
          <Badge className={`${getStatusColor()} shrink-0`}>{rewardStatus}</Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Contributor</span>
          <span className="font-mono text-xs text-gray-300">{contributor.slice(0, 10)}...{contributor.slice(-8)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 group-hover:text-gray-300 transition-colors">IPFS CID</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCID}
            className="h-auto p-1 font-mono text-xs hover:bg-purple-500/20 text-purple-300"
          >
            {cid.slice(0, 8)}...{cid.slice(-6)}
            <Copy className="ml-1 h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Citations</span>
          <span className="font-semibold text-purple-300">{citations}</span>
        </div>

        {rewardAmount && (
          <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10 group-hover:border-purple-500/30 transition-colors">
            <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Reward</span>
            <div className="flex items-center gap-1 font-semibold text-purple-300">
              <Award className="h-4 w-4" />
              {rewardAmount} CTRI
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="relative z-10 gap-2">
        <Button
          variant="outline"
          className="flex-1 border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
          onClick={() => onView?.(id)}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Details
        </Button>
        {rewardStatus === 'Claimable' && !hideClaimButton && (
          <Button
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0"
            onClick={handleClaim}
            disabled={isClaiming}
          >
            {isClaiming ? 'Claiming...' : 'Claim Reward'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
