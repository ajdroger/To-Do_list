# Politica di Sicurezza e Vulnerabilità - TaskMaster AI

Data documento: 09/12/2025
Versione App: 2.1

## Panoramica
TaskMaster AI prende sul serio la sicurezza, tuttavia, data la natura architetturale del progetto (Single Page Application Client-Side senza backend intermedio), esistono specifiche limitazioni di sicurezza che gli sviluppatori e gli utenti devono comprendere.

Questo documento delinea le misure di sicurezza attive e le vulnerabilità note.

---

## 🛡️ Misure di Sicurezza Adottate

### 1. Sanitizzazione dell'Input (XSS Protection)
L'applicazione è costruita su **React 19**, che offre una protezione nativa contro gli attacchi Cross-Site Scripting (XSS).
*   Tutto il contenuto renderizzato nelle viste (Task, Chat) viene automaticamente sottoposto a *escaping* da React prima dell'inserimento nel DOM.
*   Non viene utilizzato `dangerouslySetInnerHTML` o metodi equivalenti che potrebbero permettere l'iniezione di script malevoli tramite i messaggi dell'AI o i titoli delle note.

### 2. HTTPS Enforcement
Come Progressive Web App (PWA), l'applicazione richiede un contesto sicuro (HTTPS) per abilitare i Service Workers e le funzionalità di installazione su Android. Questo garantisce la crittografia dei dati in transito tra il client e i server di Google Gemini.

### 3. Filtri di Sicurezza AI (Google Safety Settings)
Le interazioni con l'Intelligenza Artificiale sono mediate dalle API di Google Gemini. Sebbene non configurati esplicitamente nel codice client (usando i valori di default), l'API di Google applica filtri nativi per prevenire la generazione di contenuti dannosi, incitamento all'odio o contenuti sessualmente espliciti.

---

## ⚠️ Vulnerabilità Note e Limitazioni Architetturali

### 1. Esposizione della API Key (Client-Side Exposure)
**Livello di Rischio: ALTO**

Poiché l'applicazione comunica direttamente dal browser dell'utente alle API di Google Gemini senza passare per un server proxy intermedio:
*   La variabile `process.env.API_KEY` viene incorporata nel bundle JavaScript durante la fase di build.
*   Un utente esperto può ispezionare il traffico di rete (Network Tab) o il codice sorgente per estrarre la chiave API.

**Raccomandazione:** Non utilizzare questo codice in produzione pubblica con una chiave API collegata a un account di fatturazione senza limiti. Per un uso in produzione sicuro, è necessario implementare un backend (es. Node.js/Python) che custodisca la chiave e faccia da proxy per le richieste.

### 2. Archiviazione Dati non Cifrata (LocalStorage)
**Livello di Rischio: MEDIO**

I dati delle attività (Tasks) e la cronologia delle chat sono salvati nel `localStorage` del browser.
*   **Vulnerabilità:** I dati risiedono in formato JSON testo semplice.
*   **Impatto:** Qualsiasi script dannoso (se dovesse verificarsi un XSS tramite dipendenze terze) potrebbe leggere l'intero database locale. Inoltre, chiunque abbia accesso fisico al dispositivo sbloccato può leggere i dati ispezionando il browser.
*   **Mitigazione:** Non inserire dati sensibili (password, dati sanitari, finanziari) nelle note o nelle chat con l'AI.

### 3. Prompt Injection
**Livello di Rischio: BASSO/MEDIO**

L'utente può interagire liberamente con l'AI tramite la chat.
*   **Vulnerabilità:** Un utente potrebbe tentare di "ingannare" l'AI (Jailbreaking) per farle ignorare le istruzioni di sistema ("Sei un assistente per task...") e farle generare contenuti non previsti.
*   **Impatto:** Limitato all'esperienza dell'utente stesso, poiché le chat sono locali e non condivise.

---

## 🐛 Segnalazione di Bug

Se individui una vulnerabilità di sicurezza non elencata sopra, sei pregato di non aprire una issue pubblica su GitHub immediatamente.

1.  Invia una email al team di sviluppo (simulato).
2.  Includi passaggi per riprodurre il problema.
3.  Attendi una conferma prima di divulgare pubblicamente il problema.

---

## Dichiarazione di Esclusione di Responsabilità (Disclaimer)
Questo software è fornito "così com'è", senza garanzie di alcun tipo. L'utilizzo dell'applicazione e delle API di Google Gemini è a rischio e pericolo dell'utente. Gli sviluppatori non sono responsabili per eventuali costi derivanti dall'uso delle API Key o dalla perdita di dati salvati localmente.