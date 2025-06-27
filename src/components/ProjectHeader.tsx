
import React from 'react';
import { Share2, Users, Settings, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string;
  color: string;
}

interface ProjectHeaderProps {
  projectName: string;
  users: User[];
  onShare: () => void;
  onSettings: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName,
  users,
  onShare,
  onSettings,
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-slate-800">{projectName}</h1>
        </div>
      </div>

      {/* Center section - User avatars */}
      <div className="flex items-center space-x-2">
        <Users className="w-4 h-4 text-slate-500" />
        <div className="flex -space-x-2">
          {users.slice(0, 5).map((user, index) => (
            <div
              key={user.id}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm font-medium text-white"
              style={{ 
                backgroundColor: user.color,
                zIndex: users.length - index 
              }}
              title={user.name}
            >
              {user.name[0].toUpperCase()}
            </div>
          ))}
          {users.length > 5 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400 flex items-center justify-center text-sm font-medium text-white">
              +{users.length - 5}
            </div>
          )}
        </div>
        <span className="text-sm text-slate-600 ml-2">
          {users.length} online
        </span>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
        <Button variant="outline" size="sm" onClick={onSettings}>
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};

export default ProjectHeader;
