import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  color: string;
  isActive?: boolean;
  cursorPosition?: { line: number; column: number } | null;
}

interface Room {
  id: string;
  code: string;
  createdAt: string;
  codeContent: string;
}

interface RoomStore {
  currentRoom: Room | null;
  currentUser: User | null;
  participants: User[];
  createRoom: (username: string) => Promise<void>;
  joinRoom: (code: string, username: string) => Promise<boolean>;
  leaveRoom: () => void;
  updateCode: (content: string) => void;
}

const generateRoomCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const generateUserColor = (): string => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#06B6D4', '#A855F7'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useRoomStore = create<RoomStore>((set, get) => ({
  currentRoom: null,
  currentUser: null,
  participants: [],

  createRoom: async (username: string) => {
    const roomCode = generateRoomCode();
    const userColor = generateUserColor();
    const userId = Math.random().toString(36).substring(2, 15);

    const newRoom = {
      id: Math.random().toString(36).substring(2, 15),
      code: roomCode,
      createdAt: new Date().toISOString(),
      codeContent: '<!DOCTYPE html>\n<html>\n<head>\n<title>Link</title>\n<style>\nbody {\n  font-family: sans-serif;\n  margin: 0;\n}\n\n.container {\n  padding: 20px;\n}\n</style>\n</head>\n<body>\n  <div class="container">\n    <h1>Hello, world!</h1>\n    <p>Edit this code and see the changes live.</p>\n  </div>\n</body>\n</html>'
    };

    const newUser = {
      id: userId,
      username: username,
      color: userColor,
    };

    set({ currentRoom: newRoom, currentUser: newUser, participants: [newUser] });

    // Initialize Supabase channel for real-time updates
    setupRoomSubscription(roomCode, set);
  },

  joinRoom: async (code: string, username: string) => {
    const userColor = generateUserColor();
    const userId = Math.random().toString(36).substring(2, 15);

    // Fetch the room from Supabase (replace with your actual Supabase fetch logic)
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', code)
      .single();

    if (roomError) {
      console.error('Failed to fetch room:', roomError);
      return false;
    }

    const existingRoom = {
      id: Math.random().toString(36).substring(2, 15),
      code: code,
      createdAt: new Date().toISOString(),
      codeContent: '<!DOCTYPE html>\n<html>\n<head>\n<title>Link</title>\n<style>\nbody {\n  font-family: sans-serif;\n  margin: 0;\n}\n\n.container {\n  padding: 20px;\n}\n</style>\n</head>\n<body>\n  <div class="container">\n    <h1>Hello, world!</h1>\n    <p>Edit this code and see the changes live.</p>\n  </div>\n</body>\n</html>'
    };

    const newUser = {
      id: userId,
      username: username,
      color: userColor,
    };

    set({ currentRoom: existingRoom, currentUser: newUser, participants: [...get().participants, newUser] });

    // Initialize Supabase channel for real-time updates
    setupRoomSubscription(code, set);

    return true;
  },

  leaveRoom: () => {
    const { currentRoom } = get();
    if (currentRoom) {
      const channel = supabase.channel(`room:${currentRoom.code}`);
      channel.untrack();
      supabase.removeChannel(channel);
    }
    set({ currentRoom: null, currentUser: null, participants: [] });
  },

  updateCode: (content: string) => {
    const { currentRoom } = get();
    if (currentRoom) {
      set({ currentRoom: { ...currentRoom, codeContent: content } });
      
      const channel = supabase.channel(`room:${currentRoom.code}`);
      channel.send({
        type: 'broadcast',
        event: 'code_change',
        payload: { content }
      });
    }
  },
}));

// Helper function to setup room subscription
const setupRoomSubscription = (roomCode: string, set: any) => {
  const channel = supabase.channel(`room:${roomCode}`)
    .on('broadcast', { event: 'code_change' }, (payload) => {
      console.log('Code change received:', payload);
      set((state: any) => ({
        currentRoom: state.currentRoom ? {
          ...state.currentRoom,
          codeContent: payload.payload.content
        } : null
      }));
    })
    .on('presence', { event: 'sync' }, () => {
      console.log('Presence sync');
      const presenceState = channel.presenceState();
      const users = Object.values(presenceState).flat().map((presence: any) => ({
        id: presence.user_id,
        username: presence.username,
        color: presence.color,
        isActive: true,
        cursorPosition: 0
      }));
      set({ participants: users });
    })
    .on('presence', { event: 'join' }, ({ newPresences }) => {
      console.log('User joined:', newPresences);
    })
    .on('presence', { event: 'leave' }, ({ leftPresences }) => {
      console.log('User left:', leftPresences);
    })
    .subscribe();

  return channel;
};
