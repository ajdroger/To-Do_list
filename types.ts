
export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
  subtasks: SubTask[];
  priority: 'low' | 'medium' | 'high';
  chatHistory: ChatMessage[];
}

export type FilterType = 'all' | 'active' | 'completed';

export type ViewType = 'tasks' | 'tutorial' | 'settings';
