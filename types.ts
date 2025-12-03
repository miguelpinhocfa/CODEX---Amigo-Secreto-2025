export enum GameState {
  LOCKED = 'LOCKED',
  PLAYING = 'PLAYING',
  UNLOCKED = 'UNLOCKED',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface UnlockAttemptResponse {
  success: boolean;
  message: string;
}