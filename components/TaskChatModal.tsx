
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { Task, ChatMessage } from '../types';
import { chatWithTaskAi } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface TaskChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdateTask: (updatedTask: Task) => void;
}

const TaskChatModal: React.FC<TaskChatModalProps> = ({ isOpen, onClose, task, onUpdateTask }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [task?.chatHistory, isOpen]);

  // Initial welcome message logic
  useEffect(() => {
    if (isOpen && task && (!task.chatHistory || task.chatHistory.length === 0)) {
      // Add a local welcome message without calling API
      const welcomeMsg: ChatMessage = {
        id: uuidv4(),
        role: 'model',
        text: `Ciao! Sono il tuo assistente per l'attività "${task.title}". Come posso aiutarti a completarla?`,
        timestamp: Date.now()
      };
      
      onUpdateTask({
        ...task,
        chatHistory: [welcomeMsg]
      });
    }
  }, [isOpen, task]); // Removed onUpdateTask from dependencies to avoid loop

  if (!isOpen || !task) return null;

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      text: input.trim(),
      timestamp: Date.now()
    };

    // Optimistic update
    const updatedHistory = [...(task.chatHistory || []), userMsg];
    const tempTask = { ...task, chatHistory: updatedHistory };
    onUpdateTask(tempTask);
    
    setInput('');
    setIsLoading(true);

    // Call AI
    const responseText = await chatWithTaskAi(task, userMsg.text, updatedHistory);

    const aiMsg: ChatMessage = {
      id: uuidv4(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    onUpdateTask({
      ...task,
      chatHistory: [...updatedHistory, aiMsg]
    });
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 transition-all">
      <div className="bg-white w-full h-[90vh] sm:h-[600px] max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 line-clamp-1">{task.title}</h2>
              <p className="text-xs text-slate-500">Assistente AI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
          {task.chatHistory?.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-violet-600 text-white'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-white text-slate-800 rounded-tr-none' 
                    : 'bg-violet-600 text-white rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="flex max-w-[85%] gap-2">
                 <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-violet-600 text-white">
                    <Bot size={14} />
                 </div>
                 <div className="bg-violet-50 text-violet-400 p-3 rounded-2xl rounded-tl-none text-xs font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"></span>
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 safe-bottom">
          <form onSubmit={handleSend} className="flex gap-2 items-center bg-slate-100 p-1.5 rounded-full border border-slate-200 focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
            <input
              autoFocus
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Chiedi un consiglio o aiuto..."
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600 text-white rounded-full flex items-center justify-center transition-all shadow-sm flex-shrink-0"
            >
              <Send size={16} className={input.trim() ? 'ml-0.5' : ''} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default TaskChatModal;
