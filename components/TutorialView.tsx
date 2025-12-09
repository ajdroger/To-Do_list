import React from 'react';
import { Smartphone, Download, Settings, ChevronRight, Package, Chrome } from 'lucide-react';

const TutorialView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="h-full overflow-y-auto bg-slate-50 pb-20">
      <div className="bg-white p-6 shadow-sm mb-6 sticky top-0 z-10">
        <button onClick={onBack} className="text-indigo-600 text-sm font-medium mb-2 flex items-center">
           ← Torna alla lista
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Guida Installazione</h1>
        <p className="text-slate-500">Come trasformare questa pagina in un'App Android</p>
      </div>

      <div className="px-4 space-y-6 max-w-2xl mx-auto">
        
        {/* Method 1: PWA */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Smartphone size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Metodo 1: Installazione Rapida (Consigliato)</h2>
          </div>
          <p className="text-slate-600 text-sm mb-4">
            Il metodo più moderno non richiede un file APK. Questa è una <strong>Progressive Web App (PWA)</strong>.
          </p>
          <div className="space-y-4">
             <div className="flex gap-3">
               <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">1</span>
               <p className="text-sm text-slate-700">Apri questa pagina con <strong>Google Chrome</strong> sul tuo telefono Android.</p>
             </div>
             <div className="flex gap-3">
               <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">2</span>
               <p className="text-sm text-slate-700">Tocca l'icona del menu (tre puntini verticali) in alto a destra.</p>
             </div>
             <div className="flex gap-3">
               <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">3</span>
               <p className="text-sm text-slate-700">Seleziona <strong>"Aggiungi a schermata Home"</strong> o <strong>"Installa app"</strong>.</p>
             </div>
          </div>
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-xs text-indigo-800 border border-indigo-100">
            <strong>Risultato:</strong> L'app apparirà nel tuo drawer delle app e sulla home screen, funzionerà a schermo intero e offline, proprio come un'app scaricata dal Play Store.
          </div>
        </div>

        {/* Method 2: APK Build */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 opacity-90">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Package size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Metodo 2: Generare l'APK (Per Sviluppatori)</h2>
          </div>
          <p className="text-slate-600 text-sm mb-4">
            Se desideri un file <code>.apk</code> fisico da distribuire, devi "impacchettare" questo codice React.
          </p>
          
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
            <p className="text-slate-500 mb-2"># 1. Installa Capacitor (nel progetto React)</p>
            <p className="text-emerald-400">npm install @capacitor/core @capacitor/cli @capacitor/android</p>
            <p className="text-emerald-400">npx cap init</p>
            
            <p className="text-slate-500 mt-4 mb-2"># 2. Compila il progetto Web</p>
            <p className="text-emerald-400">npm run build</p>

            <p className="text-slate-500 mt-4 mb-2"># 3. Aggiungi la piattaforma Android</p>
            <p className="text-emerald-400">npx cap add android</p>
            
            <p className="text-slate-500 mt-4 mb-2"># 4. Sincronizza e apri Android Studio</p>
            <p className="text-emerald-400">npx cap sync</p>
            <p className="text-emerald-400">npx cap open android</p>
          </div>
          
          <p className="text-xs text-slate-500 mt-3">
            Da Android Studio, potrai andare su <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK</strong> per ottenere il file installabile.
          </p>
        </div>

      </div>
    </div>
  );
};

export default TutorialView;
