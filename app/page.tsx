"use client"

import * as React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowLeft, Clock, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { LottieIcon } from "@/components/ui/lottie-icon"

interface LanguageStyle {
  id: string
  name: string
  title: string
  icon: string
  description: string
}

interface HistoryItem {
  id: string
  originalText: string
  resultText: string
  styleName: string
  styleTitle: string
  timestamp: Date
}

interface UseAutoResizeTextareaProps {
  minHeight: number
  maxHeight?: number
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current
      if (!textarea) return

      if (reset) {
        textarea.style.height = `${minHeight}px`
        return
      }

      textarea.style.height = `${minHeight}px`

      const newHeight = Math.max(
        minHeight,
        Math.min(
          textarea.scrollHeight,
          maxHeight ?? Number.POSITIVE_INFINITY
        )
      )

      textarea.style.height = `${newHeight}px`
    },
    [minHeight, maxHeight]
  )

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = `${minHeight}px`
    }
  }, [minHeight])

  return { textareaRef, adjustHeight }
}

const LANGUAGE_STYLES: LanguageStyle[] = [
  {
    id: "empathetic",
    name: "先同理",
    title: "照妖镜",
    icon: "/lottie/bg.json",
    description: "先表示理解和共情"
  },
  {
    id: "euphemistic",
    name: "委婉丁当",
    title: "震荡锤",
    icon: "/lottie/cargo.json",
    description: "委婉含蓄地表达"
  },
  {
    id: "direct",
    name: "别甩给我",
    title: "不粘锅",
    icon: "/lottie/fac.json",
    description: "直接明确拒绝"
  },
  {
    id: "professional",
    name: "专业商务",
    title: "太极钟",
    icon: "/lottie/job.json",
    description: "专业正式的商务风格"
  },
  {
    id: "humorous",
    name: "幽默化解",
    title: "金钟罩",
    icon: "/lottie/location.json",
    description: "用幽默化解尴尬"
  }
]

function LanguageTranslationInterface() {
  const [currentPage, setCurrentPage] = useState<"home" | "input" | "result" | "history">("home")
  const [currentIndex, setCurrentIndex] = useState(1)
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const { textareaRef: inputRef, adjustHeight: adjustInputHeight } = useAutoResizeTextarea({
    minHeight: 120,
    maxHeight: 300
  })

  const currentStyle = LANGUAGE_STYLES[currentIndex]

  const handleProcess = async () => {
    if (!inputValue.trim()) return

    setIsProcessing(true)

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputValue,
          style: currentStyle.name,
        }),
      })

      if (!res.ok) {
        throw new Error("API request failed")
      }

      const data = await res.json()
      const resultText = data.result || ""

      setIsProcessing(false)
      setCurrentPage("result")

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        originalText: inputValue,
        resultText: resultText,
        styleName: currentStyle.name,
        styleTitle: currentStyle.title,
        timestamp: new Date()
      }
      setHistory(prev => [newItem, ...prev])
    } catch (err) {
      console.error("Rewrite error:", err)
      setIsProcessing(false)
      alert("转换失败，请稍后重试")
    }
  }

  const handleBack = () => {
    if (currentPage === "history" || currentPage === "result") {
      setCurrentPage("input")
    } else if (currentPage === "input") {
      setCurrentPage("home")
      setInputValue("")
    }
  }

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % LANGUAGE_STYLES.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + LANGUAGE_STYLES.length) % LANGUAGE_STYLES.length)
  }

  const getVisibleCards = () => {
    const visible = []
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + LANGUAGE_STYLES.length) % LANGUAGE_STYLES.length
      visible.push({ ...LANGUAGE_STYLES[index], offset: i, realIndex: index })
    }
    return visible
  }

  // Swipe handling
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStart(e.clientX)
    setIsDragging(true)
  }

  const handlePointerMove = () => {
    if (!isDragging || dragStart === null) return
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || dragStart === null) return

    const diff = dragStart - e.clientX
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }

    setDragStart(null)
    setIsDragging(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  const getHeaderTitle = () => {
    switch (currentPage) {
      case "home": return "ZT"
      case "history": return "历史记录"
      case "result": return currentStyle.title
      default: return currentStyle.title
    }
  }

  const showBackButton = currentPage !== "home"
  const showHistoryButton = currentPage === "input"

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center sm:p-4">
      <div className="w-full sm:max-w-[420px] sm:bg-white sm:rounded-[32px] sm:shadow-[0_8px_32px_rgba(139,124,247,0.15)] overflow-hidden bg-white h-screen sm:h-auto flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            {showBackButton ? (
              <button
                onClick={handleBack}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F3FF] transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#1E1B4B]" />
              </button>
            ) : (
              <div className="w-8" />
            )}
            <motion.h1
              key={getHeaderTitle()}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-semibold text-[#1E1B4B]"
            >
              {getHeaderTitle()}
            </motion.h1>
            {showHistoryButton ? (
              <button
                onClick={() => setCurrentPage("history")}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F3FF] transition-colors"
              >
                <Clock className="w-5 h-5 text-[#1E1B4B]" />
              </button>
            ) : (
              <div className="w-8" />
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Home Page */}
          {currentPage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col flex-1 items-center justify-center px-6"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="w-32 h-32 mb-8"
              >
                <LottieIcon src="/lottie/bg.json" className="w-full h-full" />
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-4xl font-bold text-[#1E1B4B] mb-4"
              >
                ZT
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-sm text-[#7C7DBF] mb-12"
              >
                对什么人说什么话
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="w-full pb-8"
              >
                <Button
                  onClick={() => setCurrentPage("input")}
                  className={cn(
                    "w-full h-14 text-base font-semibold rounded-2xl shadow-lg transition-all duration-300",
                    "bg-gradient-to-r from-[#A78BFA] to-[#7C9BF7]",
                    "text-white hover:shadow-xl hover:scale-[1.02]"
                  )}
                >
                  <span className="flex-1 text-center">帮你说话</span>
                  <Sparkles className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Input Page */}
          {currentPage === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col flex-1"
            >
              {/* Style Selection - Swipe Carousel */}
              <div className="pb-6">
                <label className="text-sm font-medium text-[#1E1B4B] mb-4 block px-6">
                  选择风格
                </label>

                <div
                  ref={containerRef}
                  className="relative h-[220px] flex items-center justify-center overflow-hidden select-none"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  style={{ touchAction: 'pan-y' }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <AnimatePresence mode="popLayout">
                      {getVisibleCards().map((style) => {
                        const isCenter = style.offset === 0
                        const scale = isCenter ? 1 : 0.72
                        const opacity = isCenter ? 1 : 0.5
                        const zIndex = isCenter ? 20 : 10
                        const xOffset = style.offset * 160

                        return (
                          <motion.div
                            key={`${style.id}-${style.offset}`}
                            initial={{ x: xOffset, scale, opacity }}
                            animate={{ x: xOffset, scale, opacity }}
                            exit={{ x: xOffset, scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="absolute"
                            style={{ zIndex }}
                          >
                            <div
                              onClick={() => !isDragging && setCurrentIndex(style.realIndex)}
                              className={cn(
                                "flex flex-col items-center justify-center gap-3 rounded-3xl transition-all duration-300",
                                isCenter
                                  ? "w-[150px] h-[190px] bg-[#F8F7FF] shadow-[0_8px_30px_rgba(139,124,247,0.2)]"
                                  : "w-[150px] h-[190px] bg-white/60 backdrop-blur-sm"
                              )}
                            >
                              <div className={cn("transition-all duration-300", isCenter ? "w-20 h-20" : "w-14 h-14 opacity-70")}>
                                <LottieIcon src={style.icon} className="w-full h-full" />
                              </div>
                              <span className={cn(
                                "font-medium transition-all duration-300",
                                isCenter ? "text-sm text-[#8B7CF7]" : "text-xs text-[#9CA3AF]"
                              )}>
                                {style.name}
                              </span>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Input Section */}
              <div className="px-6 pb-6">
                <label className="text-sm font-medium text-[#1E1B4B] mb-3 block">
                  你想说的话
                </label>
                <div className="relative">
                  <Textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                      adjustInputHeight()
                    }}
                    placeholder="这个话不是我负责的，别老找我。"
                    className="min-h-[120px] resize-none bg-[#F8F7FF] border-0 rounded-2xl p-4 text-[#1E1B4B] placeholder:text-[#A5A3C7] text-base leading-relaxed focus-visible:ring-2 focus-visible:ring-[#8B7CF7]/30 focus-visible:ring-offset-0"
                  />
                  <div className="absolute bottom-3 right-4 text-xs text-[#A5A3C7]">
                    {inputValue.length}/300
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-8 mt-auto">
                <Button
                  onClick={handleProcess}
                  disabled={!inputValue.trim() || isProcessing}
                  className={cn(
                    "w-full h-14 text-base font-semibold rounded-2xl shadow-lg transition-all duration-300",
                    "bg-gradient-to-r from-[#A78BFA] to-[#7C9BF7]",
                    "text-white hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  )}
                >
                  <span className="flex-1 text-center">
                    {isProcessing ? "润色中..." : "开始转换"}
                  </span>
                  <Sparkles className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Result Page */}
          {currentPage === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col flex-1 px-6"
            >
              {/* Original Text */}
              <div className="mb-6">
                <label className="text-sm font-medium text-[#1E1B4B] mb-3 block">
                  原始内容
                </label>
                <div className="bg-[#F8F7FF] rounded-2xl p-4">
                  <p className="text-[#1E1B4B] text-base leading-relaxed">
                    {history[0]?.originalText}
                  </p>
                </div>
              </div>

              {/* Result */}
              <div className="mb-6 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#1E1B4B]">
                    转换结果
                  </label>
                  <span className="text-xs text-[#8B7CF7] bg-[#F8F7FF] px-2 py-1 rounded-full">
                    {history[0]?.styleName}
                  </span>
                </div>
                <div className="bg-gradient-to-br from-[#F8F7FF] to-[#F0EFFF] rounded-2xl p-4 border border-[#E0DFFC]">
                  <p className="text-[#1E1B4B] text-base leading-relaxed whitespace-pre-wrap">
                    {history[0]?.resultText}
                  </p>
                </div>
              </div>

              {/* Copy Button */}
              <div className="pb-8">
                <Button
                  onClick={() => history[0] && handleCopy(history[0].resultText, history[0].id)}
                  className={cn(
                    "w-full h-14 text-base font-semibold rounded-2xl shadow-lg transition-all duration-300",
                    "bg-gradient-to-r from-[#A78BFA] to-[#7C9BF7]",
                    "text-white hover:shadow-xl hover:scale-[1.02]"
                  )}
                >
                  <span className="flex-1 text-center">
                    {copiedId === history[0]?.id ? "已复制" : "复制结果"}
                  </span>
                  {copiedId === history[0]?.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* History Page */}
          {currentPage === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col flex-1 px-6 overflow-y-auto"
            >
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-[#A5A3C7]">
                  <Clock className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-sm">暂无历史记录</p>
                </div>
              ) : (
                <div className="space-y-4 pb-8">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#F8F7FF] rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#8B7CF7] bg-white px-2 py-1 rounded-full">
                          {item.styleName}
                        </span>
                        <span className="text-xs text-[#A5A3C7]">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-[#1E1B4B] mb-2 line-clamp-2">
                        {item.originalText}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[#7C7DBF] line-clamp-1 flex-1">
                          {item.resultText}
                        </p>
                        <button
                          onClick={() => handleCopy(item.resultText, item.id)}
                          className="ml-2 p-2 rounded-full hover:bg-white transition-colors"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-[#8B7CF7]" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function Home() {
  return <LanguageTranslationInterface />
}
