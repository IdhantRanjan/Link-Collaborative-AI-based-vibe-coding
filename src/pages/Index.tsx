
import React, { useState, useEffect } from 'react';
import ProjectHeader from '@/components/ProjectHeader';
import FileExplorer from '@/components/FileExplorer';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import ChatPanel from '@/components/ChatPanel';
import RoomSetup from '@/components/RoomSetup';
import AICopilot from '@/components/AICopilot';
import ActionButtons from '@/components/ActionButtons';
import { useRoomStore } from '@/stores/roomStore';

// Mock data
const mockUsers = [
  { id: '1', name: 'Alex Chen', color: '#3B82F6' },
  { id: '2', name: 'Jordan Smith', color: '#10B981' },
  { id: '3', name: 'Sam Wilson', color: '#F59E0B' },
  { id: '4', name: 'Casey Johnson', color: '#EF4444' },
];

const mockFiles = [
  {
    id: 'html',
    name: 'index.html',
    type: 'file' as const,
    language: 'html',
  },
  {
    id: 'css',
    name: 'styles.css',
    type: 'file' as const,
    language: 'css',
  },
  {
    id: 'js',
    name: 'script.js',
    type: 'file' as const,
    language: 'javascript',
  },
  {
    id: 'components',
    name: 'components',
    type: 'folder' as const,
    children: [
      {
        id: 'header',
        name: 'Header.js',
        type: 'file' as const,
        language: 'javascript',
      },
      {
        id: 'footer',
        name: 'Footer.js',
        type: 'file' as const,
        language: 'javascript',
      },
    ],
  },
];

const mockMessages = [
  {
    id: '1',
    user: 'Alex Chen',
    content: 'Hey team! I just added the button animation. What do you think?',
    timestamp: new Date(Date.now() - 300000),
    color: '#3B82F6',
  },
  {
    id: '2',
    user: 'Jordan Smith',
    content: 'Looks great! Maybe we should add some more interactive elements?',
    timestamp: new Date(Date.now() - 240000),
    color: '#10B981',
  },
];

const Index = () => {
  const { currentRoom, currentUser, participants, updateCode } = useRoomStore();
  const [selectedFile, setSelectedFile] = useState('html');
  const [messages, setMessages] = useState(mockMessages);
  const [showChat, setShowChat] = useState(true);
  const [showCopilot, setShowCopilot] = useState(false);
  const [fileContents, setFileContents] = useState({
    html: '',
    css: '',
    js: '',
  });

  // Update file contents when room changes
  useEffect(() => {
    if (currentRoom?.codeContent) {
      // For MVP, we'll store HTML content and extract CSS/JS
      const htmlContent = currentRoom.codeContent;
      
      // Simple extraction of CSS and JS from HTML
      const cssMatch = htmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/);
      const jsMatch = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/);
      
      setFileContents({
        html: htmlContent,
        css: cssMatch ? cssMatch[1] : '',
        js: jsMatch ? jsMatch[1] : '',
      });
    }
  }, [currentRoom?.codeContent]);

  const getCurrentFile = () => {
    const fileMap = {
      html: { name: 'index.html', content: fileContents.html, language: 'html' },
      css: { name: 'styles.css', content: fileContents.css, language: 'css' },
      js: { name: 'script.js', content: fileContents.js, language: 'javascript' },
    };
    return fileMap[selectedFile as keyof typeof fileMap] || fileMap.html;
  };

  const handleCodeChange = (content: string) => {
    console.log('Code changed:', content);
    
    // Update local state
    setFileContents(prev => ({
      ...prev,
      [selectedFile]: content
    }));

    // For HTML changes, update the room content
    if (selectedFile === 'html') {
      updateCode(content);
    }
  };

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      user: currentUser?.username || 'You',
      content,
      timestamp: new Date(),
      color: currentUser?.color || '#8B5CF6',
    };
    setMessages([...messages, newMessage]);
  };

  const handleShare = () => {
    if (currentRoom?.code) {
      navigator.clipboard.writeText(`Join my Link coding session with code: ${currentRoom.code}`);
    }
  };

  const handleSettings = () => {
    console.log('Opening settings...');
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFile(fileId);
  };

  const handleCreateFile = (name: string, type: 'file' | 'folder') => {
    console.log('Creating:', type, name);
  };

  const handleRoomJoined = () => {
    // Room setup complete, show the main interface
  };

  // Show room setup if user hasn't joined a room yet
  if (!currentRoom || !currentUser) {
    return <RoomSetup onRoomJoined={handleRoomJoined} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ProjectHeader
        onShare={handleShare}
        onSettings={handleSettings}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer with Action Buttons */}
        <div className="w-64 flex-shrink-0 bg-slate-800/50 backdrop-blur border-r border-slate-700 flex flex-col">
          <div className="flex-1">
            <FileExplorer
              files={mockFiles}
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              onCreateFile={handleCreateFile}
            />
          </div>
          <ActionButtons
            fileName={getCurrentFile().name}
            fileContent={getCurrentFile().content}
            onRun={() => console.log('Run code')}
            onSave={() => console.log('Save file')}
            onRefresh={() => console.log('Refresh preview')}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex min-w-0">
          {/* Code Editor */}
          <div className="flex-1 min-w-0">
            <CodeEditor
              file={getCurrentFile()}
              users={participants.map(p => ({
                id: p.id,
                name: p.username,
                color: p.color,
                cursor: p.cursorPosition
              }))}
              onCodeChange={handleCodeChange}
            />
          </div>

          {/* Live Preview */}
          <div className="w-96 flex-shrink-0 border-l border-slate-700">
            <LivePreview
              htmlContent={fileContents.html}
              cssContent={fileContents.css}
              jsContent={fileContents.js}
            />
          </div>
        </div>

        {/* Right Panel - Chat and AI Copilot */}
        <div className="w-80 flex-shrink-0 flex flex-col">
          {/* Panel Toggle Buttons */}
          <div className="flex bg-slate-800/50 backdrop-blur border-l border-slate-700">
            <button
              onClick={() => { setShowChat(true); setShowCopilot(false); }}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                showChat && !showCopilot 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => { setShowCopilot(true); setShowChat(false); }}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                showCopilot && !showChat 
                  ? 'bg-purple-600 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              AI Copilot
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 min-h-0">
            {showChat && (
              <ChatPanel
                messages={messages}
                currentUser={currentUser?.username || 'You'}
                onSendMessage={handleSendMessage}
              />
            )}
            {showCopilot && (
              <AICopilot
                currentCode={getCurrentFile().content}
                language={getCurrentFile().language}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
