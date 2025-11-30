"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { FileText, Sparkles, Loader2 } from "lucide-react"

export interface SummaryItem {
  id: string
  text: string
  timestamp: Date
  speaker: 'me' | 'other'
}

interface SummaryPanelProps {
  summaries: SummaryItem[]
}

export function SummaryPanel({ summaries }: SummaryPanelProps) {
  const [conversationSummary, setConversationSummary] = useState<string | null>(null)
  const [isSummarizing, setIsSummarizing] = useState(false)

  const handleSummarize = async () => {
    if (summaries.length === 0) return
    
    setIsSummarizing(true)
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: summaries.map(item => ({
            speaker: item.speaker,
            text: item.text
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate summary')
      }

      const data = await response.json()
      setConversationSummary(data.summary)
    } catch (error) {
      console.error('Error generating summary:', error)
      setConversationSummary('Không thể tạo tóm tắt. Vui lòng thử lại.')
    } finally {
      setIsSummarizing(false)
    }
  }

  return (
    <Card className="neo-border-sm bg-background/95 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Transcript & Tóm tắt
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* Summary Section */}
        {summaries.length > 0 && (
          <div className="mb-4 pb-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Tóm tắt cuộc trò chuyện
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSummarize}
                disabled={isSummarizing}
                className="neo-border-sm text-xs h-7"
              >
                {isSummarizing ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Đang tóm tắt...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Tóm tắt
                  </>
                )}
              </Button>
            </div>
            {conversationSummary ? (
              <div className="p-3 rounded-lg neo-border-sm bg-blue-50 dark:bg-blue-950/20">
                <p className="text-sm">{conversationSummary}</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Nhấn nút "Tóm tắt" để tạo tóm tắt cuộc trò chuyện
              </p>
            )}
          </div>
        )}

        {/* Transcript Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="text-sm font-bold mb-2">Transcript</h3>
          <ScrollArea className="flex-1">
            {summaries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Transcript sẽ xuất hiện ở đây khi bạn bắt đầu nói...
              </p>
            ) : (
              <div className="space-y-3">
                {summaries.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg neo-border-sm ${
                      item.speaker === 'me'
                        ? 'neo-blue-bg text-white'
                        : 'bg-background'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold">
                        {item.speaker === 'me' ? 'Bạn' : 'Đối phương'}
                      </span>
                      <span className={`text-xs ${
                        item.speaker === 'me' ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {item.timestamp.toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}

