
import React, { useEffect, useRef } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LivePreviewProps {
  htmlContent: string;
  cssContent: string;
  jsContent: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({ htmlContent, cssContent, jsContent }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updatePreview = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const document = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (document) {
        const fullHTML = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>${cssContent}</style>
            </head>
            <body>
              ${htmlContent}
              <script>${jsContent}</script>
            </body>
          </html>
        `;
        
        document.open();
        document.write(fullHTML);
        document.close();
      }
    }
  };

  useEffect(() => {
    updatePreview();
  }, [htmlContent, cssContent, jsContent]);

  const openInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      const fullHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>${cssContent}</style>
          </head>
          <body>
            ${htmlContent}
            <script>${jsContent}</script>
          </body>
        </html>
      `;
      newWindow.document.write(fullHTML);
      newWindow.document.close();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
        <h3 className="text-sm font-medium text-slate-800">Live Preview</h3>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={updatePreview}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={openInNewTab}>
            <ExternalLink className="w-4 h-4 mr-1" />
            Open
          </Button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="flex-1 p-2">
        <iframe
          ref={iframeRef}
          className="w-full h-full border border-slate-200 rounded bg-white"
          title="Live Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

export default LivePreview;
