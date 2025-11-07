import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Shield, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [kycVerified, setKycVerified] = useState(false);
  const [checkingKYC, setCheckingKYC] = useState(true);
  const { user, token } = useAuth();
  const { toast } = useToast();
  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

  // Check KYC status on mount
  useEffect(() => {
    const checkKYC = async () => {
      if (!user || !token) {
        setCheckingKYC(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/kyc/status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setKycVerified(data.kycVerified || false);
        }
      } catch (error) {
        console.error('Error checking KYC:', error);
      } finally {
        setCheckingKYC(false);
      }
    };
    checkKYC();
  }, [user, token]);

  const allProjects = [
    {
      id: '1',
      title: 'Open Data Citation Engine',
      description: 'A tool to attribute dataset citations automatically across publications and repos.',
      contributor: '0xA12b45678901234567890123456789CDE',
      cid: 'QmXyzExampleCid1234567890AbCdEf',
      rewardStatus: 'Claimable' as const,
      citations: 8,
      rewardAmount: '125.50',
      tags: ['Data', 'Citation'],
    },
    {
      id: '2',
      title: 'Decentralized Research Archive',
      description: 'Blockchain-based archival system for scientific research papers and data.',
      contributor: '0xB98c76543210987654321098765432FGH',
      cid: 'QmAbcDefGhi9876543210ZyXwVuTsR',
      rewardStatus: 'Pending' as const,
      citations: 12,
      rewardAmount: '89.25',
      tags: ['Research', 'Archive'],
    },
    {
      id: '3',
      title: 'Smart Contract Audit Framework',
      description: 'Automated security analysis tool for Ethereum smart contracts.',
      contributor: '0xC45d89012345678901234567890IJK',
      cid: 'QmPqrStuVwx5432109876LmNoPqR',
      rewardStatus: 'Claimable' as const,
      citations: 6,
      rewardAmount: '95.00',
      tags: ['Security', 'Smart Contracts'],
    },
    {
      id: '4',
      title: 'AI-Powered Peer Review Assistant',
      description: 'Machine learning tool to assist in academic peer review processes.',
      contributor: '0xD78e90123456789012345678901LMN',
      cid: 'QmStuvWxyz098765432LmNoPqRsT',
      rewardStatus: 'Claimed' as const,
      citations: 15,
      rewardAmount: '200.00',
      tags: ['AI', 'Research'],
    },
    {
      id: '5',
      title: 'Cross-Chain Bridge Protocol',
      description: 'Secure and efficient protocol for transferring assets across blockchains.',
      contributor: '0xE23f01234567890123456789012OPQ',
      cid: 'QmUvwxYz123456789AbCdEfGhIjK',
      rewardStatus: 'Claimable' as const,
      citations: 10,
      rewardAmount: '150.75',
      tags: ['DeFi', 'Protocol'],
    },
    {
      id: '6',
      title: 'Decentralized Identity System',
      description: 'Self-sovereign identity solution built on blockchain technology.',
      contributor: '0xF45g12345678901234567890123RST',
      cid: 'QmVwxyZ234567890BcDeFgHiJkL',
      rewardStatus: 'Pending' as const,
      citations: 4,
      rewardAmount: '110.00',
      tags: ['Identity', 'Privacy'],
    },
  ];

  const allTags = Array.from(new Set(allProjects.flatMap((p) => p.tags || [])));
  const allStatuses = ['Claimable', 'Pending', 'Claimed'];

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesSearch =
        searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(project.rewardStatus);

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => project.tags?.includes(tag));

      return matchesSearch && matchesStatus && matchesTags;
    });
  }, [searchQuery, selectedStatuses, selectedTags]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedTags([]);
    setSearchQuery('');
  };

  if (checkingKYC) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Checking KYC status...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground text-lg">
            Discover and support amazing contributions from our community
          </p>
        </motion.div>

        {/* KYC Warning Banner */}
        {user && !kycVerified && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-lg border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm"
          >
            <Card className="border-transparent bg-transparent shadow-none relative z-10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-lg font-semibold text-yellow-400">
                    KYC Verification Required
                  </CardTitle>
                </div>
                <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                  You need to verify your identity to upload or purchase contributions. View-only mode active.
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => window.location.href = '/profile'}
                    className="w-full sm:w-auto bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white border-0"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Now
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-4 flex-col md:flex-row"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contributions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {(selectedStatuses.length > 0 || selectedTags.length > 0) && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedStatuses.length + selectedTags.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search by status and tags
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Status Filters */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Status</h3>
                  {allStatuses.map((status) => (
                    <div key={status} className="flex items-center gap-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={selectedStatuses.includes(status)}
                        onCheckedChange={() => toggleStatus(status)}
                      />
                      <Label htmlFor={`status-${status}`} className="cursor-pointer">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Tag Filters */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Tags</h3>
                  {allTags.map((tag) => (
                    <div key={tag} className="flex items-center gap-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => toggleTag(tag)}
                      />
                      <Label htmlFor={`tag-${tag}`} className="cursor-pointer">
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </motion.div>

        {/* Active Filters */}
        {(selectedStatuses.length > 0 || selectedTags.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            {selectedStatuses.map((status) => (
              <Badge key={status} variant="secondary" className="gap-1">
                Status: {status}
                <button
                  onClick={() => toggleStatus(status)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </motion.div>
        )}

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {allProjects.length} contributions
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className={user && !kycVerified ? "relative" : ""}>
          {user && !kycVerified && (
            <div className="absolute inset-0 backdrop-blur-sm bg-black/20 z-10 rounded-xl pointer-events-none" />
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${user && !kycVerified ? 'filter blur-sm' : ''}`}
            style={{ filter: user && !kycVerified ? 'blur(4px)' : 'none' }}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.05 * index,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
                className="h-full"
              >
                <div className="h-full">
                  <ProjectCard
                    {...project}
                    onView={(id) => console.log('View project:', id)}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">
              No contributions found matching your criteria
            </p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
