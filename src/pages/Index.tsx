
import React, { useState } from 'react';
import ProjectHeader from '@/components/ProjectHeader';
import FileExplorer from '@/components/FileExplorer';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import ChatPanel from '@/components/ChatPanel';

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

const fileContents = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Collaborative Coding</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to Vibe Coding!</h1>
        <p>Start collaborating with your team in real-time.</p>
        <button id="clickMe">Click me!</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
  css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    text-align: center;
    max-width: 500px;
}

h1 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

p {
    color: #666;
    margin-bottom: 2rem;
    font-size: 1.1rem;
}

button {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s;
}

button:hover {
    transform: translateY(-2px);
}`,
  js: `document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('clickMe');
    
    button.addEventListener('click', function() {
        button.textContent = 'Clicked!';
        button.style.background = 'linear-gradient(45deg, #10B981, #059669)';
        
        setTimeout(() => {
            button.textContent = 'Click me!';
            button.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        }, 2000);
    });
});`,
};

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
  const [selectedFile, setSelectedFile] = useState('html');
  const [messages, setMessages] = useState(mockMessages);
  const [showChat, setShowChat] = useState(true);

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
    // In a real app, this would sync with other users
  };

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      user: 'You',
      content,
      timestamp: new Date(),
      color: '#8B5CF6',
    };
    setMessages([...messages, newMessage]);
  };

  const handleShare = () => {
    console.log('Sharing project...');
    // In a real app, this would generate a shareable link
  };

  const handleSettings = () => {
    console.log('Opening settings...');
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFile(fileId);
  };

  const handleCreateFile = (name: string, type: 'file' | 'folder') => {
    console.log('Creating:', type, name);
    // In a real app, this would create a new file/folder
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <ProjectHeader
        projectName="My Awesome Project"
        users={mockUsers}
        onShare={handleShare}
        onSettings={handleSettings}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        <div className="w-64 flex-shrink-0">
          <FileExplorer
            files={mockFiles}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onCreateFile={handleCreateFile}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className="flex-1">
            <CodeEditor
              file={getCurrentFile()}
              users={mockUsers}
              onCodeChange={handleCodeChange}
            />
          </div>

          {/* Live Preview */}
          <div className="w-96 flex-shrink-0 border-l border-slate-300">
            <LivePreview
              htmlContent={fileContents.html}
              cssContent={fileContents.css}
              jsContent={fileContents.js}
            />
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 flex-shrink-0">
            <ChatPanel
              messages={messages}
              currentUser="You"
              onSendMessage={handleSendMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
