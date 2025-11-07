import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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

export const KYCVerificationSection = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<KYCRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    fetchKYCRequests();
  }, []);

  const fetchKYCRequests = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/kyc/admin/list`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching KYC requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_BASE}/kyc/admin/approve/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast({ title: 'KYC Approved', description: 'User is now verified' });
        fetchKYCRequests();
      } else {
        throw new Error('Failed to approve');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve KYC', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_BASE}/kyc/admin/reject/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast({ title: 'KYC Rejected', description: 'User can re-submit' });
        fetchKYCRequests();
      } else {
        throw new Error('Failed to reject');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject KYC', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading KYC requests...</div>;
  }

  if (requests.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No KYC requests found</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return <Badge className="bg-green-500">✓ Verified</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-500">✗ Rejected</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-500">⏳ Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div key={req.id} className="glass border p-4 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold">{req.userName}</h3>
                <Badge variant="secondary">{req.userEmail}</Badge>
                {getStatusBadge(req.status)}
              </div>
              {req.verifiedEmail && (
                <p className="text-sm text-muted-foreground mb-2">Verified Email: {req.verifiedEmail}</p>
              )}
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{req.fileUrl.split('/').pop()}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const url = req.fileUrl.startsWith('http') ? req.fileUrl : `${API_BASE.replace('/api', '')}${req.fileUrl}`;
                    window.open(url, '_blank');
                  }}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            {req.status === 'Pending' && (
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(req.id)}
                  disabled={actionLoading === req.id}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(req.id)}
                  disabled={actionLoading === req.id}
                  className="gradient-primary"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

