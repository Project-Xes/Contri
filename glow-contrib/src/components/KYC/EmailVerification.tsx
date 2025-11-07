import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Mail, Shield, CheckCircle2, Loader2, Lock, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

interface EmailVerificationProps {
  open: boolean;
  onClose: () => void;
  onVerified: (email: string) => void;
  onSuccess?: () => void;
}

export const EmailVerification = ({ open, onClose, onVerified, onSuccess }: EmailVerificationProps) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'upload'>('email');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  const { toast } = useToast();
  
  // EmailJS configuration from environment variables
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOTP = async () => {
    if (!email || !email.includes('@')) {
      toast({ title: 'Invalid Email', description: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }

    // Generate 6-digit OTP
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    setLoading(true);

    try {
      // Check if EmailJS is configured
      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        console.warn('[EmailJS] Not configured. OTP:', newOtp);
        // In development, just show OTP
        toast({ 
          title: 'Dev Mode', 
          description: `EmailJS not configured. Use OTP: ${newOtp}`, 
          variant: 'default',
          duration: 10000
        });
        setStep('otp');
        setLoading(false);
        return;
      }

      // Initialize EmailJS with public key first
      emailjs.init(PUBLIC_KEY);

      // Send email via EmailJS
      // Template variables must match exactly what's in your EmailJS template
      // Common variable names: to_email, email, otp, otp_code, user_email
      const templateParams = {
        to_email: email,
        email: email,  // Some templates use just 'email'
        otp: newOtp,
        otp_code: newOtp,  // Alternative name
        user_email: email,
        user_name: email.split('@')[0],  // Optional: username part
      };

      console.log('[EmailJS] Sending email with config:', {
        service: SERVICE_ID,
        template: TEMPLATE_ID,
        email: email,
        publicKeyConfigured: !!PUBLIC_KEY
      });

      // Send email - after init, publicKey is not needed in send()
      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams
      );

      console.log('[EmailJS] Email sent successfully:', response);
      
      if (response.status === 200 || response.text === 'OK') {
        toast({ title: 'OTP Sent', description: 'Please check your email for the 6-digit OTP' });
        setStep('otp');
      } else {
        throw new Error(`EmailJS returned status: ${response.status}`);
      }
    } catch (error: any) {
      console.error('[EmailJS] Error sending email:', error);
      console.error('[EmailJS] Full error object:', error);
      
      // Extract error message from various possible formats
      let errorMsg = 'Unknown error';
      if (error?.text) {
        errorMsg = error.text;
      } else if (error?.message) {
        errorMsg = error.message;
      } else if (error?.status) {
        errorMsg = `HTTP ${error.status}`;
      }
      
      console.error('[EmailJS] Error details:', {
        status: error?.status,
        text: error?.text,
        message: error?.message,
        type: error?.constructor?.name
      });
      
      // Common EmailJS errors and fixes
      let helpfulMessage = errorMsg;
      if (errorMsg.includes('insufficient authentication scopes') || errorMsg.includes('Gmail_API') || error?.status === 412) {
        helpfulMessage = 'Gmail authentication issue. Reconnect Gmail service in EmailJS dashboard.';
      } else if (errorMsg.includes('Invalid public key') || errorMsg.includes('401')) {
        helpfulMessage = 'Invalid EmailJS Public Key. Check .env.local file.';
      } else if (errorMsg.includes('Template not found') || errorMsg.includes('404')) {
        helpfulMessage = 'EmailJS Template ID not found. Check template configuration.';
      } else if (errorMsg.includes('Service not found')) {
        helpfulMessage = 'EmailJS Service ID not found. Check service configuration.';
      } else if (errorMsg.includes('CORS') || errorMsg.includes('blocked')) {
        helpfulMessage = 'CORS error. Add your domain to EmailJS authorized domains.';
      }
      
      toast({ 
        title: 'Email Failed', 
        description: `${helpfulMessage} Use OTP: ${newOtp} for testing.`,
        variant: 'destructive',
        duration: 15000
      });
      
      // Still allow user to proceed with OTP in dev mode
      setStep('otp');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({ title: 'Invalid OTP', description: 'Please enter 6-digit OTP', variant: 'destructive' });
      return;
    }

    if (otp !== generatedOtp) {
      toast({ title: 'Invalid OTP', description: 'OTP verification failed', variant: 'destructive' });
      return;
    }

    toast({ title: 'Verified', description: 'Email verified successfully. Now upload your KYC document.' });
    setStep('upload'); // Go to upload step instead of closing
    onVerified(email);
  };

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

  const handleUploadKYC = async () => {
    if (!file) {
      toast({ title: 'No File', description: 'Please select a file', variant: 'destructive' });
      return;
    }

    // Check file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      toast({ title: 'File Too Large', description: 'Maximum file size is 20MB', variant: 'destructive' });
      return;
    }

    setUploading(true);
    const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('verified_email', email);

      // Get token from hook or localStorage (optional)
      const authToken = token || localStorage.getItem('auth_token');
      
      const headers: HeadersInit = {};
      if (authToken && authToken.trim()) {
        headers['Authorization'] = `Bearer ${authToken.trim()}`;
      }

      console.log('[KYC Upload] Uploading:', {
        fileName: file.name,
        fileSize: file.size,
        verifiedEmail: email,
      });

      const response = await fetch(`${API_BASE}/kyc/upload`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      console.log('[KYC Upload] Response status:', response.status);

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('[KYC Upload] Parse error:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        const errorMsg = data?.error || data?.message || `Upload failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      console.log('[KYC Upload] Success:', data);
      toast({ title: 'Uploaded Successfully', description: 'KYC document submitted for review. Status: Pending' });
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal
      handleClose();
    } catch (error: any) {
      console.error('[KYC Upload] Error:', error);
      toast({ 
        title: 'Upload Failed', 
        description: error?.message || 'Upload failed. Please try again.',
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setEmail('');
    setOtp('');
    setGeneratedOtp('');
    setFile(null);
    setStep('email');
    setUploading(false);
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-[95vw] sm:max-w-2xl overflow-hidden border border-border/50 bg-background/95 backdrop-blur-sm shadow-xl p-8 sm:p-10">
        
        <DialogHeader className="relative z-10 pb-6">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center space-y-4"
          >
            <div className="flex justify-center mb-4">
              {step === 'email' && (
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
              )}
              {step === 'otp' && (
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              {step === 'upload' && (
                <div className="p-3 rounded-lg bg-green-500/10">
                  <FileText className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
              )}
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-semibold text-center text-foreground">
              {step === 'email' && 'Verify Your Email Address'}
              {step === 'otp' && 'Enter Verification Code'}
              {step === 'upload' && 'Upload Your KYC Document'}
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base text-center text-muted-foreground mt-2">
              {step === 'email' && 'We will send a 6-digit verification code to your email address to verify your identity.'}
              {step === 'otp' && `Please enter the 6-digit verification code sent to ${email}`}
              {step === 'upload' && 'Upload a valid government-issued ID document for KYC verification. Accepted formats: PDF, PNG, JPG (Max 20MB)'}
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <div className="relative z-10 space-y-6">
          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                      disabled={loading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && email && !loading) {
                          handleSendOTP();
                        }
                      }}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 border border-border rounded-md p-3">
                    <Lock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <p>Your email is secure and will only be used for verification purposes.</p>
                  </div>
                </div>
                {(!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) && (
                  <div className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">EmailJS not configured</p>
                      <p className="text-xs mt-1 opacity-80">OTP will be shown in console/dev mode.</p>
                    </div>
                  </div>
                )}
                <div className="pt-2">
                  <Button
                    onClick={handleSendOTP}
                    disabled={loading || !email}
                    className="w-full h-12 text-base font-medium"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending Verification Code...
                      </span>
                    ) : (
                      'Send Verification Code'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-sm font-medium text-foreground">
                      Verification Code
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      disabled={loading}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && otp.length === 6 && !loading) {
                          handleVerifyOTP();
                        }
                      }}
                      className="h-14 text-center text-3xl tracking-[0.3em] font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 border border-border rounded-md p-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Code sent to:</span>
                    <span className="font-medium text-foreground">{email}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 border border-border rounded-md p-3">
                    <Info className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <p>Didn't receive the code? Check your spam folder or wait a few moments.</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep('email')}
                    className="flex-1 h-12 text-base"
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className="flex-1 h-12 text-base font-medium"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      'Verify & Continue'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Upload Document
                    </Label>
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {file ? (
                        <div className="flex flex-col items-center gap-3 justify-center">
                          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-sm font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <p className="text-xs text-green-600 dark:text-green-400 font-medium">File selected successfully</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 rounded-lg bg-muted">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">Click to select your document</p>
                            <p className="text-xs text-muted-foreground">Drag and drop or click to browse</p>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>PDF</span>
                            <span>•</span>
                            <span>PNG</span>
                            <span>•</span>
                            <span>JPG</span>
                            <span>•</span>
                            <span>Max 20MB</span>
                          </div>
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
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 border border-border rounded-md p-3">
                    <Info className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Accepted documents:</p>
                      <ul className="list-disc list-inside space-y-0.5 ml-2 text-muted-foreground">
                        <li>Government-issued ID (Aadhaar, Passport, Driver's License)</li>
                        <li>Proof of address documents</li>
                        <li>Clear, readable images or PDFs only</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 h-12 text-base"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUploadKYC}
                    disabled={!file || uploading}
                    className="flex-1 h-12 text-base font-medium"
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Upload className="h-4 w-4" />
                        Submit for Verification
                      </span>
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 border border-border rounded-md p-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-foreground font-medium">Email verified:</span>
                  <span className="text-foreground">{email}</span>
                  <span>•</span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">Status: Pending Review</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

