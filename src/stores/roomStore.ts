
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  color: string;
  cursorPosition?: { line: number; column: number };
  isActive: boolean;
}

interface Room {
  id: string;
  code: string;
  createdAt: string;
  participants: User[];
  codeContent: string;
  language: string;
}

interface RoomState {
  currentRoom: Room | null;
  currentUser: User | null;
  isConnected: boolean;
  participants: User[];
  setCurrentRoom: (room: Room | null) => void;
  setCurrentUser: (user: User | null) => void;
  updateParticipants: (participants: User[]) => void;
  createRoom: (username: string) => Promise<string>;
  joinRoom: (roomCode: string, username: string) => Promise<boolean>;
  leaveRoom: () => void;
  updateCode: (content: string) => void;
}

// Generate random 6-character room code
const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate random color for user
const generateUserColor = () => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useRoomStore = create<RoomState>((set, get) => ({
  currentRoom: null,
  currentUser: null,
  isConnected: false,
  participants: [],

  setCurrentRoom: (room) => set({ currentRoom: room }),
  setCurrentUser: (user) => set({ currentUser: user }),
  updateParticipants: (participants) => set({ participants }),

  createRoom: async (username: string) => {
    const roomCode = generateRoomCode();
    const user: User = {
      id: crypto.randomUUID(),
      username,
      color: generateUserColor(),
      isActive: true,
    };

    const room: Room = {
      id: crypto.randomUUID(),
      code: roomCode,
      createdAt: new Date().toISOString(),
      participants: [user],
      codeContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Link Coding Session</title>
    <style>
        body {
            font-family: 'Inter', system-ui, sans-serif;
            margin: 0;
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        h1 {
            color: #1e293b;
            margin-bottom: 1rem;
            font-size: 2.5rem;
        }
        p {
            color: #64748b;
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }
        button {
            background: linear-gradient(45deg, #3b82f6, #1e40af);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Link!</h1>
        <p>Start collaborating with your team in real-time.</p>
        <button onclick="celebrate()">Click me!</button>
    </div>
    
    <script>
        function celebrate() {
            const button = event.target;
            button.textContent = 'Amazing! 🎉';
            button.style.background = 'linear-gradient(45deg, #10B981, #059669)';
            
            setTimeout(() => {
                button.textContent = 'Click me!';
                button.style.background = 'linear-gradient(45deg, #3b82f6, #1e40af)';
            }, 2000);
        }
    </script>
</body>
</html>`,
      language: 'html',
    };

    set({ currentRoom: room, currentUser: user, participants: [user], isConnected: true });
    
    // Subscribe to room channel for real-time updates
    const channel = supabase.channel(`room:${roomCode}`)
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const participants = Object.values(newState).flat() as User[];
        get().updateParticipants(participants);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(user);
        }
      });

    return roomCode;
  },

  joinRoom: async (roomCode: string, username: string) => {
    const user: User = {
      id: crypto.randomUUID(),
      username,
      color: generateUserColor(),
      isActive: true,
    };

    // In a real implementation, you'd fetch room data from your backend
    // For MVP, we'll create a mock room
    const room: Room = {
      id: crypto.randomUUID(),
      code: roomCode,
      createdAt: new Date().toISOString(),
      participants: [user],
      codeContent: get().currentRoom?.codeContent || `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Link Coding Session</title>
</head>
<body>
    <h1>Welcome to Room ${roomCode}!</h1>
    <p>Start coding together...</p>
</body>
</html>`,
      language: 'html',
    };

    set({ currentRoom: room, currentUser: user, participants: [user], isConnected: true });

    // Subscribe to room channel
    const channel = supabase.channel(`room:${roomCode}`)
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const participants = Object.values(newState).flat() as User[];
        get().updateParticipants(participants);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(user);
        }
      });

    return true;
  },

  leaveRoom: () => {
    const { currentRoom } = get();
    if (currentRoom) {
      supabase.removeChannel(supabase.channel(`room:${currentRoom.code}`));
    }
    set({ currentRoom: null, currentUser: null, participants: [], isConnected: false });
  },

  updateCode: (content: string) => {
    const { currentRoom } = get();
    if (currentRoom) {
      set({ currentRoom: { ...currentRoom, codeContent: content } });
      
      // Broadcast code changes to other participants
      const channel = supabase.channel(`room:${currentRoom.code}`);
      channel.send({
        type: 'broadcast',
        event: 'code_change',
        payload: { content, timestamp: Date.now() }
      });
    }
  },
}));
