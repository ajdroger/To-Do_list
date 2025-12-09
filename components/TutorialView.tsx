
import React from 'react';
import { Smartphone, Download, Settings, ChevronRight, Package, Chrome, Monitor } from 'lucide-react';

const TutorialView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      <div className="bg-white dark:bg-slate-900 p-6 shadow-sm mb-6 sticky top-0 z-10 transition-colors">
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-2 flex items-center">
            ← Torna alla lista
            </button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Guida Installazione</h1>
            <p className="text-slate-500 dark:text-slate-400">Installa TaskMaster AI su Android, Tablet o PC</p>
        </div>
      </div>

      <div className="px-4 space-y-6 max-w-4xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Method 1: PWA Android */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Smartphone size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Mobile & Tablet</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                Installa come App Nativa (PWA) su Android.
            </p>
            <div className="space-y-4">
                <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center">1</span>
                <p className="text-sm text-slate-700 dark:text-slate-300">Apri in <strong>Chrome</strong> su Android.</p>
                </div>
                <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center">2</span>
                <p className="text-sm text-slate-700 dark:text-slate-300">Tocca il menu (tre puntini).</p>
                </div>
                <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center">3</span>
                <p className="text-sm text-slate-700 dark:text-slate-300">Seleziona <strong>"Aggiungi a Home"</strong> o "Installa".</p>
                </div>
            </div>
            </div>

            {/* Method 2: PC/Desktop */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Monitor size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">PC & Mac</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                Installa su Desktop tramite Chrome o Edge.
            </p>
            <div className="space-y-4">
                <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center">1</span>
                <p className="text-sm text-slate-700 dark:text-slate-300">Guarda nella barra degli indirizzi (in alto a destra).</p>
                </div>
                <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center">2</span>
                <p className="text-sm text-slate-700 dark:text-slate-300">Clicca sull'icona <Monitor size={14} className="inline mx-1"/> (Monitor con freccia) o "+".</p>
                </div>
                <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center">3</span>
                <p className="text-sm text-slate-700 dark:text-slate-300">Clicca su <strong>Installa</strong> nel popup.</p>
                </div>
            </div>
             <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                <strong>Vantaggio:</strong> L'app si aprirà in una finestra indipendente senza barra degli indirizzi, perfetta per il multitasking.
             </div>
            </div>
        </div>

        {/* Method 3: APK Build */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 opacity-90 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Package size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Generare l'APK (Sviluppatori)</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
            Per distribuire un file <code>.apk</code> fisico, usa CapacitorJS con questo progetto React.
          </p>
          
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
            <p className="text-slate-500 mb-2"># 1. Setup Ambiente</p>
            <p className="text-emerald-400">npm install @capacitor/core @capacitor/cli @capacitor/android</p>
            <p className="text-emerald-400">npx cap init</p>
            
            <p className="text-slate-500 mt-4 mb-2"># 2. Build & Sync</p>
            <p className="text-emerald-400">npm run build</p>
            <p className="text-emerald-400">npx cap add android</p>
            <p className="text-emerald-400">npx cap sync</p>
            
            <p className="text-slate-500 mt-4 mb-2"># 3. Compilazione</p>
            <p className="text-emerald-400">npx cap open android</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TutorialView;
