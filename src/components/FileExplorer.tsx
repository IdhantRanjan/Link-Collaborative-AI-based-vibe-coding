
import React, { useState } from 'react';
import { File, Folder, FolderOpen, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  language?: string;
}

interface FileExplorerProps {
  files: FileNode[];
  selectedFile: string;
  onFileSelect: (fileId: string) => void;
  onCreateFile: (name: string, type: 'file' | 'folder') => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  selectedFile,
  onFileSelect,
  onCreateFile,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.id) ? FolderOpen : Folder;
    }
    return File;
  };

  const getFileColor = (language?: string) => {
    switch (language) {
      case 'javascript': return 'text-yellow-400';
      case 'typescript': return 'text-blue-400';
      case 'html': return 'text-orange-400';
      case 'css': return 'text-pink-400';
      case 'python': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.id}>
        <div
          className={`flex items-center space-x-2 px-2 py-1 hover:bg-slate-700/50 cursor-pointer rounded transition-colors ${
            selectedFile === node.id ? 'bg-blue-600/20 border-l-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else {
              onFileSelect(node.id);
            }
          }}
        >
          {React.createElement(getFileIcon(node), {
            className: `w-4 h-4 ${getFileColor(node.language)}`,
          })}
          <span className="text-sm text-white truncate">{node.name}</span>
        </div>
        {node.type === 'folder' && expandedFolders.has(node.id) && node.children && (
          <div>
            {renderFileTree(node.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full bg-slate-800 border-r border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <h3 className="text-sm font-medium text-white">Files</h3>
        <div className="relative">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="w-6 h-6 p-0 text-slate-400 hover:text-white"
          >
            <Plus className="w-4 h-4" />
          </Button>
          {showCreateMenu && (
            <div className="absolute right-0 top-8 bg-slate-700 border border-slate-600 rounded-md shadow-lg z-10">
              <button
                className="block w-full px-3 py-2 text-left text-sm text-white hover:bg-slate-600"
                onClick={() => {
                  onCreateFile('new-file.js', 'file');
                  setShowCreateMenu(false);
                }}
              >
                New File
              </button>
              <button
                className="block w-full px-3 py-2 text-left text-sm text-white hover:bg-slate-600"
                onClick={() => {
                  onCreateFile('new-folder', 'folder');
                  setShowCreateMenu(false);
                }}
              >
                New Folder
              </button>
            </div>
          )}
        </div>
      </div>

      {/* File Tree */}
      <div className="p-2 space-y-1 overflow-y-auto h-full">
        {renderFileTree(files)}
      </div>
    </div>
  );
};

export default FileExplorer;
