import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './ChatInterface.css'; // We'll add some CSS later


const API_KEY = "AIzaSyDQdZmBnyZ-vbKarEtNsaYLzZU_WNhPsms"; 

const ChatInterface = () => {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize the Gemini client
    const genAI = new GoogleGenerativeAI(API_KEY);

    const handleSendMessage = async () => {
        if (!prompt.trim()) {
            return;
        }

        const userMessage = { text: prompt, isUser: true };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setPrompt('');
        setIsLoading(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            const aiMessage = { text: responseText, isUser: false };
            setMessages(prevMessages => [...prevMessages, aiMessage]);
        } catch (error) {
            console.error("Error generating content:", error);
            const errorMessage = { text: "Sorry, something went wrong. Please try again.", isUser: false };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-history">
                {messages.length === 0 && (
                    <p className="welcome-message">Hello! How can I help you today?</p>
                )}
                {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.isUser ? 'user' : 'ai'}`}>
                        <div className="message-content">{message.text}</div>
                    </div>
                ))}
                {isLoading && (
                    <div className="loading-indicator">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                )}
            </div>
            <div className="chat-input-area">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your prompt here..."
                    disabled={isLoading}
                />
                <button onClick={handleSendMessage} disabled={isLoading}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;
