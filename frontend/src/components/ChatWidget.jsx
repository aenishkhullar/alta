import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hey! 👋 I'm Alta AI. Ask me anything about Aenish, our services, pricing, or projects — I'll keep it short and clear." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleOpen = () => {
    setIsOpen(true);
    setAnimating(true);
  };

  const handleClose = () => {
    setAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMessage = { role: 'user', text: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    const history = updatedMessages
      .slice(1) // skip the initial assistant greeting
      .slice(0, -1) // exclude the message we just sent (sent separately)
      .map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

    try {
      const { data } = await api.post('/chat/message', { message: trimmed, history });
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: data.reply || 'Sorry, I could not get a response.' 
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'model', text: 'Something went wrong. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <style>{`
        .chat-widget-btn:hover {
          background: #aa2222 !important;
          transform: scale(1.04) !important;
        }
        .chat-widget-close:hover {
          background: rgba(255,255,255,0.12) !important;
          color: white !important;
        }
        .chat-widget-input:focus {
          border-color: rgba(204,51,51,0.5) !important;
        }
        .chat-widget-send:hover:not(:disabled) {
          background: #aa2222 !important;
        }
        .chat-widget-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .chat-widget-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-widget-scrollbar::-webkit-scrollbar-thumb {
          background: #cc3333;
          border-radius: 2px;
        }
        .chat-widget-input::placeholder {
          color: rgba(255,255,255,0.25);
        }
        @keyframes chatPulse {
          0% { box-shadow: 0 0 0 0 rgba(204,51,51,0.4); }
          100% { box-shadow: 0 0 0 8px rgba(204,51,51,0); }
        }
        @keyframes chatBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      {!isOpen && (
        <button
          onClick={handleOpen}
          className="chat-widget-btn"
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            zIndex: 9999,
            background: '#cc3333',
            color: 'white',
            padding: '12px 22px',
            borderRadius: '999px',
            fontFamily: 'inherit',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: 700,
            boxShadow: '0 4px 24px rgba(204,51,51,0.45)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          ✦ ASK ALTA
        </button>
      )}

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '32px',
            zIndex: 9999,
            width: '360px',
            maxHeight: '520px',
            height: 'calc(100vh - 120px)',
            background: '#0d0d0d',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            boxShadow: '0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(204,51,51,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            opacity: animating ? 1 : 0,
            transform: animating ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
            transition: animating 
              ? 'opacity 280ms cubic-bezier(0.16,1,0.3,1), transform 280ms cubic-bezier(0.16,1,0.3,1)' 
              : 'opacity 180ms ease, transform 180ms ease',
            ...( !animating && { transform: 'translateY(12px)' } )
          }}
        >
          {/* Header */}
          <div style={{
            height: '52px',
            flexShrink: 0,
            background: 'linear-gradient(135deg, #1a0a0a 0%, #0d0d0d 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#cc3333',
                borderRadius: '50%',
                marginRight: '8px',
                animation: 'chatPulse 1.4s infinite'
              }} />
              <span style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'white',
                fontWeight: 700
              }}>ALTA AI</span>
              <span style={{
                fontSize: '9px',
                color: 'rgba(255,255,255,0.3)',
                marginLeft: '8px'
              }}>Powered by Gemini</span>
            </div>
            <button
              onClick={handleClose}
              className="chat-widget-close"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.5)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                padding: 0,
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>

          {/* Messages Area */}
          <div className="chat-widget-scrollbar" style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            background: '#000000'
          }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' ? '#cc3333' : '#1a1a1a',
                  color: msg.role === 'user' ? 'white' : 'rgba(255,255,255,0.88)',
                  padding: '9px 14px',
                  borderRadius: msg.role === 'user' ? '14px 14px 3px 14px' : '3px 14px 14px 14px',
                  maxWidth: msg.role === 'user' ? '80%' : '85%',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)'
                }}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '9px 14px',
                borderRadius: '3px 14px 14px 14px',
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                height: '38px'
              }}>
                {[0, 0.15, 0.3].map((delay, i) => (
                  <div key={i} style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.4)',
                    animation: 'chatBounce 0.9s ease-in-out infinite',
                    animationDelay: `${delay}s`
                  }} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            height: '56px',
            flexShrink: 0,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: '#0d0d0d',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '8px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              className="chat-widget-input"
              placeholder="Ask anything..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                color: 'white',
                padding: '9px 12px',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="chat-widget-send"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#cc3333',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease',
                opacity: (!input.trim() || isTyping) ? 0.4 : 1,
                pointerEvents: (!input.trim() || isTyping) ? 'none' : 'auto'
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
