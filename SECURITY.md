# Politica di Sicurezza e Vulnerabilità - TaskMaster AI

Data documento: 09/12/2025
Versione App: 2.2 (Multi-Platform Update)

## Panoramica
TaskMaster AI prende sul serio la sicurezza. Tuttavia, data la natura architetturale del progetto (Single Page Application Client-Side senza backend intermedio) e la recente espansione su piattaforme **Desktop e Tablet**, esistono specifiche limitazioni che gli utenti devono comprendere per proteggere i propri dati.

Questo documento delinea le misure di sicurezza attive e le vulnerabilità note.

---

## 🛡️ Misure di Sicurezza Adottate

### 1. Sanitizzazione dell'Input (XSS Protection)
L'applicazione è costruita su **React 19**, che offre una protezione nativa contro gli attacchi Cross-Site Scripting (XSS).
*   Tutto il contenuto renderizzato nelle viste (Task, Chat) viene automaticamente sottoposto a *escaping* da React prima dell'inserimento nel DOM.
*   Non viene utilizzato `dangerouslySetInnerHTML` o metodi equivalenti che potrebbero permettere l'iniezione di script malevoli tramite i messaggi dell'AI o i titoli delle note.

### 2. HTTPS Enforcement
Come Progressive Web App (PWA), l'applicazione richiede un contesto sicuro (HTTPS) per abilitare i Service Workers e le funzionalità di installazione. Questo garantisce la crittografia dei dati in transito tra il client e i server di Google Gemini.

### 3. Filtri di Sicurezza AI (Google Safety Settings)
Le interazioni con l'Intelligenza Artificiale sono mediate dalle API di Google Gemini. L'API applica filtri nativi per prevenire la generazione di contenuti dannosi, incitamento all'odio o contenuti sessualmente espliciti.

---

## ⚠️ Vulnerabilità Note e Limitazioni Architetturali

### 1. Esposizione della API Key (Client-Side Exposure)
**Livello di Rischio: ALTO**

Poiché l'applicazione comunica direttamente dal browser dell'utente alle API di Google Gemini senza passare per un server proxy intermedio:
*   La variabile `process.env.API_KEY` viene incorporata nel bundle JavaScript durante la fase di build.
*   Un utente esperto può ispezionare il traffico di rete (Network Tab) o il codice sorgente per estrarre la chiave API.

**Raccomandazione:** Non utilizzare questo codice in produzione pubblica con una chiave API collegata a un account di fatturazione senza limiti (quota cap). Per un uso aziendale sicuro, è necessario implementare un backend.

### 2. Archiviazione Dati non Cifrata (LocalStorage)
**Livello di Rischio: MEDIO**

I dati delle attività (Tasks), le preferenze (Tema Dark/Light) e la cronologia delle chat sono salvati nel `localStorage` del browser.
*   **Vulnerabilità:** I dati risiedono in formato JSON testo semplice.
*   **Impatto:** Qualsiasi script dannoso (se dovesse verificarsi un XSS tramite dipendenze terze) potrebbe leggere l'intero database locale.

### 3. Rischi su Dispositivi Condivisi (Desktop/Tablet)
**Livello di Rischio: ALTO (Contestuale)**

Con l'aggiornamento per il supporto **Desktop/PC**, aumenta il rischio di accesso non autorizzato se il dispositivo è condiviso (es. computer di famiglia, biblioteca, ufficio).
*   **Persistenza:** Il `localStorage` non scade alla chiusura della finestra. Se un utente chiude il browser su un PC condiviso senza cancellare i dati di navigazione, l'utente successivo potrà vedere tutte le attività e le chat aprendo il sito.
*   **Mitigazione:** Se usi l'app su un computer non personale, utilizza la **Navigazione in Incognito** o ricorda di cancellare i dati del sito prima di chiudere.

### 4. Visual Hacking (Shoulder Surfing)
**Livello di Rischio: BASSO**

L'utilizzo su schermi grandi (Monitor PC, Tablet) e il nuovo layout a griglia rendono i dati molto più visibili a chi sta intorno fisicamente rispetto allo schermo di uno smartphone.
*   **Consapevolezza:** Prestare attenzione all'ambiente circostante quando si visualizzano task sensibili su monitor di grandi dimensioni.

### 5. Prompt Injection
**Livello di Rischio: BASSO/MEDIO**

L'utente può interagire liberamente con l'AI tramite la chat.
*   **Vulnerabilità:** Un utente potrebbe tentare di "ingannare" l'AI (Jailbreaking) per farle ignorare le istruzioni di sistema.
*   **Impatto:** Limitato all'esperienza dell'utente stesso, poiché le chat sono locali e non condivise.

---

## 🐛 Segnalazione di Bug

Se individui una vulnerabilità di sicurezza non elencata sopra, sei pregato di non aprire una issue pubblica su GitHub immediatamente.

1.  Invia una email al team di sviluppo (simulato).
2.  Includi passaggi per riprodurre il problema.
3.  Attendi una conferma prima di divulgare pubblicamente il problema.

---

## Dichiarazione di Esclusione di Responsabilità (Disclaimer)
Questo software è fornito "così com'è", senza garanzie di alcun tipo. L'utilizzo dell'applicazione e delle API di Google Gemini è a rischio e pericolo dell'utente. Gli sviluppatori non sono responsabili per eventuali costi derivanti dall'uso delle API Key, dalla perdita di dati salvati localmente o dall'accesso non autorizzato su dispositivi condivisi.