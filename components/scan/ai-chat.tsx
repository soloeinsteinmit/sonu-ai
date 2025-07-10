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
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Bot,
  User,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScanResult } from "@/lib/types/disease";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  contentTwi?: string;
  timestamp: Date;
  isTranslated?: boolean;
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "tw">("en");
  const [isTranslationMode, setIsTranslationMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Initialize chat with welcome message
   */
  useEffect(() => {
    const welcomeMessage: Message = {
      id: `msg-${Date.now()}`,
      type: "ai",
      content: `Hello! I'm your AgriSentry AI assistant. I can see you've detected ${scanResult.disease.name} in your crop. Feel free to ask me any questions about this disease, treatment options, or general farming advice. How can I help you today?`,
      contentTwi: `Akwaaba! Me ne AgriSentry AI ɔboafoɔ. Mehunu sɛ woahunu ${scanResult.disease.name} wɔ w'afuo mu. Wobɛtumi abisa me nsɛm biara fa saa yadeɛ yi, aduroɔ anaa akuafoɔ afotuo ho. Ɛdeɛn na metumi ayɛ ama wo ɛnnɛ?`,
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
  }, [scanResult]);

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
   * Generate AI response based on user input and scan results
   */
  const generateAIResponse = (userMessage: string): Message => {
    const diseaseInfo = scanResult.disease;
    const detectionResult = scanResult.detectionResult;

    // Simple pattern matching for demo (in production, this would use a proper AI API)
    const lowerMessage = userMessage.toLowerCase();

    let response = "";
    let responseTwi = "";

    if (
      lowerMessage.includes("treatment") ||
      lowerMessage.includes("cure") ||
      lowerMessage.includes("medicine")
    ) {
      const primaryTreatment = scanResult.recommendations.primary;
      response = `For ${diseaseInfo.name}, I recommend ${primaryTreatment.name}. This ${primaryTreatment.type} treatment costs between GHS ${primaryTreatment.cost.min}-${primaryTreatment.cost.max} and has ${primaryTreatment.effectiveness}% effectiveness. Apply ${primaryTreatment.frequency} for ${primaryTreatment.duration}. Would you like detailed application instructions?`;
      responseTwi = `${diseaseInfo.name} ho no, mekamfo ${primaryTreatment.name}. Saa ${primaryTreatment.type} aduro yi bo yɛ GHS ${primaryTreatment.cost.min}-${primaryTreatment.cost.max} na ɛyɛ adwuma ${primaryTreatment.effectiveness}%. Fa di dwuma ${primaryTreatment.frequency} ma ${primaryTreatment.duration}. Wopɛ sɛ mekyerɛ wo sɛdeɛ wobɛfa adi dwuma anaa?`;
    } else if (
      lowerMessage.includes("cost") ||
      lowerMessage.includes("price") ||
      lowerMessage.includes("money")
    ) {
      const primaryTreatment = scanResult.recommendations.primary;
      response = `The recommended treatment (${primaryTreatment.name}) costs between GHS ${primaryTreatment.cost.min}-${primaryTreatment.cost.max}. This is quite affordable and very effective at ${primaryTreatment.effectiveness}%. There are also alternative treatments available if you need different price ranges.`;
      responseTwi = `Aduro a mekamfo no (${primaryTreatment.name}) bo yɛ GHS ${primaryTreatment.cost.min}-${primaryTreatment.cost.max}. Ɛnyɛ den sɛ wobɛtɔ na ɛyɛ adwuma yie ${primaryTreatment.effectiveness}%. Aduro foforɔ nso wɔ hɔ sɛ wohwehwɛ bo foforɔ a.`;
    } else if (
      lowerMessage.includes("prevent") ||
      lowerMessage.includes("avoid")
    ) {
      response = `To prevent ${diseaseInfo.name} in the future: 1) Use certified disease-free planting material, 2) Maintain proper field sanitation, 3) Practice crop rotation, 4) Monitor crops regularly. Early detection is key! The disease currently affects ${diseaseInfo.prevalence}% of crops in Ghana.`;
      responseTwi = `Sɛdeɛ wobɛsi ${diseaseInfo.name} kwan no: 1) Fa nnua a yadeɛ nni mu a wɔasiɛ, 2) Ma w'afuo mu nyɛ fi, 3) Sesa nnɔbaeɛ ahoroɔ, 4) Hwɛ wo nnɔbaeɛ berɛ biara. Ntɛm a wobɛhunu no yɛ adwo! Seesei yadeɛ yi ka nnɔbaeɛ ${diseaseInfo.prevalence}% wɔ Ghana.`;
    } else if (
      lowerMessage.includes("severe") ||
      lowerMessage.includes("serious") ||
      lowerMessage.includes("bad")
    ) {
      response = `Your plant shows ${detectionResult.severity} level infection with ${detectionResult.affectedArea}% of the area affected. With ${detectionResult.confidence}% confidence, this is ${diseaseInfo.name}. Don't worry - this is treatable! Start treatment immediately for best results.`;
      responseTwi = `Wo nnua no anya yadeɛ a emu yɛ ${detectionResult.severity} na ɛka nneɛma ${detectionResult.affectedArea}%. ${detectionResult.confidence}% mu no, ɛyɛ ${diseaseInfo.name}. Mma w'ani nnwane - wobɛtumi asa! Fi aseɛ ntɛm ara na ɛbɛyɛ yie.`;
    } else if (
      lowerMessage.includes("how long") ||
      lowerMessage.includes("time")
    ) {
      const primaryTreatment = scanResult.recommendations.primary;
      response = `Treatment typically takes ${primaryTreatment.duration} with ${primaryTreatment.frequency} applications. You should see improvement within 1-2 weeks if applied correctly. Full recovery depends on the severity - your case shows ${detectionResult.severity} level infection.`;
      responseTwi = `Aduro no gye ${primaryTreatment.duration} na wode di dwuma ${primaryTreatment.frequency}. Sɛ wode di dwuma yie a, wobɛhunu nsakraeɛ wɔ dapɛn 1-2 mu. Sɛ ɛbɛyɛ yie koraa no gyina sɛdeɛ yadeɛ no mu teɛ so - wo deɛ no mu yɛ ${detectionResult.severity}.`;
    } else if (
      lowerMessage.includes("safe") ||
      lowerMessage.includes("danger") ||
      lowerMessage.includes("harm")
    ) {
      const primaryTreatment = scanResult.recommendations.primary;
      const safetyLevel = primaryTreatment.safety.level;
      response = `The recommended treatment has ${safetyLevel} safety risk. ${
        primaryTreatment.safety.warnings.length > 0
          ? "Important warnings: " +
            primaryTreatment.safety.warnings.join(", ") +
            "."
          : "It's generally safe to use."
      } Always follow the application instructions carefully.`;
      responseTwi = `Aduro no mu asiane yɛ ${safetyLevel}. ${
        primaryTreatment.safety.warnings.length > 0
          ? "Kɔkɔbɔ a ɛho hia: " +
            primaryTreatment.safety.warnings.join(", ") +
            "."
          : "Ɛnyɛ asiane biara."
      } Kae sɛ wobɛdi akwankyerɛ no so pɛpɛɛpɛ.`;
    } else {
      // General response
      response = `I understand you're asking about ${
        diseaseInfo.name
      }. This disease affects ${diseaseInfo.affectedCrops.join(
        ", "
      )} crops and shows symptoms like: ${diseaseInfo.symptoms
        .slice(0, 2)
        .join(
          ", "
        )}. Is there a specific aspect you'd like to know more about - treatment, prevention, or cost?`;
      responseTwi = `Mete aseɛ sɛ worebisa ${
        diseaseInfo.name
      } ho asɛm. Saa yadeɛ yi ka ${diseaseInfo.affectedCrops.join(
        ", "
      )} nnɔbaeɛ na ɛda nsɛnkyerɛnneɛ te sɛ: ${diseaseInfo.symptoms
        .slice(0, 2)
        .join(
          ", "
        )} adi. Asɛm bɛn pɔtee na wopɛ sɛ mehwɛ - aduro, siakwan, anaa bo?`;
    }

    return {
      id: `msg-${Date.now()}`,
      type: "ai",
      content: response,
      contentTwi: responseTwi,
      timestamp: new Date(),
    };
  };

  /**
   * Handle sending message
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

    // Simulate API delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
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
   * Handle text-to-speech
   */
  const handleSpeak = (text: string, language: "en" | "tw" = "en") => {
    if ("speechSynthesis" in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "tw" ? "ak-GH" : "en-GB"; // Akan (Twi) or English
      utterance.rate = 0.8;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  /**
   * Toggle translation mode
   */
  const toggleTranslation = () => {
    setIsTranslationMode(!isTranslationMode);
    setCurrentLanguage(currentLanguage === "en" ? "tw" : "en");
  };

  /**
   * Quick question buttons for common queries
   */
  const quickQuestions = [
    { en: "How do I treat this?", tw: "Mɛyɛ dɛn asa?" },
    { en: "How much will it cost?", tw: "Ɛbɛboa sɛn?" },
    { en: "Is it serious?", tw: "Ɛmu yɛ den anaa?" },
    { en: "How to prevent it?", tw: "Mɛyɛ dɛn asi kwan?" },
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
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTranslation}
              className={isTranslationMode ? "bg-primary/10" : ""}
            >
              <Languages className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
        </CardTitle>

        <div className="flex items-center justify-between text-sm">
          <Badge variant="secondary" className="text-xs">
            Disease: {scanResult.disease.name}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {currentLanguage === "en" ? "English" : "Twi"}
          </Badge>
        </div>
      </CardHeader>

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
                  <div className="flex-1">
                    <p className="text-sm">
                      {isTranslationMode &&
                      message.contentTwi &&
                      currentLanguage === "tw"
                        ? message.contentTwi
                        : message.content}
                    </p>

                    {message.type === "ai" && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleSpeak(
                              isTranslationMode &&
                                message.contentTwi &&
                                currentLanguage === "tw"
                                ? message.contentTwi
                                : message.content,
                              currentLanguage
                            )
                          }
                          disabled={isSpeaking}
                          className="h-6 px-2"
                        >
                          {isSpeaking ? (
                            <VolumeX className="h-3 w-3" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                        </Button>

                        {message.contentTwi && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setCurrentLanguage(
                                currentLanguage === "en" ? "tw" : "en"
                              )
                            }
                            className="h-6 px-2 text-xs"
                          >
                            {currentLanguage === "en" ? "Twi" : "Eng"}
                          </Button>
                        )}
                      </div>
                    )}
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
        <div className="grid grid-cols-2 gap-2 mb-4">
          {quickQuestions.map((q, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() =>
                setInputMessage(currentLanguage === "tw" ? q.tw : q.en)
              }
              className="text-xs h-8 px-2"
            >
              {currentLanguage === "tw" ? q.tw : q.en}
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                currentLanguage === "tw"
                  ? "Kyerɛw wo nsɛm..."
                  : "Ask me anything..."
              }
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
