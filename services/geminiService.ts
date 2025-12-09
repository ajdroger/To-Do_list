
import { GoogleGenAI, Type } from "@google/genai";
import { Task, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSubtasks = async (taskTitle: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Agisci come un esperto di produttività personale. Analizza la seguente attività: "${taskTitle}".
      
      Scomponila in 3-5 passaggi pratici, brevi e immediatamente azionabili.
      Usa un tono diretto e motivante.
      Rispondi SOLO in lingua ITALIANA.
      Restituisci esclusivamente un array JSON di stringhe.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const subtasks = JSON.parse(text) as string[];
    return subtasks;
  } catch (error) {
    console.error("Error generating subtasks:", error);
    return [];
  }
};

export const chatWithTaskAi = async (task: Task, userMessage: string, history: ChatMessage[]): Promise<string> => {
  try {
    // Costruiamo il contesto del sistema
    const context = `
      Sei un assistente personale intelligente integrato in una To-Do List app.
      L'utente ti sta chiedendo aiuto riguardo a questa specifica attività:
      
      TITOLO: "${task.title}"
      DESCRIZIONE: "${task.description || 'Nessuna descrizione'}"
      PRIORITÀ: ${task.priority}
      STATO: ${task.completed ? 'Completata' : 'Da fare'}
      SOTTO-TASK: ${task.subtasks.map(s => `- ${s.text} (${s.completed ? 'fatto' : 'da fare'})`).join('\n')}

      OBIETTIVO: Rispondi all'utente in modo proattivo, amichevole e conciso. Offri consigli pratici, idee per completare il task o motivazione.
      LINGUA: Rispondi SEMPRE in ITALIANO.
    `;

    // Convertiamo la history nel formato accettato dal modello (contenuto testuale)
    // Nota: Per semplicità in questo contesto stateless, passiamo la history come parte del prompt o usiamo chat.
    // Qui usiamo l'approccio chat stateful del SDK per gestire meglio il flusso.
    
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: context,
      }
    });

    // Ricarichiamo la storia precedente (escludendo il messaggio corrente che invieremo ora)
    // Mappiamo i messaggi salvati nel formato del SDK se necessario, ma per ora inviamo il messaggio corrente
    // con il contesto. In una implementazione più complessa, useremmo 'history' nel create.
    
    // Per garantire che il modello abbia "memoria" dei turni precedenti in questa sessione stateless:
    let historyContext = "";
    if (history.length > 0) {
      historyContext = "Cronologia precedente della conversazione:\n" + 
        history.map(m => `${m.role === 'user' ? 'Utente' : 'AI'}: ${m.text}`).join("\n") + 
        "\n\nNuova richiesta utente:\n";
    }

    const response = await chat.sendMessage({
      message: historyContext + userMessage
    });

    return response.text || "Mi dispiace, non riesco a rispondere al momento.";
  } catch (error) {
    console.error("Error chatting with AI:", error);
    return "Si è verificato un errore di connessione con l'AI.";
  }
};
