import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Shield, AlertCircle } from 'lucide-react';
// Removed mock IPFS and direct contract usage; now uses backend /api/upload

const Submit = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedCID, setSubmittedCID] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errors, setErrors] = useState({ title: '', description: '' });
  const [kycVerified, setKycVerified] = useState(false);
  const [checkingKYC, setCheckingKYC] = useState(true);

  const { toast } = useToast();
  const { user, token } = useAuth();
  const uploading = false;

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

  const validateForm = () => {
    const newErrors = { title: '', description: '' };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    } else if (description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before submitting',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData with file and metadata
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (file) {
        formData.append('file', file);
      }

      // Submit contribution (file stored locally, status set to Pending)
      const contribRes = await fetch(`${API_BASE}/contributions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });
      
      const contribData = await contribRes.json();
      if (!contribRes.ok) throw new Error(contribData?.error || 'Contribution failed');

      setSubmittedCID(contribData.id); // Use contribution ID
      setTxHash(contribData.status); // Use status

      toast({
        title: 'Contribution Submitted',
        description: 'Your contribution is under review. Please wait for admin approval.',
      });

      setShowSuccess(true);

      setTimeout(() => {
        setTitle('');
        setDescription('');
        setFile(null);
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Failed to submit contribution',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const successAnimation = {
    loop: false,
    autoplay: true,
    animationData: {
      v: "5.5.7",
      fr: 60,
      ip: 0,
      op: 60,
      w: 200,
      h: 200,
      nm: "Success",
      ddd: 0,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: "check",
          sr: 1,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: {
              a: 1,
              k: [
                { t: 0, s: [0, 0, 100], e: [120, 120, 100] },
                { t: 30, s: [120, 120, 100], e: [100, 100, 100] },
                { t: 40, s: [100, 100, 100] }
              ]
            }
          },
          ao: 0,
          shapes: [],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0
        }
      ],
      markers: []
    },
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  if (checkingKYC) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Checking KYC status...</div>
      </div>
    );
  }

  if (!kycVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <CardTitle className="text-xl font-semibold text-yellow-400">
                  KYC Verification Required
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                You need to verify your identity (KYC) before submitting contributions. Complete the verification process to unlock all features.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => window.location.href = '/profile'}
                  className="w-full h-11 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white border-0"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Go to Profile to Verify
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="container max-w-2xl px-4"
        >
          <Card className="glass text-center">
            <CardContent className="pt-12 pb-12 space-y-6">
              <div className="w-32 h-32 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-accent" />
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-2">Contribution Submitted!</h2>
                <p className="text-muted-foreground">
                  Your contribution is under review. Please wait for admin approval.
                </p>
              </div>

              <div className="space-y-4 text-left">
                <div className="glass p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Contribution ID</p>
                  <p className="font-mono text-sm break-all">{submittedCID}</p>
                </div>

                <div className="glass p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <p className="font-mono text-sm break-all">{txHash}</p>
                </div>
              </div>

              <Button
                variant="gradient"
                size="lg"
                onClick={() => setShowSuccess(false)}
              >
                Submit Another
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl px-4 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold">Submit Your Contribution</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Share your work with the community and earn rewards for your contributions
          </p>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 pt-4">
            {[
              { icon: FileText, label: 'Details' },
              { icon: Upload, label: 'Upload' },
              { icon: Send, label: 'Submit' },
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex items-center gap-2 glass px-3 py-2 rounded-full">
                  <step.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                {index < 2 && <div className="h-px w-8 bg-border" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Contribution Details</CardTitle>
              <CardDescription>
                Provide information about your contribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Open Data Citation Engine"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={errors.title ? 'border-destructive' : ''}
                    maxLength={100}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {title.length}/100 characters
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your contribution in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`min-h-32 ${errors.description ? 'border-destructive' : ''}`}
                    maxLength={1000}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {description.length}/1000 characters
                  </p>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file">Upload File (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    {file && (
                      <span className="text-sm text-muted-foreground">
                        {file.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload any relevant files or documentation
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || uploading}
                >
                  {isSubmitting || uploading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Contribution
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Submit;
