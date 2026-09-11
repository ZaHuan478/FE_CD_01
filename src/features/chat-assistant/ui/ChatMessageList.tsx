import React from 'react'
import { Bot, User, Sparkles } from 'lucide-react'
import type { ChatMessageItem, Citation } from '../model/chatAssistantModel'
import { CitationBadge } from './CitationBadge'

interface ChatMessageListProps {
  messages: ChatMessageItem[]
  isLoading?: boolean
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isLoading }) => {
  // Hàm render text kèm chèn component CitationBadge tương tác
  const renderMessageContent = (text: string, citations: Citation[]) => {
    if (!citations || citations.length === 0) {
      return <div className="whitespace-pre-wrap leading-relaxed">{text}</div>
    }

    // Tách văn bản theo các số trích dẫn dạng [1], [2], ...
    const parts = text.split(/(\[\d+\])/g)

    return (
      <div className="whitespace-pre-wrap leading-relaxed">
        {parts.map((part, index) => {
          const match = part.match(/^\[(\d+)\]$/)
          if (match) {
            const citeIndex = parseInt(match[1]!, 10)
            const matchedCitation = citations.find((c) => c.index === citeIndex)
            if (matchedCitation) {
              return <CitationBadge key={index} citation={matchedCitation} />
            }
          }
          return <span key={index}>{part}</span>
        })}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3 shadow-xs">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="font-semibold text-slate-800 text-sm mb-1">Trợ lý Quy trình iSOP AI</h3>
          <p className="text-xs text-slate-500 max-w-xs leading-normal">
            Hỏi bất kỳ điều gì về quy trình, thủ tục hành chính, biểu mẫu hoặc quy định nhân sự mà bạn có quyền truy cập.
          </p>
        </div>
      )}

      {messages.map((msg) => {
        const isUser = msg.role === 'user'

        return (
          <div
            key={msg.messageId}
            className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${
                isUser
                  ? 'bg-slate-800 text-white'
                  : 'bg-gradient-to-br from-indigo-500 to-sky-500 text-white'
              }`}
            >
              {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
                isUser
                  ? 'bg-slate-900 text-white rounded-tr-xs'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
              }`}
            >
              {renderMessageContent(msg.content, msg.citations)}

              {/* Danh sách nguồn trích dẫn đính kèm ở chân tin nhắn của Bot */}
              {!isUser && msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-medium text-slate-600 flex items-center gap-1 text-[11px]">
                    Nguồn dẫn chứng:
                  </span>
                  {msg.citations.map((cite) => (
                    <CitationBadge key={cite.index} citation={cite} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Trạng thái đang sinh phản hồi */}
      {isLoading && (
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 text-white flex items-center justify-center shrink-0 animate-pulse">
            <Bot className="w-4 h-4" />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
              <span className="text-xs text-slate-400 ml-1.5">Đang tra cứu quy trình và phân tích quyền...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
