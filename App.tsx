
import React, { useState, useEffect } from 'react';
import { Plus, ListTodo, HelpCircle, Layout, Calendar, CheckCircle2, Moon, Sun } from 'lucide-react';
import { Task, ViewType, FilterType, SubTask } from './types';
import TaskItem from './components/TaskItem';
import AddTaskModal from './components/AddTaskModal';
import TaskChatModal from './components/TaskChatModal';
import TutorialView from './components/TutorialView';
import { generateSubtasks } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<ViewType>('tasks');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme');
        if (saved) {
            return saved === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  // Chat state
  const [chatTask, setChatTask] = useState<Task | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [loadingAi, setLoadingAi] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tasks", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Apply Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt' | 'subtasks' | 'chatHistory'>) => {
    const task: Task = {
      ...newTask,
      id: uuidv4(),
      createdAt: Date.now(),
      subtasks: [],
      chatHistory: []
    };
    setTasks(prev => [task, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Update a single task (used by chat to save history)
  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    // Also update the currently open chat task reference to keep UI in sync
    if (chatTask && chatTask.id === updatedTask.id) {
        setChatTask(updatedTask);
    }
  };

  const handleOpenChat = (task: Task) => {
    setChatTask(task);
    setIsChatOpen(true);
  };

  const handleGenerateSubtasks = async (task: Task) => {
    setLoadingAi(task.id);
    const subtaskTexts = await generateSubtasks(task.title);
    
    if (subtaskTexts.length > 0) {
      const newSubtasks: SubTask[] = subtaskTexts.map(text => ({
        id: uuidv4(),
        text,
        completed: false
      }));

      setTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, subtasks: [...t.subtasks, ...newSubtasks] } : t
      ));
    }
    setLoadingAi(null);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = tasks.filter(t => !t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : Math.round(((totalCount - activeCount) / totalCount) * 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buongiorno';
    if (hour < 18) return 'Buon pomeriggio';
    return 'Buonasera';
  };

  if (view === 'tutorial') {
    return <TutorialView onBack={() => setView('tasks')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 pb-28 transition-colors duration-300">
      
      {/* Header Moderno */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200/60 dark:border-slate-800/60 safe-top transition-all duration-300">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-0.5">{getGreeting()},</p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Le tue Attività</h1>
            </div>
            <div className="flex gap-2">
                <button 
                  onClick={toggleTheme}
                  className="group p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95"
                  title="Cambia Tema"
                >
                  {darkMode ? <Sun size={22} className="group-hover:rotate-45 transition-transform" /> : <Moon size={22} className="group-hover:-rotate-12 transition-transform" />}
                </button>
                <button 
                  onClick={() => setView('tutorial')}
                  className="group p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95"
                  title="Guida Installazione"
                >
                  <HelpCircle size={22} className="group-hover:rotate-12 transition-transform" />
                </button>
            </div>
          </div>

          {/* Progress Widget */}
          {tasks.length > 0 && (
            <div className="mb-5 flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-9 text-right">{progress}%</span>
            </div>
          )}
          
          {/* Filters Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-5 px-5">
             {(['all', 'active', 'completed'] as const).map(f => (
               <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                    filter === f 
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600 shadow-lg shadow-slate-200 dark:shadow-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
               >
                 {f === 'all' ? 'Tutte' : f === 'active' ? 'Da fare' : 'Completate'}
               </button>
             ))}
          </div>
        </div>
      </header>

      {/* Main List */}
      <main className="max-w-2xl mx-auto px-4 pt-4">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl flex items-center justify-center mb-6 shadow-inner text-indigo-300 dark:text-indigo-500">
              {filter === 'completed' ? <CheckCircle2 size={40} /> : <ListTodo size={40} />}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              {filter === 'completed' ? 'Nessuna attività completata' : 'Tutto pulito!'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              {filter === 'completed' 
                ? 'Completa qualche task per vederlo apparire qui.' 
                : 'Goditi il tuo tempo libero o tocca il + per aggiungere un nuovo obiettivo.'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
             {filteredTasks.map(task => (
               <TaskItem 
                 key={task.id} 
                 task={task} 
                 onToggle={toggleTask} 
                 onDelete={deleteTask}
                 onGenerateSubtasks={handleGenerateSubtasks}
                 onOpenChat={handleOpenChat}
                 isGenerating={loadingAi === task.id}
               />
             ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-8 right-6 z-20">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="group relative bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white w-16 h-16 rounded-2xl shadow-2xl shadow-slate-400/50 dark:shadow-black/50 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-90"
        >
          <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      <AddTaskModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={addTask} 
      />

      <TaskChatModal 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        task={chatTask}
        onUpdateTask={updateTask}
      />
    </div>
  );
};

export default App;