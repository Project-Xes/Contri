import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Eye, Wallet, User, FileText, Clock, Download, Shield, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';
import { Contract } from 'ethers';

interface Contribution {
  id: number;
  title: string;
  description: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  ipfs_cid: string;
  status: string;
  created_at: string;
  fileUrl?: string;
  rewardAmount?: number;
}

interface KYCRequest {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  fileUrl: string;
  status: string;
  verifiedEmail?: string;
  createdAt?: string;
}

const Admin = () => {
  const { user, token } = useAuth();
  const { isConnected, address, connect, signer } = useWallet();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'kyc' | 'contributions'>('dashboard');
  const [kycRequests, setKycRequests] = useState<KYCRequest[]>([]);
  const [kycLoading, setKycLoading] = useState(false);
  const [kycActionLoading, setKycActionLoading] = useState<number | null>(null);

  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

  console.log('Admin component render:', { 
    user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null, 
    token: token ? 'Present' : 'Missing',
    loading, 
    contributions: contributions.length, 
    error 
  });

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md glass border-destructive/20">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You need admin privileges to access this page.</p>
            <p className="text-sm text-muted-foreground mt-2">Current role: {user?.role || 'none'}</p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">To test admin functionality:</p>
              <p className="text-xs text-muted-foreground">Email: admin@example.com</p>
              <p className="text-xs text-muted-foreground">Password: admin123</p>
              <Button 
                onClick={() => window.location.href = '/login'} 
                className="mt-3 gradient-primary"
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    fetchContributions();
    fetchKYCRequests();
  }, []);

  useEffect(() => {
    if (currentView === 'kyc') {
      fetchKYCRequests();
    }
  }, [currentView]);

  const fetchContributions = async () => {
    try {
      console.log('Fetching contributions from:', `${API_BASE}/contributions`);
      const response = await fetch(`${API_BASE}/contributions`);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Contributions data:', data);
      setContributions(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching contributions:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch contributions');
      toast({
        title: 'Failed to load contributions',
        description: 'Could not fetch contributions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchKYCRequests = async () => {
    if (!token) return;
    setKycLoading(true);
    try {
      const res = await fetch(`${API_BASE}/kyc/admin/list`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setKycRequests(data);
      }
    } catch (error) {
      console.error('Error fetching KYC requests:', error);
      toast({
        title: 'Failed to load KYC requests',
        description: 'Could not fetch KYC requests',
        variant: 'destructive',
      });
    } finally {
      setKycLoading(false);
    }
  };

  const handleKYCApprove = async (id: number) => {
    setKycActionLoading(id);
    try {
      const res = await fetch(`${API_BASE}/kyc/admin/approve/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const kycRequest = kycRequests.find(r => r.id === id);
        toast({ title: 'KYC Approved', description: 'User is now verified' });
        addNotification({
          type: 'success',
          title: 'KYC Approved',
          message: `${kycRequest?.userName || 'User'}'s KYC has been approved and verified.`
        });
        fetchKYCRequests();
      } else {
        throw new Error('Failed to approve');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve KYC', variant: 'destructive' });
    } finally {
      setKycActionLoading(null);
    }
  };

  const handleKYCReject = async (id: number) => {
    setKycActionLoading(id);
    try {
      const res = await fetch(`${API_BASE}/kyc/admin/reject/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const kycRequest = kycRequests.find(r => r.id === id);
        toast({ title: 'KYC Rejected', description: 'User can re-submit' });
        addNotification({
          type: 'warning',
          title: 'KYC Rejected',
          message: `${kycRequest?.userName || 'User'}'s KYC has been rejected.`
        });
        fetchKYCRequests();
      } else {
        throw new Error('Failed to reject');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject KYC', variant: 'destructive' });
    } finally {
      setKycActionLoading(null);
    }
  };

  // Calculate KYC stats
  const kycRequestsCount = kycRequests.length;
  const kycPendingCount = kycRequests.filter(r => r.status === 'Pending').length;
  const kycVerifiedCount = kycRequests.filter(r => r.status === 'Verified').length;

  // Fetch full contribution details (contains fileUrl) and update local state
  const fetchContributionDetail = async (id: number) => {
    const res = await fetch(`${API_BASE}/contributions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch contribution details');
    return await res.json();
  };

  const handleViewDetails = async (contribution: Contribution) => {
    try {
      // Always try to get fresh detail (includes fileUrl)
      const detail = await fetchContributionDetail(contribution.id);
      const merged: Contribution = {
        ...contribution,
        // Map backend keys -> frontend
        fileUrl: detail.fileUrl ?? contribution.fileUrl,
        ipfs_cid: detail.ipfsCID ?? contribution.ipfs_cid,
      };

      // Update list so file shows next time without refetch
      setContributions(prev => prev.map(c => c.id === contribution.id ? { ...c, fileUrl: merged.fileUrl } : c));

      setSelectedContribution(merged);
      setIsViewDialogOpen(true);
    } catch (e) {
      // Fallback to current data if detail fails
      setSelectedContribution(contribution);
      setIsViewDialogOpen(true);
    }
  };

  const handleReview = async (contributionId: number, action: 'accept' | 'reject') => {
    setActionLoading(contributionId);
    
    try {
      console.log(`Reviewing contribution ${contributionId} with action: ${action}`);
      
      // Step 1: Update status in database
      const authToken = token || localStorage.getItem('auth_token');
      console.log('Auth token check:', { 
        hasToken: !!token, 
        hasLocalToken: !!localStorage.getItem('auth_token'),
        tokenPreview: authToken ? authToken.substring(0, 20) + '...' : 'None'
      });
      
      if (!authToken) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const reviewResponse = await fetch(`${API_BASE}/contributions/${contributionId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ action }),
      });

      console.log('Review response status:', reviewResponse.status);
      
      if (!reviewResponse.ok) {
        const errorData = await reviewResponse.json();
        console.error('Review error:', errorData);
        
        if (reviewResponse.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (reviewResponse.status === 403) {
          throw new Error('Access denied. You need admin privileges to perform this action.');
        } else {
          throw new Error(errorData?.error || 'Failed to update contribution status');
        }
      }

      const reviewData = await reviewResponse.json();
      console.log('Review response data:', reviewData);

      // Show success toast with IPFS verification links
      if (action === 'accept' && reviewData?.ipfsHash) {
        const cidShort = reviewData.ipfsHash.length > 20 
          ? `${reviewData.ipfsHash.slice(0, 10)}...${reviewData.ipfsHash.slice(-10)}` 
          : reviewData.ipfsHash;
        
        toast({
          title: '✅ File Uploaded to Pinata IPFS!',
          description: `CID: ${cidShort}. Check Pinata dashboard to verify.`,
          duration: 8000,
        });
        
        // Log full details to console for verification
        console.log('📌 IPFS Upload Details:', {
          cid: reviewData.ipfsHash,
          ipfsUrl: reviewData.ipfsGatewayUrl,
          pinataUrl: reviewData.pinataDashboardUrl,
          fileName: reviewData.uploadedFileName,
          fileSize: reviewData.uploadedFileSize,
        });
        
        // Open Pinata dashboard in new tab after a short delay
        if (reviewData.pinataDashboardUrl) {
          setTimeout(() => {
            window.open(reviewData.pinataDashboardUrl, '_blank');
          }, 1500);
        }
      }

      // Step 2: If accepted and wallet connected, send reward via blockchain
      // Only proceed if backend returned a real IPFS hash (means file pinned)
      if (action === 'accept' && isConnected && signer && reviewData?.ipfsHash) {
        try {
          // Load contract ABI and address
          const contractResponse = await fetch(`${API_BASE}/contract-info`);
          const contractData = await contractResponse.json();
          
          const contract = new Contract(contractData.address, contractData.abi, signer);
          
          // Send reward tokens (100.00 CTRI tokens)
          const rewardAmount = 100; // 100.00 CTRI tokens
          const tx = await contract.transfer(address, rewardAmount);
          await tx.wait();
          
          toast({
            title: 'Reward Sent!',
            description: `Sent ${rewardAmount} tokens via blockchain`,
          });
        } catch (blockchainError) {
          toast({
            title: 'Blockchain Error',
            description: 'Status updated but reward failed. You can retry.',
            variant: 'destructive',
          });
        }
      } else if (action === 'accept' && !reviewData?.ipfsHash) {
        toast({
          title: 'IPFS not pinned',
          description: 'Skipping blockchain step because no IPFS CID was returned.',
          variant: 'destructive',
        });
      }

      // Update local state (status and IPFS CID if provided)
      setContributions(prev => 
        prev.map(c => 
          c.id === contributionId 
            ? { 
                ...c, 
                status: action === 'accept' ? 'Accepted' : 'Rejected',
                ipfs_cid: reviewData?.ipfsHash ?? c.ipfs_cid,
              }
            : c
        )
      );

      // Success toast already shown above for accept action
      if (action === 'reject') {
        toast({
          title: `Contribution Rejected`,
          description: 'Contribution has been rejected',
        });
      }

      const contribution = contributions.find(c => c.id === contributionId);
      addNotification({
        type: action === 'accept' ? 'success' : 'warning',
        title: `Contribution ${action === 'accept' ? 'Approved' : 'Rejected'}`,
        message: `"${contribution?.title || 'Contribution'}" by ${contribution?.author?.name || 'Unknown'} has been ${action === 'accept' ? 'approved and rewarded 100 CTRI tokens' : 'rejected'}.`
      });

    } catch (error) {
      toast({
        title: 'Action Failed',
        description: error instanceof Error ? error.message : 'Failed to process action',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-yellow-500';
    switch (status.toLowerCase()) {
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading contributions...</p>
          <p className="text-sm text-muted-foreground mt-2">User: {user?.name} | Role: {user?.role}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md glass">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Admin</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => { setError(null); setLoading(true); fetchContributions(); }} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Contribution Details Dialog - Always available
  const ContributionDetailsDialog = (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto overflow-x-hidden glass border-primary/20">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-3xl font-bold gradient-text flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6" />
                </div>
                Contribution Review
              </DialogTitle>
            </DialogHeader>
            {selectedContribution && (
              <div className="space-y-6">
                {/* Header Section */}
                <div className="glass border-primary/20 p-6 rounded-xl hover-glow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 break-words">
                        {selectedContribution.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 min-w-0">
                          <User className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-medium shrink-0">Author:</span>
                          <span className="text-foreground break-words">{selectedContribution.author?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-accent" />
                          <span className="font-medium">Submitted:</span>
                          <span className="text-foreground">
                            {selectedContribution.created_at 
                              ? (() => {
                                  const date = new Date(selectedContribution.created_at);
                                  const now = new Date();
                                  if (isNaN(date.getTime()) || date > now || date.getFullYear() > now.getFullYear()) {
                                    return now.toLocaleString('en-US', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit',
                                      hour12: true
                                    });
                                  }
                                  return date.toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true
                                  });
                                })()
                              : new Date().toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                  hour12: true
                                })
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`text-white px-4 py-2 text-sm font-medium shrink-0 self-start ${getStatusColor(selectedContribution.status)}`}>
                      {selectedContribution.status || 'Pending'}
                    </Badge>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-accent/10">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    Description
                  </h3>
                  <div className="glass border-primary/10 p-6 rounded-xl">
                    <p className="text-foreground leading-relaxed whitespace-pre-line text-base break-words">
                      {selectedContribution.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Author Details Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    Author Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass border-primary/10 p-6 rounded-xl hover-glow">
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Name:</span>
                          <p className="text-foreground text-lg font-medium break-words">{selectedContribution.author?.name || 'Unknown'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Email:</span>
                          <p className="text-foreground text-lg break-all">{selectedContribution.author?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="glass border-primary/10 p-6 rounded-xl hover-glow">
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Contribution ID:</span>
                          <p className="text-foreground text-lg font-mono font-medium">#{selectedContribution.id}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Reward Amount:</span>
                          <p className="text-foreground text-lg font-semibold gradient-text">
                            {selectedContribution.status === 'Accepted' ? '100.00' : '0.00'} CTRI tokens
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-accent/10">
                      <Download className="h-5 w-5 text-accent" />
                    </div>
                    Attached File
                  </h3>
                  {selectedContribution.fileUrl ? (
                    <div className="glass border-primary/10 p-6 rounded-xl hover-glow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="p-3 rounded-xl bg-gradient-primary/20 border border-primary/20 shrink-0">
                            <FileText className="h-8 w-8 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-foreground text-lg break-all">
                              {selectedContribution.fileUrl.split('/').pop()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Click download to view the file
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 break-all">
                              File URL: {selectedContribution.fileUrl}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            if (!selectedContribution.fileUrl) {
                              console.log('No file URL available');
                              return;
                            }
                            
                            let fileUrl = selectedContribution.fileUrl;
                            console.log('Original fileUrl:', fileUrl);
                            
                            if (fileUrl.startsWith('/api/uploads/')) {
                              const baseUrl = API_BASE.replace('/api', '');
                              fileUrl = `${baseUrl}${fileUrl}`;
                            }
                            else if (!fileUrl.startsWith('http')) {
                              fileUrl = `${API_BASE}/uploads/${fileUrl}`;
                            }
                            
                            console.log('Final download URL:', fileUrl);
                            console.log('API_BASE:', API_BASE);
                            window.open(fileUrl, '_blank');
                          }}
                          className="gradient-primary hover:shadow-[var(--shadow-glow)] px-6 py-2"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="glass border-primary/10 p-6 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-muted/50">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-lg">No file attached</p>
                          <p className="text-sm text-muted-foreground">
                            This contribution was submitted without an attached file
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* IPFS Information */}
                {selectedContribution.ipfs_cid && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-accent/10">
                        <FileText className="h-5 w-5 text-accent" />
                      </div>
                      Blockchain Information
                    </h3>
                    <div className="glass border-primary/10 p-6 rounded-xl hover-glow">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">IPFS CID:</span>
                        <p className="text-foreground font-mono text-sm break-all mt-2 p-3 bg-secondary/50 rounded-lg">
                          {selectedContribution.ipfs_cid}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-8 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDialogOpen(false)}
                    className="px-8 py-2 border-primary/20 hover:border-primary/40"
                  >
                    Close
                  </Button>
                  {(!selectedContribution.status || selectedContribution.status.toLowerCase() === 'pending') && (
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleReview(selectedContribution.id, 'reject');
                          setIsViewDialogOpen(false);
                        }}
                        disabled={actionLoading === selectedContribution.id}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive border-destructive/20 hover:border-destructive/40 px-8 py-2"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Contribution
                      </Button>
                      <Button
                        onClick={() => {
                          handleReview(selectedContribution.id, 'accept');
                          setIsViewDialogOpen(false);
                        }}
                        disabled={actionLoading === selectedContribution.id}
                        className="gradient-primary hover:shadow-[var(--shadow-glow)] px-8 py-2"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Contribution
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
  );

  // Render KYC Full Page
  if (currentView === 'kyc') {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-6xl px-4 space-y-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
                </div>
          
                <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              KYC Verification
            </h1>
            <p className="text-muted-foreground text-lg">
              Review and verify user identity documents
            </p>
                </div>
          
          <Card className="glass border-primary/20">
            <CardContent className="pt-6">
              {kycLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading KYC requests...</p>
                </div>
              ) : kycRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-foreground font-medium mb-1">No KYC requests found</p>
                  <p className="text-sm text-muted-foreground">All KYC requests have been processed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {kycRequests.map((req, index) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="glass border-primary/20 rounded-xl p-6 hover-glow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-foreground line-clamp-1">{req.userName}</h3>
                            <Badge variant="secondary" className="shrink-0">{req.userEmail}</Badge>
                            {req.status === 'Verified' && (
                              <Badge className="bg-green-500 text-white shrink-0">✓ Verified</Badge>
                            )}
                            {req.status === 'Pending' && (
                              <Badge className="bg-yellow-500 text-white shrink-0">⏳ Pending</Badge>
                            )}
                            {req.status === 'Rejected' && (
                              <Badge className="bg-red-500 text-white shrink-0">✗ Rejected</Badge>
                            )}
                          </div>
                          {req.verifiedEmail && (
                            <p className="text-sm text-muted-foreground mb-3">
                              <span className="font-medium">Verified Email:</span> {req.verifiedEmail}
                            </p>
                          )}
                          {req.createdAt && (
                            <p className="text-sm text-muted-foreground mb-3">
                              <span className="font-medium">Submitted:</span>{' '}
                              {new Date(req.createdAt).toLocaleString()}
                            </p>
                          )}
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-foreground">
                              {req.fileUrl.split('/').pop()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const url = req.fileUrl.startsWith('http') 
                                  ? req.fileUrl 
                                  : `${API_BASE.replace('/api', '')}${req.fileUrl}`;
                                window.open(url, '_blank');
                              }}
                              className="ml-auto"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                </div>
              </div>
                        {req.status === 'Pending' && (
                          <div className="flex gap-2 ml-6">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleKYCReject(req.id)}
                              disabled={kycActionLoading === req.id}
                              className="text-destructive hover:text-destructive-foreground hover:bg-destructive border-destructive/20"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleKYCApprove(req.id)}
                              disabled={kycActionLoading === req.id}
                              className="gradient-primary hover:shadow-[var(--shadow-glow)]"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {ContributionDetailsDialog}
        </div>
      </div>
    );
  }

  // Render Contributions Full Page
  if (currentView === 'contributions') {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-6xl px-4 space-y-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileText className="h-8 w-8 text-blue-400" />
              </div>
              Contributions Review
            </h1>
            <p className="text-muted-foreground text-lg">
              Review and approve user contributions
            </p>
          </div>

          <Card className="glass border-primary/20">
            <CardContent className="pt-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading contributions...</p>
                </div>
              ) : contributions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-foreground font-medium mb-1">No contributions to review</p>
                  <p className="text-sm text-muted-foreground">No contributions have been submitted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contributions.map((contribution, index) => (
                  <motion.div
                    key={contribution.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glass border-primary/20 rounded-xl p-6 hover-glow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-xl font-bold text-foreground line-clamp-2">{contribution.title}</h3>
                          <Badge className={`${getStatusColor(contribution.status)} text-white px-3 py-1 font-medium shrink-0`}>
                            {contribution.status || 'Pending'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <span className="font-medium">Author:</span>
                            <span className="text-foreground">{contribution.author?.name || 'Unknown'}</span>
                          </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-accent" />
                              <span className="font-medium">Submitted:</span>
                              <span className="text-foreground">
                                {contribution.created_at 
                                  ? (() => {
                                      const date = new Date(contribution.created_at);
                                      const now = new Date();
                                      if (isNaN(date.getTime()) || date > now || date.getFullYear() > now.getFullYear()) {
                                        return now.toLocaleString('en-US', {
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          second: '2-digit',
                                          hour12: true
                                        });
                                      }
                                      return date.toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true
                                      });
                                    })()
                                  : new Date().toLocaleString('en-US', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit',
                                      hour12: true
                                    })
                                }
                              </span>
                            </div>
                            {contribution.ipfs_cid && (
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-accent" />
                                <span className="font-medium">IPFS:</span>
                                <span className="text-foreground font-mono">{contribution.ipfs_cid?.slice(0, 10)}...</span>
                              </div>
                            )}
                        </div>
                        
                        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                          {contribution.description || 'No description provided'}
                        </p>
                        
                        {contribution.fileUrl && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <FileText className="h-4 w-4 text-accent" />
                            <span className="font-medium">File:</span>
                            <span className="text-foreground">
                              {contribution.fileUrl?.split('/').pop()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3 ml-6">
                        <Button
                          size="sm"
                          variant="outline"
                            onClick={() => {
                              handleViewDetails(contribution);
                            }}
                          className="border-primary/20 hover:border-primary/40 text-primary hover:text-primary-foreground hover:bg-primary"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {(!contribution.status || contribution.status.toLowerCase() === 'pending') && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReview(contribution.id, 'reject')}
                              disabled={actionLoading === contribution.id}
                              className="text-destructive hover:text-destructive-foreground hover:bg-destructive border-destructive/20 hover:border-destructive/40"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReview(contribution.id, 'accept')}
                              disabled={actionLoading === contribution.id}
                              className="gradient-primary hover:shadow-[var(--shadow-glow)]"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
          {ContributionDetailsDialog}
        </div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-6xl px-4 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Review contributions and manage rewards
              </p>
            </div>
            
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{contributions.length}</p>
                  <p className="text-sm text-muted-foreground">Total Contributions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {contributions.filter(c => !c.status || c.status.toLowerCase() === 'pending').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {contributions.filter(c => c.status && c.status.toLowerCase() === 'accepted').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KYC Verification & Contributions Review - Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* KYC Verification Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className="glass border-primary/20 hover:border-primary/40 cursor-pointer hover-glow transition-all duration-300 h-full"
              onClick={() => setCurrentView('kyc')}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                      <CheckCircle className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">KYC Verification</h3>
                      <p className="text-sm text-muted-foreground">Review identity documents</p>
                    </div>
                  </div>
                  <Eye className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Total Requests</span>
                    <span className="text-lg font-bold text-foreground">{kycRequestsCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <Badge className="bg-yellow-500 text-white">{kycPendingCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Verified</span>
                    <Badge className="bg-green-500 text-white">{kycVerifiedCount}</Badge>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs text-center text-muted-foreground">
                    Click to view all KYC requests
                  </p>
                </div>
          </CardContent>
        </Card>
          </motion.div>

          {/* Contributions Review Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card 
              className="glass border-primary/20 hover:border-primary/40 cursor-pointer hover-glow transition-all duration-300 h-full"
              onClick={() => setCurrentView('contributions')}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                      <FileText className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Contributions Review</h3>
                      <p className="text-sm text-muted-foreground">Review and approve contributions</p>
                    </div>
                  </div>
                  <Eye className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Total Contributions</span>
                    <span className="text-lg font-bold text-foreground">{contributions.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Pending Review</span>
                    <Badge className="bg-yellow-500 text-white">
                      {contributions.filter(c => !c.status || c.status.toLowerCase() === 'pending').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Approved</span>
                    <Badge className="bg-green-500 text-white">
                      {contributions.filter(c => c.status && c.status.toLowerCase() === 'accepted').length}
                    </Badge>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs text-center text-muted-foreground">
                    Click to view all contributions
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contribution Details Dialog */}
        {ContributionDetailsDialog}
      </div>
    </div>
  );
};

export default Admin;
