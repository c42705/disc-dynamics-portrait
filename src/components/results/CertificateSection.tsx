
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import Certificate from '@/components/Certificate';
import { CertificateData } from '@/types/disc';
import { generateCertificate, downloadCertificate } from '@/utils/certificateGenerator';
import { useLanguage } from '@/contexts/LanguageContext';

interface CertificateSectionProps {
  certificateData: CertificateData;
  onShareResults: () => Promise<void>;
}

const CertificateSection = ({ certificateData, onShareResults }: CertificateSectionProps) => {
  const { t } = useLanguage();
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const handleDownloadCertificate = async () => {
    if (!certificateData.scores || !certificateData.userName) {
      toast.error("Cannot generate certificate. Data is missing.");
      return;
    }
    
    setIsGeneratingCertificate(true);
    toast("Generating your certificate...");
    
    try {
      const dataUrl = await generateCertificate(certificateRef, certificateData);
      downloadCertificate(dataUrl, certificateData.userName);
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error("Failed to generate certificate. Please try again.");
    } finally {
      setIsGeneratingCertificate(false);
    }
  };
  
  return (
    <div className="mx-auto max-w-3xl bg-card border rounded-lg p-6 shadow-sm">
      <p className="text-center text-muted-foreground mb-6">
        {t('results.certificate.description')}
      </p>
      
      <div className="mb-6 relative max-h-[600px] overflow-auto border rounded-lg shadow-sm">
        <Certificate ref={certificateRef} data={certificateData} />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button 
          onClick={handleDownloadCertificate} 
          disabled={isGeneratingCertificate}
          className="btn-hover"
        >
          <Download className="mr-2 h-4 w-4" />
          {isGeneratingCertificate ? 'Generating...' : t('results.certificate.downloadButton')}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onShareResults}
          className="btn-hover"
        >
          <Share2 className="mr-2 h-4 w-4" />
          {t('results.certificate.shareButton')}
        </Button>
      </div>
    </div>
  );
};

export default CertificateSection;
