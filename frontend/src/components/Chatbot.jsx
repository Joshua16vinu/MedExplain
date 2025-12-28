// import { useState, useEffect, useRef } from "react";
// import ReactMarkdown from "react-markdown";
// import rehypeSanitize from "rehype-sanitize";


// import { createChatSession, sendChatMessage, getChatSession } from "../services/api";
// import "./Chatbot.css";

// export default function Chatbot({ user, reportName, reportType,   onClose }) {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [initializing, setInitializing] = useState(true);
//   const [language, setLanguage] = useState("en");
// const [initError, setInitError] = useState(null); 
//   const messagesEndRef = useRef(null);
//   const chatContainerRef = useRef(null);
// const hasInitialized = useRef(false);
// const hasShownError = useRef(false);

// useEffect(() => {
//   hasInitialized.current = false;
//    setInitError(null);
// }, [reportName, reportType]);

// useEffect(() => {
//   if (!reportName || !reportType || !user) return;
//   if (hasInitialized.current) return;

//   hasInitialized.current = true;
//   initializeSession();
// }, [reportName, reportType, user]);


//   // useEffect(() => {
//   //   initializeSession();
//   // }, [reportName, reportType]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // const initializeSession = async () => {
//   //   if (!reportName || !reportType) {
//   //     setInitializing(false);
//   //     return;
//   //   }

//   //   try {
//   //     setInitializing(true);
//   //     const session = await createChatSession(reportName, reportType, language,user);
//   //     setSessionId(session.sessionId);
//   //     setMessages(session.messages || []);
//   //   } catch (error) {
//   //     console.error("Failed to initialize chat session:", error);
//   //     alert("Failed to initialize chat. Please try again.");
//   //   } finally {
//   //     setInitializing(false);
//   //   }
//   // };

//   const initializeSession = async () => {
//     if (!reportName || !reportType) {
//       setInitializing(false);
//       return;
//     }

//     try {
//       setInitializing(true);
//       setInitError(null);
//       console.log("Creating session for:", { reportName, reportType }); // Debug log
      
//       // Retry logic for newly uploaded reports
//       let session = null;
//       let attempts = 0;
//       const maxAttempts = 5;
      
//       while (attempts < maxAttempts && !session) {
//         try {
//           session = await createChatSession(reportName, reportType, language, user);
//           if (session && session.sessionId) {
//             break;
//           }
//         } catch (err) {
//           console.log(`Attempt ${attempts + 1} failed, retrying...`);
//           if (attempts < maxAttempts - 1) {
//             // Wait before retrying (exponential backoff)
//             await new Promise(resolve => setTimeout(resolve, 1000 * (attempts + 1)));
//           }
//         }
//         attempts++;
//       }
      
//       if (!session || !session.sessionId) {
//         // Even if session creation fails, create a placeholder session
//         // The backend should handle this gracefully
//         throw new Error("Unable to create session after retries");
//       }
      
//       setSessionId(session.sessionId);
//       setMessages(session.messages || []);
//       hasShownError.current = false; // Reset error flag on success
//     } catch (error) {
//       console.error("Failed to initialize chat session:", error);
      
//       // Don't show error or close - just set a message and allow user to retry
//       setInitError("Chat is initializing. Please wait a moment and try sending a message.");
//       // Don't close the chatbot - let the user try
//       // The backend will handle the session creation when the first message is sent
//     } finally {
//       setInitializing(false);
//     }
//   };
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
    
//     if (!inputMessage.trim() || loading) {
//       return;
//     }

//     // If session not initialized yet, try to initialize it first
//     if (!sessionId) {
//       setInitError("Initializing chat session...");
//       try {
//         const session = await createChatSession(reportName, reportType, language, user);
//         if (session && session.sessionId) {
//           setSessionId(session.sessionId);
//           setMessages(session.messages || []);
//           setInitError(null);
//         } else {
//           throw new Error("Failed to create session");
//         }
//       } catch (error) {
//         console.error("Failed to initialize session:", error);
//         setInitError("Failed to initialize chat. Please try again.");
//         return;
//       }
//     }

//     const userMessage = inputMessage.trim();
//     setInputMessage("");
    
//     // Add user message immediately
//     const newUserMessage = {
//       role: "user",
//       content: userMessage,
//       timestamp: new Date(),
//     };
//     setMessages((prev) => [...prev, newUserMessage]);

//     setLoading(true);
//     setInitError(null); // Clear any previous errors

//     try {
//       const response = await sendChatMessage(sessionId, userMessage, language, user);
      
//       // Add bot response
//       const botMessage = {
//         role: "assistant",
//         content: response.response,
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       setInitError("Failed to send message. Please try again.");
      
//       // Remove the user message if it failed
//       setMessages((prev) => prev.filter((msg, idx) => idx !== prev.length - 1));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatTime = (timestamp) => {
//     if (!timestamp) return "";
//     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (initializing) {
//     return (
//       <div className="chatbot-container">
//         <div className="chatbot-header">
//           <h3>Chat about your report</h3>
//           <button className="close-btn" onClick={onClose}>×</button>
//         </div>
//         <div className="chatbot-loading">
//           <div className="loading-spinner"></div>
//           <p>Initializing chat...</p>
//         </div>
      

//       </div>
//     );
//   }

//   return (
//     <div className="chatbot-container">
//       {/* <div className="chatbot-header">

//         <div className="chatbot-header-info">
//           <h3>Chat about your report</h3>
//           <p className="chatbot-subtitle">
//             Ask questions about: {reportName} ({reportType})
//           </p>
//         </div>
//          <select
//   value={language}
//   onChange={(e) => setLanguage(e.target.value)}
//   className="chatbot-language-select"
// >
//   <option value="en">English</option>
//   <option value="hi">Hindi</option>
//   <option value="mr">Marathi</option>
// </select>
//         <button className="close-btn" onClick={onClose} title="Close chat">
//           ×
//         </button>
       

//       </div> */}
// <div className="chatbot-header">
//   <div className="chatbot-header-info">
//     <h3>Chat about your report</h3>
//     <p className="chatbot-subtitle">
//       Ask questions about: {reportName} ({reportType})
//     </p>
//   </div>

//   <div className="chatbot-header-actions">
   

//     <button className="close-btn" onClick={onClose} title="Close chat">
//       ×
//     </button>
//      <select
//       value={language}
//       onChange={(e) => setLanguage(e.target.value)}
//       className="chatbot-language-select"
//     >
//       <option value="en">English</option>
//       <option value="hi">Hindi</option>
//       <option value="mr">Marathi</option>
//     </select>
//   </div>
// </div>

//       <div className="chatbot-messages" ref={chatContainerRef}>
//         {messages.length === 0 ? (
//           <div className="chatbot-empty">
//             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
//             </svg>
//             <p>Start a conversation! Ask me anything about your medical report.</p>
//             <p className="chatbot-hint">
//               Example: "What does my hemoglobin level mean?"
//             </p>
//           </div>
//         ) : (
//           messages.map((message, index) => (
//             <div
//               key={index}
//               className={`chat-message ${message.role === "user" ? "user-message" : "bot-message"}`}
//             >
//               <div className="message-content">
//                 {message.role === "assistant" && (
//                   <div className="bot-avatar">
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
//                       <path d="M2 17l10 5 10-5"></path>
//                       <path d="M2 12l10 5 10-5"></path>
//                     </svg>
//                   </div>
//                 )}
//                 <div className="message-bubble">
//                   {/* <p>{message.content}</p> */}
//                   <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
//   {message.content}
// </ReactMarkdown>

//                   {message.timestamp && (
//                     <span className="message-time">{formatTime(message.timestamp)}</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//         {loading && (
//           <div className="chat-message bot-message">
//             <div className="message-content">
//               <div className="bot-avatar">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
//                   <path d="M2 17l10 5 10-5"></path>
//                   <path d="M2 12l10 5 10-5"></path>
//                 </svg>
//               </div>
//               <div className="message-bubble typing-indicator">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {initError && (
//         <div style={{ 
//           padding: "0.75rem", 
//           margin: "0.5rem", 
//           backgroundColor: "#fff3cd", 
//           border: "1px solid #ffc107",
//           borderRadius: "8px",
//           color: "#856404",
//           fontSize: "0.9rem"
//         }}>
//           {initError}
//         </div>
//       )}
      
//       <form className="chatbot-input-form" onSubmit={handleSendMessage}>
//         <input
//           type="text"
//           value={inputMessage}
//           onChange={(e) => setInputMessage(e.target.value)}
//           placeholder={sessionId ? "Ask a question about your report..." : "Initializing chat..."}
//           className="chatbot-input"
//           disabled={loading}
//         />
        
//         <button
//           type="submit"
//           className="chatbot-send-btn"
//           disabled={loading || !inputMessage.trim()}
//         >
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <line x1="22" y1="2" x2="11" y2="13"></line>
//             <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//           </svg>
//         </button>
//       </form>
//     </div>
//   );
// }


// import { useState, useEffect, useRef } from "react";
// import ReactMarkdown from "react-markdown";
// import rehypeSanitize from "rehype-sanitize";

// import { createChatSession, sendChatMessage, sendVoiceMessage } from "../services/api";
// import "./Chatbot.css";

// export default function Chatbot({ user, reportName, reportType, onClose }) {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [initializing, setInitializing] = useState(true);
//   const [language, setLanguage] = useState("en");
//   const [initError, setInitError] = useState(null);
  
//   // Voice mode states
//   const [voiceMode, setVoiceMode] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isPlayingAudio, setIsPlayingAudio] = useState(false);
//   const [voiceGender, setVoiceGender] = useState("female");
  
//   const messagesEndRef = useRef(null);
//   const chatContainerRef = useRef(null);
//   const hasInitialized = useRef(false);
//   const hasShownError = useRef(false);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     hasInitialized.current = false;
//     setInitError(null);
//   }, [reportName, reportType]);

//   useEffect(() => {
//     if (!reportName || !reportType || !user) return;
//     if (hasInitialized.current) return;

//     hasInitialized.current = true;
//     initializeSession();
//   }, [reportName, reportType, user]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const initializeSession = async () => {
//     if (!reportName || !reportType) {
//       setInitializing(false);
//       return;
//     }

//     try {
//       setInitializing(true);
//       setInitError(null);
//       console.log("Creating session for:", { reportName, reportType });
      
//       let session = null;
//       let attempts = 0;
//       const maxAttempts = 5;
      
//       while (attempts < maxAttempts && !session) {
//         try {
//           session = await createChatSession(reportName, reportType, language, user);
//           if (session && session.sessionId) {
//             break;
//           }
//         } catch (err) {
//           console.log(`Attempt ${attempts + 1} failed, retrying...`);
//           if (attempts < maxAttempts - 1) {
//             await new Promise(resolve => setTimeout(resolve, 1000 * (attempts + 1)));
//           }
//         }
//         attempts++;
//       }
      
//       if (!session || !session.sessionId) {
//         throw new Error("Unable to create session after retries");
//       }
      
//       setSessionId(session.sessionId);
//       setMessages(session.messages || []);
//       hasShownError.current = false;
//     } catch (error) {
//       console.error("Failed to initialize chat session:", error);
//       setInitError("Chat is initializing. Please wait a moment and try sending a message.");
//     } finally {
//       setInitializing(false);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
    
//     if (!inputMessage.trim() || loading) {
//       return;
//     }

//     if (!sessionId) {
//       setInitError("Initializing chat session...");
//       try {
//         const session = await createChatSession(reportName, reportType, language, user);
//         if (session && session.sessionId) {
//           setSessionId(session.sessionId);
//           setMessages(session.messages || []);
//           setInitError(null);
//         } else {
//           throw new Error("Failed to create session");
//         }
//       } catch (error) {
//         console.error("Failed to initialize session:", error);
//         setInitError("Failed to initialize chat. Please try again.");
//         return;
//       }
//     }

//     const userMessage = inputMessage.trim();
//     setInputMessage("");
    
//     const newUserMessage = {
//       role: "user",
//       content: userMessage,
//       timestamp: new Date(),
//     };
//     setMessages((prev) => [...prev, newUserMessage]);

//     setLoading(true);
//     setInitError(null);

//     try {
//       const response = await sendChatMessage(sessionId, userMessage, language, user);
      
//       const botMessage = {
//         role: "assistant",
//         content: response.response,
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       setInitError("Failed to send message. Please try again.");
//       setMessages((prev) => prev.filter((msg, idx) => idx !== prev.length - 1));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Voice recording functions
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
//       // Use WebM format with Opus codec (supported by Google Speech-to-Text)
//       const options = {
//         mimeType: 'audio/webm;codecs=opus'
//       };
      
//       mediaRecorderRef.current = new MediaRecorder(stream, options);
//       audioChunksRef.current = [];

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorderRef.current.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
//         await sendVoiceMessageToBackend(audioBlob);
        
//         // Stop all tracks
//         stream.getTracks().forEach(track => track.stop());
//       };

//       mediaRecorderRef.current.start();
//       setIsRecording(true);
//       console.log("🎤 Recording started...");
//     } catch (error) {
//       console.error("Error starting recording:", error);
//       setInitError("Could not access microphone. Please check permissions.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//       console.log("🎤 Recording stopped");
//     }
//   };

//   const sendVoiceMessageToBackend = async (audioBlob) => {
//     if (!sessionId) {
//       setInitError("Session not initialized");
//       return;
//     }

//     setLoading(true);
//     setInitError(null);

//     try {
//       // Convert blob to base64
//       const reader = new FileReader();
//       reader.readAsDataURL(audioBlob);
      
//       reader.onloadend = async () => {
//         const base64Audio = reader.result.split(',')[1]; // Remove data:audio/webm;base64, prefix
        
//         console.log("🎤 Sending voice message...");
        
//         // Send to backend
//         const response = await sendVoiceMessage(
//           sessionId,
//           base64Audio,
//           language,
//           voiceGender,
//           user
//         );

//         console.log("✅ Voice response received");

//         // Add user message (transcribed text)
//         const userMessage = {
//           role: "user",
//           content: response.data.userText,
//           timestamp: new Date(),
//           isVoice: true
//         };
//         setMessages((prev) => [...prev, userMessage]);

//         // Add bot response
//         const botMessage = {
//           role: "assistant",
//           content: response.data.responseText,
//           timestamp: new Date(),
//           isVoice: true
//         };
//         setMessages((prev) => [...prev, botMessage]);

//         // Play audio response
//         if (response.data.responseAudio) {
//           playAudioResponse(response.data.responseAudio);
//         }
//       };
//     } catch (error) {
//       console.error("Failed to send voice message:", error);
//       setInitError("Failed to process voice message. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const playAudioResponse = (base64Audio) => {
//     try {
//       // Convert base64 to blob
//       const audioData = atob(base64Audio);
//       const arrayBuffer = new ArrayBuffer(audioData.length);
//       const view = new Uint8Array(arrayBuffer);
      
//       for (let i = 0; i < audioData.length; i++) {
//         view[i] = audioData.charCodeAt(i);
//       }
      
//       const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
//       const audioUrl = URL.createObjectURL(blob);
      
//       // Create and play audio
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current = null;
//       }
      
//       audioRef.current = new Audio(audioUrl);
//       setIsPlayingAudio(true);
      
//       audioRef.current.onended = () => {
//         setIsPlayingAudio(false);
//         URL.revokeObjectURL(audioUrl);
//       };
      
//       audioRef.current.play();
//       console.log("🔊 Playing audio response");
//     } catch (error) {
//       console.error("Error playing audio:", error);
//       setIsPlayingAudio(false);
//     }
//   };

//   const toggleVoiceMode = () => {
//     setVoiceMode(!voiceMode);
//     if (isRecording) {
//       stopRecording();
//     }
//     if (isPlayingAudio && audioRef.current) {
//       audioRef.current.pause();
//       setIsPlayingAudio(false);
//     }
//   };

//   const formatTime = (timestamp) => {
//     if (!timestamp) return "";
//     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (initializing) {
//     return (
//       <div className="chatbot-container">
//         <div className="chatbot-header">
//           <h3>Chat about your report</h3>
//           <button className="close-btn" onClick={onClose}>×</button>
//         </div>
//         <div className="chatbot-loading">
//           <div className="loading-spinner"></div>
//           <p>Initializing chat...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="chatbot-container">
//       <div className="chatbot-header">
//         <div className="chatbot-header-info">
//           <h3>Chat about your report</h3>
//           <p className="chatbot-subtitle">
//             Ask questions about: {reportName} ({reportType})
//           </p>
//         </div>

//         <div className="chatbot-header-actions">
//           <select
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//             className="chatbot-language-select"
//           >
//             <option value="en">English</option>
//             <option value="hi">Hindi</option>
//             <option value="mr">Marathi</option>
//           </select>

//           <button 
//             className={`voice-mode-btn ${voiceMode ? 'active' : ''}`}
//             onClick={toggleVoiceMode}
//             title={voiceMode ? "Switch to Text Mode" : "Switch to Voice Mode"}
//           >
//             {voiceMode ? (
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
//               </svg>
//             ) : (
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
//                 <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
//                 <line x1="12" y1="19" x2="12" y2="23"></line>
//                 <line x1="8" y1="23" x2="16" y2="23"></line>
//               </svg>
//             )}
//           </button>

//           {voiceMode && (
//             <select
//               value={voiceGender}
//               onChange={(e) => setVoiceGender(e.target.value)}
//               className="chatbot-voice-select"
//               title="Voice Gender"
//             >
//               <option value="female">Female Voice</option>
//               <option value="male">Male Voice</option>
//             </select>
//           )}

//           <button className="close-btn" onClick={onClose} title="Close chat">
//             ×
//           </button>
//         </div>
//       </div>

//       <div className="chatbot-messages" ref={chatContainerRef}>
//         {messages.length === 0 ? (
//           <div className="chatbot-empty">
//             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
//             </svg>
//             <p>Start a conversation! Ask me anything about your medical report.</p>
//             <p className="chatbot-hint">
//               {voiceMode 
//                 ? "🎤 Press the microphone button to speak"
//                 : "Example: \"What does my hemoglobin level mean?\""}
//             </p>
//           </div>
//         ) : (
//           messages.map((message, index) => (
//             <div
//               key={index}
//               className={`chat-message ${message.role === "user" ? "user-message" : "bot-message"}`}
//             >
//               <div className="message-content">
//                 {message.role === "assistant" && (
//                   <div className="bot-avatar">
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
//                       <path d="M2 17l10 5 10-5"></path>
//                       <path d="M2 12l10 5 10-5"></path>
//                     </svg>
//                   </div>
//                 )}
//                 <div className="message-bubble">
//                   <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
//                     {message.content}
//                   </ReactMarkdown>
//                   {message.isVoice && (
//                     <span className="voice-indicator" title="Voice message">
//                       🎤
//                     </span>
//                   )}
//                   {message.timestamp && (
//                     <span className="message-time">{formatTime(message.timestamp)}</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//         {loading && (
//           <div className="chat-message bot-message">
//             <div className="message-content">
//               <div className="bot-avatar">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
//                   <path d="M2 17l10 5 10-5"></path>
//                   <path d="M2 12l10 5 10-5"></path>
//                 </svg>
//               </div>
//               <div className="message-bubble typing-indicator">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//               </div>
//             </div>
//           </div>
//         )}
//         {isPlayingAudio && (
//           <div className="audio-playing-indicator">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
//               <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
//               <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
//             </svg>
//             <span>Playing audio response...</span>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {initError && (
//         <div className="chatbot-error-banner">
//           {initError}
//         </div>
//       )}
      
//       {voiceMode ? (
//         <div className="chatbot-voice-controls">
//           <button
//             className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
//             onClick={isRecording ? stopRecording : startRecording}
//             disabled={loading || isPlayingAudio}
//             title={isRecording ? "Stop Recording" : "Start Recording"}
//           >
//             {isRecording ? (
//               <>
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//                   <rect x="6" y="6" width="12" height="12" rx="2"></rect>
//                 </svg>
//                 <span>Stop Recording</span>
//               </>
//             ) : (
//               <>
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
//                   <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
//                   <line x1="12" y1="19" x2="12" y2="23"></line>
//                   <line x1="8" y1="23" x2="16" y2="23"></line>
//                 </svg>
//                 <span>Press to Speak</span>
//               </>
//             )}
//           </button>
//           {isRecording && (
//             <div className="recording-animation">
//               <span></span>
//               <span></span>
//               <span></span>
//             </div>
//           )}
//         </div>
//       ) : (
//         <form className="chatbot-input-form" onSubmit={handleSendMessage}>
//           <input
//             type="text"
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             placeholder={sessionId ? "Ask a question about your report..." : "Initializing chat..."}
//             className="chatbot-input"
//             disabled={loading}
//           />
          
//           <button
//             type="submit"
//             className="chatbot-send-btn"
//             disabled={loading || !inputMessage.trim()}
//           >
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <line x1="22" y1="2" x2="11" y2="13"></line>
//               <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//             </svg>
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }





import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

import { createChatSession, sendChatMessage, sendVoiceMessage } from "../services/api";
import "./Chatbot.css";

export default function Chatbot({ user, reportName, reportType, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [language, setLanguage] = useState("en");
  const [initError, setInitError] = useState(null);
  
  // Voice mode states
  const [voiceMode, setVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [voiceProcessing, setVoiceProcessing] = useState({
    active: false,
    stage: "",
    message: ""
  });
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const hasInitialized = useRef(false);
  const hasShownError = useRef(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    hasInitialized.current = false;
    setInitError(null);
  }, [reportName, reportType]);

  useEffect(() => {
    if (!reportName || !reportType || !user) return;
    if (hasInitialized.current) return;

    hasInitialized.current = true;
    initializeSession();
  }, [reportName, reportType, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  // Add this after all your useState declarations
const showReportAlert = () => {
  alert(
    "⚠️ Unable to open chatbot right now.\n\n" +
    "Please wait a moment and try again from 'My Reports' section.\n\n" +
    "The report is being processed and will be ready shortly."
  );
};
  // const initializeSession = async () => {
  //   if (!reportName || !reportType) {
  //     setInitializing(false);
  //     return;
  //   }

  //   try {
  //     setInitializing(true);
  //     setInitError(null);
  //     console.log("Creating session for:", { reportName, reportType });
      
  //     let session = null;
  //     let attempts = 0;
  //     const maxAttempts = 5;
      
  //     while (attempts < maxAttempts && !session) {
  //       try {
  //         session = await createChatSession(reportName, reportType, language, user);
  //         if (session && session.sessionId) {
  //           break;
  //         }
  //       } catch (err) {
  //         console.log(`Attempt ${attempts + 1} failed, retrying...`);
  //         if (attempts < maxAttempts - 1) {
  //           await new Promise(resolve => setTimeout(resolve, 1000 * (attempts + 1)));
  //         }
  //       }
  //       attempts++;
  //     }
      
  //     if (!session || !session.sessionId) {
  //       throw new Error("Unable to create session after retries");
  //     }
      
  //     setSessionId(session.sessionId);
  //     setMessages(session.messages || []);
  //     hasShownError.current = false;
  //   } catch (error) {
  //     console.error("Failed to initialize chat session:", error);
  //     setInitError("Chat is initializing. Please wait a moment and try sending a message.");
  //   } finally {
  //     setInitializing(false);
  //   }
  // };


  const initializeSession = async () => {
  if (!reportName || !reportType) {
    setInitializing(false);
    return;
  }

  try {
    setInitializing(true);
    setInitError(null);
    console.log("Creating session for:", { reportName, reportType });
    
    let session = null;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts && !session) {
      try {
        session = await createChatSession(reportName, reportType, language, user);
        if (session && session.sessionId) {
          break;
        }
      } catch (err) {
        console.log(`Attempt ${attempts + 1} failed, retrying...`);
        if (attempts < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempts + 1)));
        }
      }
      attempts++;
    }
    
    if (!session || !session.sessionId) {
      // ✅ ADD THIS: Show alert and close chatbot
      showReportAlert();
      onClose(); // Close the chatbot
      throw new Error("Unable to create session after retries");
    }
    
    setSessionId(session.sessionId);
    setMessages(session.messages || []);
    hasShownError.current = false;
  } catch (error) {
    console.error("Failed to initialize chat session:", error);
    setInitError("Unable to open chatbot. Please open from 'My Reports' section.");
    
    // ✅ ADD THIS: Show alert after 1 second if still no session
    setTimeout(() => {
      if (!sessionId) {
        showReportAlert();
        onClose(); // Close the chatbot
      }
    }, 1000);
  } finally {
    setInitializing(false);
  }
};
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // const handleSendMessage = async (e) => {
  //   e.preventDefault();
    
  //   if (!inputMessage.trim() || loading) {
  //     return;
  //   }

  //   if (!sessionId) {
  //     setInitError("Initializing chat session...");
  //     try {
  //       const session = await createChatSession(reportName, reportType, language, user);
  //       if (session && session.sessionId) {
  //         setSessionId(session.sessionId);
  //         setMessages(session.messages || []);
  //         setInitError(null);
  //       } else {
  //         throw new Error("Failed to create session");
  //       }
  //     } catch (error) {
  //       console.error("Failed to initialize session:", error);
  //       setInitError("Failed to initialize chat. Please try again.");
  //       return;
  //     }
  //   }

  //   const userMessage = inputMessage.trim();
  //   setInputMessage("");
    
  //   const newUserMessage = {
  //     role: "user",
  //     content: userMessage,
  //     timestamp: new Date(),
  //   };
  //   setMessages((prev) => [...prev, newUserMessage]);

  //   setLoading(true);
  //   setInitError(null);

  //   try {
  //     const response = await sendChatMessage(sessionId, userMessage, language, user);
      
  //     const botMessage = {
  //       role: "assistant",
  //       content: response.response,
  //       timestamp: new Date(),
  //     };
  //     setMessages((prev) => [...prev, botMessage]);
  //   } catch (error) {
  //     console.error("Failed to send message:", error);
  //     setInitError("Failed to send message. Please try again.");
  //     setMessages((prev) => prev.filter((msg, idx) => idx !== prev.length - 1));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Voice recording functions
 
 const handleSendMessage = async (e) => {
  e.preventDefault();
  
  if (!inputMessage.trim() || loading) {
    return;
  }

  if (!sessionId) {
    // ✅ CHANGE THIS: Show alert instead of trying to create session
    showReportAlert();
    return;
  }

  const userMessage = inputMessage.trim();
  setInputMessage("");
  
  const newUserMessage = {
    role: "user",
    content: userMessage,
    timestamp: new Date(),
  };
  setMessages((prev) => [...prev, newUserMessage]);

  setLoading(true);
  setInitError(null);

  try {
    const response = await sendChatMessage(sessionId, userMessage, language, user);
    
    const botMessage = {
      role: "assistant",
      content: response.response,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("Failed to send message:", error);
    
    // ✅ ADD THIS: Check if session is invalid
    if (error.message.includes("Session not found") || error.message.includes("404")) {
      showReportAlert();
      onClose();
    } else {
      alert( "⚠️ Unable to open chatbot right now.\n\n" +
    "Please try again from 'My Reports' section.."
    );
      // setInitError("Failed to send message. Please try again.");
      setMessages((prev) => prev.filter((msg, idx) => idx !== prev.length - 1));
    }
  } finally {
    setLoading(false);
  }
};
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const options = {
        mimeType: 'audio/webm;codecs=opus'
      };
      
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        await sendVoiceMessageToBackend(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("🎤 Recording started...");
    } catch (error) {
      console.error("Error starting recording:", error);
      setInitError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("🎤 Recording stopped");
    }
  };

  const updateVoiceProcessing = (stage, message) => {
    setVoiceProcessing({
      active: true,
      stage,
      message
    });
  };

  const clearVoiceProcessing = () => {
    setVoiceProcessing({
      active: false,
      stage: "",
      message: ""
    });
  };

  // const sendVoiceMessageToBackend = async (audioBlob) => {
  //   if (!sessionId) {
  //     setInitError("Session not initialized");
  //     return;
  //   }

  //   setLoading(true);
  //   setInitError(null);

  //   try {
  //     // Stage 1: Converting audio
  //     updateVoiceProcessing("converting", "Converting your voice to text...");
      
  //     const reader = new FileReader();
  //     reader.readAsDataURL(audioBlob);
      
  //     reader.onloadend = async () => {
  //       const base64Audio = reader.result.split(',')[1];
        
  //       console.log("🎤 Sending voice message...");
        
  //       // Stage 2: Processing
  //       updateVoiceProcessing("processing", "Processing your question...");
        
  //       // Send to backend
  //       const response = await sendVoiceMessage(
  //         sessionId,
  //         base64Audio,
  //         language,
  //         voiceGender,
  //         user
  //       );

  //       console.log("✅ Voice response received");

  //       // Stage 3: Generating response
  //       updateVoiceProcessing("generating", "Generating response...");

  //       // Add user message (transcribed text)
  //       const userMessage = {
  //         role: "user",
  //         content: response.data.userText,
  //         timestamp: new Date(),
  //         isVoice: true
  //       };
  //       setMessages((prev) => [...prev, userMessage]);

  //       // Add bot response
  //       const botMessage = {
  //         role: "assistant",
  //         content: response.data.responseText,
  //         timestamp: new Date(),
  //         isVoice: true
  //       };
  //       setMessages((prev) => [...prev, botMessage]);

  //       // Stage 4: Playing audio
  //       updateVoiceProcessing("playing", "Playing response...");

  //       // Play audio response
  //       if (response.data.responseAudio) {
  //         await playAudioResponse(response.data.responseAudio);
  //       }
        
  //       // Clear processing indicator after audio plays
  //       clearVoiceProcessing();
  //     };
  //   } catch (error) {
  //     console.error("Failed to send voice message:", error);
  //     setInitError("Failed to process voice message. Please try again.");
  //     clearVoiceProcessing();
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const sendVoiceMessageToBackend = async (audioBlob) => {
  if (!sessionId) {
    // ✅ CHANGE THIS: Show alert for voice mode too
    showReportAlert();
    return;
  }

  setLoading(true);
  setInitError(null);

  try {
    // Stage 1: Converting audio
    updateVoiceProcessing("converting", "Converting your voice to text...");
    
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    
    reader.onloadend = async () => {
      const base64Audio = reader.result.split(',')[1];
      
      console.log("🎤 Sending voice message...");
      
      // Stage 2: Processing
      updateVoiceProcessing("processing", "Processing your question...");
      
      // Send to backend
      const response = await sendVoiceMessage(
        sessionId,
        base64Audio,
        language,
        voiceGender,
        user
      );

      console.log("✅ Voice response received");

      // Stage 3: Generating response
      updateVoiceProcessing("generating", "Generating response...");

      // Add user message (transcribed text)
      const userMessage = {
        role: "user",
        content: response.data.userText,
        timestamp: new Date(),
        isVoice: true
      };
      setMessages((prev) => [...prev, userMessage]);

      // Add bot response
      const botMessage = {
        role: "assistant",
        content: response.data.responseText,
        timestamp: new Date(),
        isVoice: true
      };
      setMessages((prev) => [...prev, botMessage]);

      // Stage 4: Playing audio
      updateVoiceProcessing("playing", "Playing response...");

      // Play audio response
      if (response.data.responseAudio) {
        await playAudioResponse(response.data.responseAudio);
      }
      
      // Clear processing indicator after audio plays
      clearVoiceProcessing();
    };
  } catch (error) {
    alert( "⚠️ Unable to open chatbot right now.\n\n" +
    "Please try again from 'My Reports' section.."
    );
    console.error("Failed to send voice message:", error);
    
    // ✅ ADD THIS: Check if session is invalid
    if (error.message.includes("Session not found") || error.message.includes("404")) {
      showReportAlert();
      onClose();
    } else {
      // setInitError("Failed to process voice message. Please try again.");
      alert( "⚠️ Unable to open chatbot right now.\n\n" +
    "Please try again from 'My Reports' section.."
    );
    }
    
    clearVoiceProcessing();
  } finally {
    setLoading(false);
  }
};
  const playAudioResponse = (base64Audio) => {
    return new Promise((resolve, reject) => {
      try {
        // Convert base64 to blob
        const audioData = atob(base64Audio);
        const arrayBuffer = new ArrayBuffer(audioData.length);
        const view = new Uint8Array(arrayBuffer);
        
        for (let i = 0; i < audioData.length; i++) {
          view[i] = audioData.charCodeAt(i);
        }
        
        const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(blob);
        
        // Create and play audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        
        audioRef.current = new Audio(audioUrl);
        setIsPlayingAudio(true);
        
        audioRef.current.onended = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
          clearVoiceProcessing();
          resolve();
        };
        
        audioRef.current.onerror = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
          clearVoiceProcessing();
          reject(new Error("Audio playback failed"));
        };
        
        audioRef.current.play();
        console.log("🔊 Playing audio response");
      } catch (error) {
        console.error("Error playing audio:", error);
        setIsPlayingAudio(false);
        clearVoiceProcessing();
        reject(error);
      }
    });
  };

  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode);
    if (isRecording) {
      stopRecording();
    }
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
    clearVoiceProcessing();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (initializing) {
    return (
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h3>Chat about your report</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="chatbot-loading">
          <div className="loading-spinner"></div>
          <p>Initializing chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-header-info">
          <h3>Chat about your report</h3>
          <p className="chatbot-subtitle">
            Ask questions about: {reportName} ({reportType})
          </p>
        </div>

        <div className="chatbot-header-actions">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="chatbot-language-select"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
          </select>

          <button 
            className={`voice-mode-btn ${voiceMode ? 'active' : ''}`}
            onClick={toggleVoiceMode}
            title={voiceMode ? "Switch to Text Mode" : "Switch to Voice Mode"}
          >
            {voiceMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            )}
          </button>

          {voiceMode && (
            <select
              value={voiceGender}
              onChange={(e) => setVoiceGender(e.target.value)}
              className="chatbot-voice-select"
              title="Voice Gender"
            >
              <option value="female">Female Voice</option>
              <option value="male">Male Voice</option>
            </select>
          )}

          <button className="close-btn" onClick={onClose} title="Close chat">
            ×
          </button>
        </div>
      </div>

      <div className="chatbot-messages" ref={chatContainerRef}>
        {messages.length === 0 ? (
          <div className="chatbot-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p>Start a conversation! Ask me anything about your medical report.</p>
            <p className="chatbot-hint">
              {voiceMode 
                ? "🎤 Press the microphone button to speak"
                : "Example: \"What does my hemoglobin level mean?\""}
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.role === "user" ? "user-message" : "bot-message"}`}
            >
              <div className="message-content">
                {message.role === "assistant" && (
                  <div className="bot-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                )}
                <div className="message-bubble">
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                    {message.content}
                  </ReactMarkdown>
                  {message.isVoice && (
                    <span className="voice-indicator" title="Voice message">
                      🎤
                    </span>
                  )}
                  {message.timestamp && (
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Text mode loading indicator */}
        {loading && !voiceMode && (
          <div className="chat-message bot-message">
            <div className="message-content">
              <div className="bot-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div className="message-bubble typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        {/* Voice mode processing indicator */}
        {voiceProcessing.active && (
          <div className="voice-processing-indicator">
            <div className="voice-processing-content">
              <div className="voice-processing-spinner">
                {voiceProcessing.stage === "converting" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  </svg>
                )}
                {voiceProcessing.stage === "processing" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                )}
                {voiceProcessing.stage === "generating" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                )}
                {voiceProcessing.stage === "playing" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                )}
              </div>
              <div className="voice-processing-text">
                <div className="voice-processing-message">{voiceProcessing.message}</div>
                <div className="voice-processing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {initError && (
        <div className="chatbot-error-banner">
          {initError}
        </div>
      )}
      
      {voiceMode ? (
        <div className="chatbot-voice-controls">
          <button
            className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading || isPlayingAudio || voiceProcessing.active}
            title={isRecording ? "Stop Recording" : "Start Recording"}
          >
            {isRecording ? (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2"></rect>
                </svg>
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
                <span>Press to Speak</span>
              </>
            )}
          </button>
          {isRecording && (
            <div className="recording-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
      ) : (
        <form className="chatbot-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={sessionId ? "Ask a question about your report..." : "Initializing chat..."}
            className="chatbot-input"
            disabled={loading}
          />
          
          <button
            type="submit"
            className="chatbot-send-btn"
            disabled={loading || !inputMessage.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      )}
    </div>
  );
}