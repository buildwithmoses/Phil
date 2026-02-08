
export interface Church {
  id: string;
  name: string;
  logo: string;
  color: string;
  lastSermon?: string;
  groupCount?: number;
}

export interface Sermon {
  id: string;
  title: string;
  date: string;
  speaker: string;
  churchName: string;
  summary: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  churchId?: string;
  citations?: Sermon[];
}

export interface Conversation {
  id: string;
  title: string;
  lastMessageAt: Date;
}

export interface SmallGroup {
  id: string;
  name: string;
  churchId: string;
  meetingTime: string;
  location: string;
  focus: string[];
  members: number;
  demographic?: string;
}
