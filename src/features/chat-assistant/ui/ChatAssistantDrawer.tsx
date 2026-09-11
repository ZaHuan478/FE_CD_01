import React, { useState, useRef, useEffect } from 'react'
import {
  X,
  Send,
  Trash2,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { ChatMessageList } from './ChatMessageList'
import { useAuth } from '../../authentication/model/session'
import {
  streamChatMessage,
  type ChatMessageItem
} from '../model/chatAssistantModel'

export const ChatAssistantDrawer: React.FC = () => {
  const { status } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessageItem[]>([])
  const [sessionId, setSessionId] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen, messages, isLoading])

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputMessage
    if (!textToSend.trim() || isLoading) return

    const userMessage: ChatMessageItem = {
      messageId: `temp-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      citations: [],
      createdAt: new Date().toISOString()
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setError(null)
    setIsLoading(true)

    try {
      const assistantId = `bot-${Date.now()}`
      setMessages((prev) => [...prev, {
        messageId: assistantId,
        role: 'assistant',
        content: '',
        citations: [],
        createdAt: new Date().toISOString()
      }])
      const response = await streamChatMessage({ message: textToSend.trim(), sessionId }, (token) => {
        setMessages((prev) => prev.map(message => message.messageId === assistantId
          ? { ...message, content: message.content + token }
          : message))
      })

      setSessionId(response.sessionId)
      setMessages((prev) => prev.map(message => message.messageId === assistantId
        ? { ...message, content: response.message, citations: response.citations }
        : message))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi khi kết nối với máy chủ AI'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const handleClear = () => {
    setMessages([])
    setSessionId(undefined)
    setError(null)
  }

  const quickPrompts = [
    'Quy trình đánh giá thử việc gồm những bước nào?',
    'Thời hạn và biểu mẫu chấm công quy định ra sao?',
    'Quy trình tiếp nhận nhân viên mới (Onboarding)'
  ]

  if (status !== 'authenticated') {
    return null
  }

  return (
    <>
      {/* 1. Nút nổi (Floating Bubble Trigger) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
          title="Mở Trợ lý AI Tra cứu Quy trình iSOP"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <span className="font-semibold text-sm tracking-wide">Hỏi đáp SOP</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>
      )}

      {/* 2. Cửa sổ Chatbot Drawer */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 shadow-2xl border border-slate-200/80 bg-slate-50 flex flex-col overflow-hidden ${
            isExpanded
              ? 'inset-4 md:inset-10 rounded-2xl'
              : 'bottom-4 right-4 md:bottom-6 md:right-6 w-[95vw] md:w-[440px] h-[600px] max-h-[90vh] rounded-2xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  Trợ lý Quy trình iSOP
                  <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                    AI
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">Tra cứu có nguồn dẫn chứng & bảo mật theo quyền</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Xóa đoạn hội thoại"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden md:block p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body: Danh sách tin nhắn */}
          <ChatMessageList messages={messages} isLoading={isLoading} />
          <div ref={messagesEndRef} />

          {/* Gợi ý câu hỏi nhanh (chỉ hiện khi chưa có tin nhắn) */}
          {messages.length === 0 && (
            <div className="px-4 py-2 bg-white/70 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Gợi ý câu hỏi:</div>
              <div className="flex flex-col gap-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => void handleSend(prompt)}
                    className="text-left text-xs text-slate-700 bg-slate-100/80 hover:bg-indigo-50 hover:text-indigo-700 px-3 py-1.5 rounded-lg border border-slate-200/60 transition-colors cursor-pointer truncate"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Thông báo lỗi nếu có */}
          {error && (
            <div className="mx-4 mb-2 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-800 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Footer Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex items-end gap-2 bg-slate-100 rounded-xl p-1.5 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Nhập câu hỏi về quy trình hoặc thủ tục..."
                className="flex-1 bg-transparent border-0 resize-none outline-none text-xs md:text-sm text-slate-800 placeholder:text-slate-400 max-h-24 px-2 py-1"
              />
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={!inputMessage.trim() || isLoading}
                className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                title="Gửi câu hỏi"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-slate-400">
              <span>Nhấn Enter để gửi, Shift + Enter để xuống dòng</span>
              <span>Được bảo vệ bởi Gemini RAG</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
