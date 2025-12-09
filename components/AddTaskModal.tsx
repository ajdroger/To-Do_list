
import React, { useState } from 'react';
import { X, ArrowUp, Flag } from 'lucide-react';
import { Task } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'createdAt' | 'subtasks' | 'chatHistory'>) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd({
      title,
      description,
      priority,
      completed: false,
    });
    
    // Reset and close
    setTitle('');
    setDescription('');
    setPriority('medium');
    onClose();
  };

  const priorities = [
    { id: 'low', label: 'Bassa', color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
    { id: 'medium', label: 'Media', color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
    { id: 'high', label: 'Alta', color: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800' }
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 transition-all">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Nuova Attività</h2>
          <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <input
              autoFocus
              type="text"
              placeholder="Cosa devi fare oggi?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 border-none focus:ring-0 p-0 bg-transparent"
            />
            
            <textarea
              placeholder="Aggiungi note o dettagli..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-base text-slate-600 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-600 border-none focus:ring-0 p-0 resize-none h-24 bg-transparent leading-relaxed"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
               <Flag size={12} /> Priorità
            </div>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize border-2 transition-all active:scale-95 ${
                    priority === p.id
                      ? p.color
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
             <button
              type="submit"
              disabled={!title.trim()}
              className="w-full bg-slate-900 dark:bg-indigo-600 text-white p-4 rounded-xl font-semibold shadow-lg shadow-slate-200 dark:shadow-none hover:bg-indigo-600 dark:hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
             >
               <span>Crea Attività</span>
               <ArrowUp size={20} />
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
