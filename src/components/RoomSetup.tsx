
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Code2, Plus, LogIn } from 'lucide-react';
import { useRoomStore } from '@/stores/roomStore';

interface RoomSetupProps {
  onRoomJoined: () => void;
}

const RoomSetup: React.FC<RoomSetupProps> = ({ onRoomJoined }) => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createRoom, joinRoom } = useRoomStore();

  const handleCreateRoom = async () => {
    if (!username.trim()) return;
    
    setIsLoading(true);
    try {
      await createRoom(username.trim());
      onRoomJoined();
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!username.trim() || !roomCode.trim()) return;
    
    setIsLoading(true);
    try {
      const success = await joinRoom(roomCode.toUpperCase(), username.trim());
      if (success) {
        onRoomJoined();
      }
    } catch (error) {
      console.error('Failed to join room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Code2 className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Link</h1>
          <p className="text-slate-400">Collaborative coding made simple</p>
        </div>

        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-center">Get Started</CardTitle>
            <CardDescription className="text-slate-300 text-center">
              Create a new room or join an existing one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-slate-200 block mb-2">
                  Your Name
                </label>
                <Input
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="create" className="data-[state=active]:bg-blue-600">
                  Create Room
                </TabsTrigger>
                <TabsTrigger value="join" className="data-[state=active]:bg-blue-600">
                  Join Room
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="create" className="space-y-4">
                <Button
                  onClick={handleCreateRoom}
                  disabled={!username.trim() || isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isLoading ? 'Creating...' : 'Create New Room'}
                </Button>
              </TabsContent>
              
              <TabsContent value="join" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-200 block mb-2">
                    Room Code
                  </label>
                  <Input
                    placeholder="Enter 6-character code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                    maxLength={6}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={handleJoinRoom}
                  disabled={!username.trim() || !roomCode.trim() || isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {isLoading ? 'Joining...' : 'Join Room'}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-center mt-6 text-slate-400">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">Up to 10 people per room</span>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-slate-400 text-sm">
          No account needed • Start coding instantly
        </div>
      </div>
    </div>
  );
};

export default RoomSetup;
