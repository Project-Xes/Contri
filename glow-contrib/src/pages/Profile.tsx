import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Edit2, Check, X, Copy, Shield, RefreshCw, FileText, Download, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ProjectCard, ProjectCardProps } from '@/components/ProjectCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { EmailVerification } from '@/components/KYC/EmailVerification';

interface UserContribution {
  id: string;
  title: string;
  description?: string;
  status?: string;
  created_at?: string;
  ipfs_cid?: string;
  rewardAmount?: string | number;
  contributor?: string;
  cid?: string;
  fileUrl?: string;
}

const Profile = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [userContributions, setUserContributions] = useState<UserContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<UserContribution | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [kycStatus, setKycStatus] = useState<'None' | 'Pending' | 'Verified' | 'Rejected'>('None');
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Passionate about decentralized technologies and open-source contributions.',
    role: user?.role || 'user',
    kycVerified: true,
    totalRewards: 0,
    contributions: 0,
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

  // Fetch user's contributions and refresh user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id || !token) return;
      
      try {
        // Fetch fresh user data to get updated balance and KYC status
        const userResponse = await fetch(`${API_BASE}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (userResponse.ok) {
          const freshUserData = await userResponse.json();
          setProfile(prev => ({
            ...prev,
            totalRewards: freshUserData.ctriBalance || 0,
            kycVerified: freshUserData.kycVerified || false
          }));
        }

        // Fetch KYC status
        const kycResponse = await fetch(`${API_BASE}/kyc/status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (kycResponse.ok) {
          const kycData = await kycResponse.json();
          setKycStatus(kycData.kycStatus || 'None');
          setProfile(prev => ({
            ...prev,
            kycVerified: kycData.kycVerified || false
          }));
        }

        // Fetch contributions
        const response = await fetch(`${API_BASE}/contributions`);
        const allContributions = await response.json();
        
        // Filter contributions by current user (robust by ID or email)
        const userContribs = allContributions.filter((contrib: any) => {
          const contribAuthorId = contrib?.author?.id;
          const contribAuthorEmail = contrib?.author?.email?.toLowerCase?.();
          const userId = user.id as any;
          const userEmail = user.email?.toLowerCase?.();
          const idMatch = contribAuthorId != null && Number(contribAuthorId) === Number(userId);
          const emailMatch = !!contribAuthorEmail && !!userEmail && contribAuthorEmail === userEmail;
          return idMatch || emailMatch;
        });
        
        setUserContributions(userContribs);
        setProfile(prev => ({
          ...prev,
          contributions: userContribs.length
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id, token, API_BASE]);

  const refreshBalance = async () => {
    if (!user?.id || !token) return;
    
    setRefreshing(true);
    try {
      const userResponse = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (userResponse.ok) {
        const freshUserData = await userResponse.json();
        setProfile(prev => ({
          ...prev,
          totalRewards: freshUserData.ctriBalance || 0
        }));
        toast({
          title: 'Balance Updated',
          description: `Your balance is now ${freshUserData.ctriBalance || 0} CTRI tokens`,
        });
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
      toast({
        title: 'Refresh Failed',
        description: 'Could not refresh balance. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleSave = async () => {
    try {
      const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_BASE}/profile/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editedProfile.name,
          bio: editedProfile.bio,
        }),
      });

      if (response.ok) {
        setProfile(editedProfile);
        setIsEditing(false);
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated',
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleCopyEmail = () => {
    if (profile.email) {
      navigator.clipboard.writeText(profile.email);
      toast({
        title: 'Copied!',
        description: 'Email address copied to clipboard',
      });
    }
  };

  const getProjectCards = (): ProjectCardProps[] => {
    return userContributions.map((c) => ({
      id: String(c.id),
      title: c.title,
      description: (c.description || '').slice(0, 160) || 'No description provided',
      contributor: c.contributor || (user?.email || 'you'),
      cid: c.cid || c.ipfs_cid || '',
      rewardStatus: (c.status === 'Accepted' && (Number(c.rewardAmount) > 0)) ? 'Claimable' : (c.status === 'Rejected' ? 'Pending' : (c.status as any) || 'Pending'),
      citations: 0,
      rewardAmount: c.rewardAmount ? String(c.rewardAmount) : undefined,
      onView: async (id: string) => {
        try {
          const res = await fetch(`${API_BASE}/contributions/${id}`);
          if (res.ok) {
            const detail = await res.json();
            setSelected({
              id: String(detail.id || c.id),
              title: detail.title || c.title,
              description: detail.description || c.description,
              status: detail.status || c.status,
              ipfs_cid: detail.ipfsCID || c.ipfs_cid,
              fileUrl: detail.fileUrl || c.fileUrl,
              rewardAmount: detail.rewardAmount ?? c.rewardAmount,
              created_at: c.created_at,
            });
          } else {
            setSelected(c);
          }
        } catch {
          setSelected(c);
        } finally {
          setIsDialogOpen(true);
        }
      },
    }));
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-6xl px-4 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-foreground">Profile</h1>
          <p className="text-muted-foreground text-lg">
            Manage your account and view your activity
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-3xl">
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                  <Badge variant="secondary" className="mt-2 text-foreground">
                    {profile.role}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border border-border"
                  >
                    <span className="text-muted-foreground">Total Rewards</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{profile.totalRewards} CTRI</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={refreshBalance}
                        disabled={refreshing}
                        className="h-6 w-6 p-0"
                      >
                        <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border border-border"
                  >
                    <span className="text-muted-foreground">Contributions</span>
                    <span className="font-semibold text-foreground">{profile.contributions}</span>
                  </motion.div>
                </div>

                {/* KYC Status Badge */}
                {kycStatus === 'Verified' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative overflow-hidden bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent p-4 rounded-xl border-2 border-green-500/30 dark:border-green-400/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span className="font-bold text-sm text-green-600 dark:text-green-400">KYC Verified</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Your identity has been verified</p>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full -mr-10 -mt-10 blur-xl" />
                  </motion.div>
                )}
                {kycStatus === 'Pending' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative overflow-hidden bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent p-4 rounded-xl border-2 border-yellow-500/30 dark:border-yellow-400/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 dark:from-yellow-400 dark:to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                          <Clock className="h-5 w-5 text-white animate-pulse" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-yellow-600 dark:text-yellow-400">KYC Pending</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Your document is under review</p>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full -mr-10 -mt-10 blur-xl" />
                  </motion.div>
                )}
                {(kycStatus === 'None' || kycStatus === 'Rejected') && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`relative overflow-hidden p-4 rounded-xl border-2 ${
                      kycStatus === 'Rejected'
                        ? 'bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-red-500/30 dark:border-red-400/30'
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          kycStatus === 'Rejected'
                            ? 'bg-gradient-to-br from-red-500 to-rose-600 dark:from-red-400 dark:to-rose-500 shadow-lg shadow-red-500/20'
                            : 'bg-muted'
                        }`}>
                          {kycStatus === 'Rejected' ? (
                            <X className="h-5 w-5 text-white" />
                          ) : (
                            <Shield className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-bold text-sm ${
                            kycStatus === 'Rejected'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-muted-foreground'
                          }`}>
                            {kycStatus === 'Rejected' ? 'KYC Rejected' : 'KYC Not Verified'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {kycStatus === 'Rejected' ? 'Please resubmit your documents' : 'Verify your identity to continue'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={kycStatus === 'Rejected' ? 'gradient' : 'outline'} 
                      size="sm" 
                      className="w-full" 
                      onClick={() => setKycModalOpen(true)}
                    >
                      {kycStatus === 'Rejected' ? 'Resubmit KYC' : 'Start Verification'}
                    </Button>
                    {kycStatus === 'Rejected' && (
                      <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full -mr-10 -mt-10 blur-xl" />
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Details & Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Account Details */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Account Details</CardTitle>
                {!isEditing ? (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </motion.div>
                ) : (
                  <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="gradient"
                        size="sm"
                        onClick={handleSave}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Save
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </motion.div>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    value={isEditing ? editedProfile.name : profile.name}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className="text-foreground bg-background"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editedProfile.email : profile.email}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className="text-foreground bg-background"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="bio" className="text-foreground">Bio</Label>
                  <Textarea
                    id="bio"
                    value={isEditing ? editedProfile.bio : profile.bio}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, bio: e.target.value })
                    }
                    disabled={!isEditing}
                    className="min-h-24 text-foreground bg-background"
                  />
                </motion.div>

                <div className="space-y-2">
                  <Label className="text-foreground">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={profile.email}
                      disabled
                      className="font-mono text-foreground bg-muted/50"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyEmail}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          </motion.div>
        </div>

        {/* My Contributions - Full width below */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">My Contributions ({userContributions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="rounded-full h-8 w-8 border-b-2 border-primary mx-auto"
                />
                <p className="text-sm text-muted-foreground mt-2">Loading contributions...</p>
              </div>
            ) : userContributions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-foreground font-medium mb-1">No contributions yet</p>
                <p className="text-sm text-muted-foreground">Submit your first contribution to get started!</p>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getProjectCards().map((p, index) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProjectCard {...p} hideClaimButton />
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Details Dialog (global) */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-foreground">Project Details</DialogTitle>
            </DialogHeader>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-muted/30 p-6 rounded-lg border border-border">
                  <div className="flex flex-col gap-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-bold mb-2 text-foreground break-words">{selected.title}</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {selected.created_at ? new Date(selected.created_at).toLocaleString() : '—'}
                          </span>
                        </div>
                        {selected.status && (
                          <Badge className="px-3 py-1 text-foreground">{selected.status}</Badge>
                        )}
                      </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2 text-foreground">
                    <FileText className="h-4 w-4" />
                    Description
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-lg border border-border">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground break-words">
                      {selected.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* File section */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2 text-foreground">
                    <Download className="h-4 w-4" />
                    Attached File
                  </h3>
                  {selected.fileUrl ? (
                    <div className="bg-muted/30 p-4 rounded-lg border border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <FileText className="h-6 w-6 text-primary shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground break-all">{selected.fileUrl.split('/').pop()}</p>
                          <p className="text-xs text-muted-foreground break-all">{selected.fileUrl}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          let url = selected.fileUrl!;
                          if (url.startsWith('/api/uploads/')) {
                            const base = API_BASE.replace('/api', '');
                            url = `${base}${url}`;
                          } else if (!url.startsWith('http')) {
                            url = `${API_BASE}/uploads/${url}`;
                          }
                          window.open(url, '_blank');
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-muted/30 p-4 rounded-lg border border-border text-sm text-muted-foreground">No file attached</div>
                  )}
                </div>

                {/* IPFS */}
                {selected.ipfs_cid && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">IPFS</h3>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border font-mono text-sm break-all text-foreground">
                      {selected.ipfs_cid}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </DialogContent>
        </Dialog>

        {/* KYC Verification & Upload Modal - Integrated Flow */}
        <EmailVerification
          open={kycModalOpen}
          onClose={() => {
            setKycModalOpen(false);
            setVerifiedEmail('');
          }}
          onVerified={(email) => {
            setVerifiedEmail(email);
          }}
          onSuccess={() => {
            setKycStatus('Pending');
            // Refresh KYC status from backend
            if (user?.id && token) {
              fetch(`${API_BASE}/kyc/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
              })
                .then(r => r.json())
                .then(data => {
                  if (data.kycStatus) {
                    setKycStatus(data.kycStatus);
                  }
                })
                .catch(console.error);
            }
            toast({ title: 'KYC Submitted', description: 'Your document is under review' });
          }}
        />

      </div>
    </div>
  );
};

export default Profile;
