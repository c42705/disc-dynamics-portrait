
import { CertificateData } from '../types/disc';

export const generateCertificate = async (
  certificateRef: React.RefObject<HTMLDivElement>,
  certificateData: CertificateData
): Promise<string> => {
  try {
    const canvas = await html2canvas(certificateRef.current!, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });
    
    return canvas.toDataURL('image/jpeg', 0.95);
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw new Error('Failed to generate certificate');
  }
};

export const downloadCertificate = (dataUrl: string, userName: string) => {
  const link = document.createElement('a');
  const formattedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const fileName = `DISC_Certificate_${userName.replace(/\s+/g, '_')}_${formattedDate}.jpg`;
  
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper function to format date for display on certificate
export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};
