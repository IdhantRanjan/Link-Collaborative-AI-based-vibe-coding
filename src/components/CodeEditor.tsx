
import React, { useState, useRef, useEffect } from 'react';
import { Play, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string;
  color: string;
  cursor?: { line: number; column: number };
}

interface CodeEditorProps {
  file: { name: string; content: string; language: string };
  users: User[];
  onCodeChange: (content: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ file, users, onCodeChange }) => {
  const [code, setCode] = useState(file.content);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, column: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleCursorMove = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const lines = textarea.value.substring(0, textarea.selectionStart).split('\n');
    const line = lines.length - 1;
    const column = lines[lines.length - 1].length;
    setCursorPosition({ line, column });
  };

  const runCode = () => {
    // Simulate code execution
    console.log('Running code:', code);
  };

  const saveFile = () => {
    console.log('Saving file:', file.name);
  };

  const downloadFile = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium text-white">{file.name}</h3>
          <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
            {file.language}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" onClick={runCode} className="bg-green-600 hover:bg-green-700">
            <Play className="w-4 h-4 mr-1" />
            Run
          </Button>
          <Button size="sm" variant="outline" onClick={saveFile}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={downloadFile}>
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      {/* Collaborative Cursors */}
      <div className="flex-1 relative">
        <div className="absolute top-2 right-2 z-10 flex -space-x-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
              style={{ backgroundColor: user.color }}
              title={user.name}
            >
              {user.name[0].toUpperCase()}
            </div>
          ))}
        </div>

        {/* Code Editor */}
        <div className="h-full relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              handleCodeChange(e);
              handleCursorMove(e);
            }}
            className="w-full h-full p-4 bg-transparent text-white font-mono text-sm resize-none outline-none border-none"
            style={{ fontFamily: 'Fira Code, Monaco, Consolas, monospace' }}
            placeholder="Start coding..."
            spellCheck={false}
          />
          
          {/* Live cursors from other users */}
          {users.map((user) => 
            user.cursor && (
              <div
                key={`cursor-${user.id}`}
                className="absolute pointer-events-none"
                style={{
                  top: `${user.cursor.line * 1.5 + 1}rem`,
                  left: `${user.cursor.column * 0.6 + 1}rem`,
                }}
              >
                <div
                  className="w-0.5 h-5 animate-pulse"
                  style={{ backgroundColor: user.color }}
                />
                <div
                  className="absolute -top-6 left-0 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 bg-slate-800 border-t border-slate-700 text-xs text-slate-400">
        <div>Line {cursorPosition.line + 1}, Column {cursorPosition.column + 1}</div>
        <div className="flex items-center space-x-4">
          <span>{users.length} user{users.length !== 1 ? 's' : ''} online</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
