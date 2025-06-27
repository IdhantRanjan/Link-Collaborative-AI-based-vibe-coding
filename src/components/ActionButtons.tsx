
import React from 'react';
import { Play, Save, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  fileName: string;
  fileContent: string;
  onRun?: () => void;
  onSave?: () => void;
  onRefresh?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  fileName, 
  fileContent, 
  onRun, 
  onSave, 
  onRefresh 
}) => {
  const handleDownload = () => {
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRun = () => {
    console.log('Running code:', fileContent);
    onRun?.();
  };

  const handleSave = () => {
    console.log('Saving file:', fileName);
    onSave?.();
  };

  const handleRefresh = () => {
    console.log('Refreshing preview');
    onRefresh?.();
  };

  return (
    <div className="p-3 border-t border-slate-700 bg-slate-800/30">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Actions</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Button 
          size="sm" 
          onClick={handleRun} 
          className="bg-green-600 hover:bg-green-700 text-xs"
        >
          <Play className="w-3 h-3 mr-1" />
          Run
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleRefresh}
          className="text-xs border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Refresh
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleSave}
          className="text-xs border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <Save className="w-3 h-3 mr-1" />
          Save
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleDownload}
          className="text-xs border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <Download className="w-3 h-3 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
