import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface KYCUploadFormProps {
  open: boolean;
  onClose: () => void;
  verifiedEmail: string;
  onSuccess: () => void;
}

export const KYCUploadForm = ({ open, onClose, verifiedEmail, onSuccess }: KYCUploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { token } = useAuth();
  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const ext = selected.name.split('.').pop()?.toLowerCase();
      if (!['pdf', 'png', 'jpg', 'jpeg'].includes(ext || '')) {
        toast({ title: 'Invalid File', description: 'Only PDF and images allowed', variant: 'destructive' });
        return;
      }
      setFile(selected);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: 'No File', description: 'Please select a file', variant: 'destructive' });
      return;
    }

    if (!verifiedEmail) {
      toast({ 
        title: 'Email Required', 
        description: 'Please verify your email first', 
        variant: 'destructive' 
      });
      return;
    }

    // Check file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      toast({ title: 'File Too Large', description: 'Maximum file size is 20MB', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('verified_email', verifiedEmail);

      // Get token from hook or localStorage (optional - not required if email verified)
      const authToken = token || localStorage.getItem('auth_token');
      
      const headers: HeadersInit = {};
      // Only add Authorization header if token exists
      if (authToken && authToken.trim()) {
        headers['Authorization'] = `Bearer ${authToken.trim()}`;
      }

      console.log('[KYC Upload] Attempting upload:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        verifiedEmail: verifiedEmail,
        apiBase: API_BASE,
        hasToken: !!authToken,
        tokenPreview: authToken ? authToken.substring(0, 20) + '...' : 'None'
      });

      const response = await fetch(`${API_BASE}/kyc/upload`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      console.log('[KYC Upload] Response status:', response.status);

      // Try to parse JSON response
      let data;
      try {
        const text = await response.text();
        console.log('[KYC Upload] Response text:', text);
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('[KYC Upload] Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        let errorMsg = data?.error || data?.message || `Upload failed with status ${response.status}`;
        
        // Provide helpful messages for specific errors
        if (response.status === 401) {
          if (data?.error?.includes('expired')) {
            errorMsg = 'Your session has expired. Please login again.';
          } else if (data?.error?.includes('Invalid token')) {
            errorMsg = 'Invalid authentication. Please login again.';
          } else {
            errorMsg = data?.error || data?.message || 'Authentication failed. Please login again.';
          }
        }
        
        console.error('[KYC Upload] Error:', {
          status: response.status,
          error: data?.error,
          message: data?.message,
          fullData: data
        });
        throw new Error(errorMsg);
      }

      console.log('[KYC Upload] Success:', data);
      toast({ title: 'Uploaded Successfully', description: 'KYC document submitted for review' });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('[KYC Upload] Upload error:', error);
      const errorMsg = error?.message || 'Upload failed. Please try again.';
      toast({ 
        title: 'Upload Failed', 
        description: errorMsg,
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload KYC Document</DialogTitle>
          <DialogDescription>Upload your identity document (PDF or Image)</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Document (PDF or Image)</Label>
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <div className="flex items-center gap-2 justify-center">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">{file.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to select file</span>
                </div>
              )}
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || loading} className="flex-1">
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

