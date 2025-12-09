
import React, { useState } from 'react';
import { Task } from '../types';
import { Check, Trash2, ChevronDown, ChevronUp, Sparkles, Clock, MessageCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onGenerateSubtasks: (task: Task) => void;
  onOpenChat: (task: Task) => void;
  isGenerating: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onGenerateSubtasks, onOpenChat, isGenerating }) => {
  const [expanded, setExpanded] = useState(false);

  const priorityConfig = {
    low: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Bassa' },
    medium: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'Media' },
    high: { color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', label: 'Alta' }
  };

  return (
    <div className={`group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 break-inside-avoid overflow-hidden transition-all duration-300 ${task.completed ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-md dark:hover:shadow-slate-900/20'}`}>
      <div className="p-4 flex items-start gap-3 relative">
        
        {/* Checkbox personalizzata */}
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            task.completed 
              ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500 scale-100' 
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-400'
          }`}
        >
          {task.completed && <Check size={14} className="text-white stroke-[3]" />}
        </button>

        {/* Contenuto Principale */}
        <div className="flex-1 min-w-0 pt-0.5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex justify-between items-start gap-2">
            <h3 className={`text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug transition-all ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
              {task.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${priorityConfig[task.priority].color}`}>
              {priorityConfig[task.priority].label}
            </span>
            
            {task.description && (
               <span className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[150px] flex items-center gap-1">
                 • {task.description}
               </span>
            )}

            {task.subtasks.length > 0 && (
               <span className="text-xs font-medium text-indigo-500 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md">
                 {task.subtasks.filter(t => t.completed).length}/{task.subtasks.length} step
               </span>
            )}

            {task.chatHistory && task.chatHistory.length > 0 && (
              <span className="text-xs font-medium text-violet-500 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                 <MessageCircle size={10} /> {task.chatHistory.length}
              </span>
            )}
          </div>
        </div>

        <button 
          onClick={() => setExpanded(!expanded)}
          className="p-1 text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-colors"
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Area Espansa */}
      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
            <div className="px-4 pb-4 pt-0">
               <div className="h-px w-full bg-slate-100 dark:bg-slate-700 mb-4"></div>
               
               {task.description && (
                 <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 italic">
                    "{task.description}"
                 </p>
               )}
    
               {task.subtasks.length > 0 ? (
                 <ul className="space-y-2 mb-4">
                   {task.subtasks.map((st) => (
                     <li key={st.id} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 group/item animate-in slide-in-from-left-2 duration-300">
                       <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-300 dark:bg-indigo-600 group-hover/item:bg-indigo-500 dark:group-hover/item:bg-indigo-400 transition-colors"></div>
                       <span className="leading-relaxed">{st.text}</span>
                     </li>
                   ))}
                 </ul>
               ) : (
                 !task.completed && (
                    <div className="mb-4">
                        <button
                          onClick={() => onGenerateSubtasks(task)}
                          disabled={isGenerating}
                          className="w-full relative overflow-hidden group/btn flex items-center justify-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 py-3 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:shadow-sm disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                          <Sparkles size={16} className={isGenerating ? 'animate-spin' : 'text-indigo-500 dark:text-indigo-400'} />
                          {isGenerating ? 'L\'AI sta pensando...' : 'Suggerisci passaggi con AI'}
                        </button>
                    </div>
                 )
               )}

               {/* Action Buttons Row */}
               <div className="flex justify-between items-center pt-2 gap-2">
                 <button
                    onClick={() => onOpenChat(task)}
                    className="flex-1 flex items-center justify-center gap-2 text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
                 >
                    <MessageCircle size={14} /> 
                    {task.chatHistory && task.chatHistory.length > 0 ? 'Continua Chat' : 'Chiedi all\'AI'}
                 </button>

                 <button 
                    onClick={() => onDelete(task.id)}
                    className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-semibold px-3 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                 >
                   <Trash2 size={14} />
                 </button>
               </div>
               
               <div className="mt-3 flex justify-center">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Clock size={10} /> Creata il {new Date(task.createdAt).toLocaleDateString('it-IT')}
                </span>
               </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
