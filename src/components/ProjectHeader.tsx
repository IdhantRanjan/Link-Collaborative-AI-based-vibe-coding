
import React, { useState } from 'react';
import { Share2, Users, Settings, Code2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '@/stores/roomStore';

interface User {
  id: string;
  name: string;
  color: string;
}

interface ProjectHeaderProps {
  projectName?: string;
  users?: User[];
  onShare?: () => void;
  onSettings?: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  onShare,
  onSettings,
}) => {
  const { currentRoom, participants, leaveRoom } = useRoomStore();
  const [copied, setCopied] = useState(false);

  const handleCopyRoomCode = async () => {
    if (currentRoom?.code) {
      await navigator.clipboard.writeText(currentRoom.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    window.location.reload(); // Simple way to reset the app state
  };

  if (!currentRoom) return null;

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Link</h1>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Room:</span>
              <code className="text-sm font-mono text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">
                {currentRoom.code}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyRoomCode}
                className="h-6 w-6 p-0 text-slate-400 hover:text-white"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Center section - User avatars */}
      <div className="flex items-center space-x-3">
        <Users className="w-4 h-4 text-slate-400" />
        <div className="flex -space-x-2">
          {participants.slice(0, 5).map((user, index) => (
            <div
              key={user.id}
              className="w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-sm font-medium text-white"
              style={{ 
                backgroundColor: user.color,
                zIndex: participants.length - index 
              }}
              title={user.username}
            >
              {user.username[0].toUpperCase()}
            </div>
          ))}
          {participants.length > 5 && (
            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-600 flex items-center justify-center text-sm font-medium text-white">
              +{participants.length - 5}
            </div>
          )}
        </div>
        <span className="text-sm text-slate-400">
          {participants.length} online
        </span>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyRoomCode}
          className="bg-blue-900/30 border-blue-700 text-blue-400 hover:bg-blue-800/40"
        >
          <Share2 className="w-4 h-4 mr-1" />
          Share Room
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLeaveRoom}
          className="border-red-700 text-red-400 hover:bg-red-900/20"
        >
          Leave
        </Button>
        {onSettings && (
          <Button variant="outline" size="sm" onClick={onSettings}>
            <Settings className="w-4 h-4" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default ProjectHeader;
