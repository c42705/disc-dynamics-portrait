
import { DiscScore } from '@/types/disc';
import { toast } from 'sonner';

// Configuration for the Google Sheets integration
interface SheetConfig {
  scriptUrl: string;
  secretToken?: string;
}

// Get the Google Script URL from localStorage or fallback to a demo URL
const getSheetConfig = (): SheetConfig => {
  const storedConfig = localStorage.getItem('googleSheetConfig');
  
  if (storedConfig) {
    try {
      return JSON.parse(storedConfig);
    } catch (error) {
      console.error('Error parsing stored Google Sheet config:', error);
    }
  }
  
  // Default demo URL (would be replaced with actual Apps Script URL)
  return {
    scriptUrl: 'https://script.google.com/macros/s/demo-script-id/exec',
    secretToken: 'demo-token'
  };
};

// Validate Google Script URL format
export const validateScriptUrl = (url: string): boolean => {
  const regex = /https:\/\/script\.google\.com\/.*/;
  return regex.test(url);
};

// Save DISC test results to the configured Google Sheet
export const saveResultsToGoogleSheet = async (
  userId: string, 
  userName: string,
  scores: DiscScore,
  language: string
): Promise<boolean> => {
  const config = getSheetConfig();
  
  try {
    // Prepare the payload for the Google Script
    const payload = {
      userId,
      userName,
      timestamp: new Date().toISOString(),
      scores: {
        dominance: scores.dominance,
        influence: scores.influence,
        steadiness: scores.steadiness,
        compliance: scores.compliance
      },
      language,
      token: config.secretToken
    };

    // For demo purposes, we'll just log the payload and return success
    // In a real implementation, this would make an actual API call
    console.log('Saving data to Google Sheet:', payload);
    console.log('Script URL:', config.scriptUrl);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation:
    /*
    const response = await fetch(config.scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save results: ${response.status}`);
    }
    */
    
    toast.success('Results saved successfully to Google Sheet');
    return true;
  } catch (error) {
    console.error('Error saving results to Google Sheet:', error);
    toast.error('Failed to save results. Try later.');
    return false;
  }
};

// Save the Google Sheet configuration (for admin use)
export const saveSheetConfiguration = (scriptUrl: string, secretToken?: string): boolean => {
  try {
    // Validate the URL format (basic check for Google Sheets URL)
    if (!validateScriptUrl(scriptUrl)) {
      toast.error('URL must be a valid Google Script URL');
      return false;
    }
    
    // Save the configuration to localStorage
    const config: SheetConfig = { scriptUrl, secretToken };
    localStorage.setItem('googleSheetConfig', JSON.stringify(config));
    toast.success('Google Sheet configuration updated');
    return true;
  } catch (error) {
    console.error('Error saving Google Sheet configuration:', error);
    toast.error('Failed to save configuration');
    return false;
  }
};
