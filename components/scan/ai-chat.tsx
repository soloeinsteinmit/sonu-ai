"use client";

/**
 * AgriSentry AI - AI Chat Interface
 *
 * Conversational AI interface that allows farmers to ask questions
 * about their detected plant disease. Features include:
 * - Natural language chat
 * - English ↔ Twi translation
 * - Text-to-speech in Twi
 * - Mobile-optimized interface
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Loader2,
  MessageCircle,
  History,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScanResult } from "@/lib/types/disease";
import { toast } from "sonner";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  scanResult: ScanResult;
  timestamp: Date;
  diseaseName: string;
}

interface AIChatProps {
  scanResult: ScanResult;
  onClose?: () => void;
}

/**
 * AI Chat Interface for plant disease consultation
 */
export function AIChat({ scanResult, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userLocation, setUserLocation] = useState<string>("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Fetch user location on component mount
   */
  useEffect(() => {
    fetchUserLocation();
    loadChatHistory();
  }, []);

  /**
   * Load chat history from localStorage
   */
  const loadChatHistory = () => {
    try {
      const savedHistory = localStorage.getItem("agrisentry-chat-history");
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      toast.error("Error loading chat history");
    }
  };

  /**
   * Save chat history to localStorage
   */
  const saveChatHistory = (history: ChatSession[]) => {
    try {
      localStorage.setItem("agrisentry-chat-history", JSON.stringify(history));
    } catch (error) {
      toast.error("Error saving chat history");
    }
  };

  /**
   * Initialize chat with welcome message
   */
  useEffect(() => {
    const locationText = userLocation ? ` in ${userLocation}` : "";
    const welcomeMessage: Message = {
      id: `msg-${Date.now()}`,
      type: "ai",
      content: `Hello! I'm your AgriSentry AI assistant. I can see you've detected ${scanResult.disease.name} in your crop. ${locationText}. Feel free to ask me any questions about this disease, treatment options, or general farming advice. How can I help you today?`,
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
  }, [scanResult, userLocation]);

  /**
   * Auto scroll to bottom when new messages arrive
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Fetch user location
   */
  const fetchUserLocation = async () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `/api/location?lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data.location) {
            setUserLocation(data.location);
          }
        } catch (error) {
          toast.error("Error fetching location");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        toast.error("Error getting location");
        setLocationLoading(false);
      }
    );
  };

  /**
   * Generate AI response using Perplexity API with streaming
   */
  const generateAIResponse = async (
    userMessage: string
  ): Promise<Message | null> => {
    const diseaseInfo = scanResult.disease;
    const detectionResult = scanResult.detectionResult;
    const primaryTreatment = scanResult.recommendations.primary;

    if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
      toast.error("OpenRouter API key not configured");
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        type: "ai",
        content:
          "AI service is not properly configured. Please contact support or check your configuration.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      return null;
    }

    // Create system prompt with location context
    const locationContext = userLocation
      ? `The farmer is located in ${userLocation}. `
      : "";
    const systemPrompt = `You are AgriSentry AI, an expert agricultural assistant helping farmers. ${locationContext}. You have diagnosed ${diseaseInfo.name} in their crop. Be helpful, concise, and provide practical advice. Always respond in English only. 

When asked about where to buy the treatment, search the web for nearest location. Never give a general answer. Mention shops or place near by and their info if possible.`;

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "perplexity/sonar-pro",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage },
            ],
            stream: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not readable");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

      // Create streaming message
      const streamingMessage: Message = {
        id: `msg-${Date.now()}`,
        type: "ai",
        content: "",
        timestamp: new Date(),
      };

      // Add empty message to start streaming
      setMessages((prev) => [...prev, streamingMessage]);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || "";

                if (content) {
                  fullContent += content;

                  // Update the streaming message in real-time
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === streamingMessage.id
                        ? { ...msg, content: fullContent }
                        : msg
                    )
                  );

                  // Scroll to bottom as content streams
                  scrollToBottom();
                }
              } catch (e) {
                // Skip invalid JSON
                console.warn("Invalid JSON in stream:", e);
              }
            }
          }
        }

        // Final message with full content
        const finalMessage: Message = {
          ...streamingMessage,
          content: fullContent,
          timestamp: new Date(),
        };

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingMessage.id ? finalMessage : msg
          )
        );

        return finalMessage;
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      toast.error("Error generating AI response");

      let errorMessage =
        "I'm experiencing technical difficulties. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check your API configuration.";
        } else if (error.message.includes("429")) {
          errorMessage =
            "Service is temporarily busy. Please try again in a moment.";
        } else if (error.message.includes("network")) {
          errorMessage =
            "Network connection issue. Please check your internet connection.";
        }
      }

      // Fallback response if API fails
      const fallbackMessage: Message = {
        id: `msg-${Date.now()}`,
        type: "ai",
        content: errorMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
      return fallbackMessage;
    }
  };

  /**
   * Save current chat to history
   */
  const saveCurrentChat = () => {
    if (messages.length <= 1) return; // Only save if there are actual conversations

    const title =
      messages.find((m) => m.type === "user")?.content?.substring(0, 50) +
        "..." || `Chat about ${scanResult.disease.name}`;

    const newSession: ChatSession = {
      id: `chat-${Date.now()}`,
      title,
      messages: [...messages],
      scanResult,
      timestamp: new Date(),
      diseaseName: scanResult.disease.name,
    };

    const updatedHistory = [newSession, ...chatHistory].slice(0, 20); // Keep last 20 chats
    setChatHistory(updatedHistory);
    saveChatHistory(updatedHistory);
  };

  /**
   * Load a chat session from history
   */
  const loadChatSession = (session: ChatSession) => {
    setMessages(session.messages);
    setShowHistory(false);
  };

  /**
   * Clear chat history
   */
  const clearChatHistory = () => {
    setChatHistory([]);
    saveChatHistory([]);
    setShowHistory(false);
  };

  /**
   * Handle sending message with streaming AI response
   */
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      await generateAIResponse(inputMessage);
    } catch (error) {
      toast.error("Error sending message");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle voice input (simplified for demo)
   */
  const handleVoiceInput = () => {
    setIsListening(!isListening);

    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setInputMessage("How do I treat this disease?");
        setIsListening(false);
      }, 2000);
    }
  };

  /**
   * Quick question buttons for common queries
   */
  const quickQuestions = [
    "How do I treat this?",
    "How much will it cost?",
    "Is it serious?",
    "How to prevent it?",
  ];

  return (
    <Card className="w-full max-w-md mx-auto h-[80vh] flex flex-col">
      {/* Chat Header */}
      <CardHeader className="pb-4 border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="text-lg">AI Assistant</span>
          </div>
          <div className="flex items-center space-x-2">
            {locationLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {userLocation && (
              <Badge variant="outline" className="text-xs">
                📍 {userLocation.split(",")[0]}
              </Badge>
            )}
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="relative"
            >
              <History className="h-4 w-4" />
              {chatHistory.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center">
                  {chatHistory.length}
                </Badge>
              )}
            </Button>
          </div>
        </CardTitle>

        <div className="flex items-center justify-between text-sm">
          <Badge variant="secondary" className="text-xs">
            Disease: {scanResult.disease.name}
          </Badge>
        </div>
      </CardHeader>

      {/* History Sidebar */}
      {showHistory && (
        <div className="absolute top-0 left-0 w-full h-full bg-background border-r z-10 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Chat History</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChatHistory}
                className="h-8 w-8 p-0"
                title="Clear history"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(false)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {chatHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center p-4">
                No chat history yet
              </p>
            ) : (
              <div className="space-y-2">
                {chatHistory.map((session) => (
                  <Button
                    key={session.id}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3 hover:bg-muted"
                    onClick={() => loadChatSession(session)}
                  >
                    <div className="text-sm">
                      <div className="font-medium truncate">
                        {session.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session.diseaseName} •{" "}
                        {new Date(session.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <div
          ref={chatContainerRef}
          className="h-full overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === "ai" && (
                    <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                  )}
                  {message.type === "user" && (
                    <User className="h-4 w-4 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1 text-sm">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-lg font-semibold mt-2 mb-1">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-base font-semibold mt-2 mb-1">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-semibold mt-2 mb-1">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside my-2 space-y-1 pl-4">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside my-2 space-y-1 pl-4">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="mb-1">{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                            {children}
                          </pre>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-muted-foreground pl-3 italic">
                            {children}
                          </blockquote>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic">{children}</em>
                        ),
                        a: ({ children, href }) => (
                          <a
                            href={href}
                            className="text-primary underline hover:no-underline"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4" />
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      {/* Quick Questions */}
      <div className="p-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">Quick Questions</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={saveCurrentChat}
            className="text-xs h-6 px-2"
            disabled={messages.length <= 1}
          >
            Save Chat
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {quickQuestions.map((q, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setInputMessage(q)}
              className="text-xs h-8 px-2"
            >
              {q}
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceInput}
              className={`absolute right-1 top-1 h-8 w-8 p-0 ${
                isListening ? "text-red-500" : ""
              }`}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
            className="h-10 w-10 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
