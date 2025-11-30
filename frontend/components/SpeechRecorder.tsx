"use client"

import { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'

interface SpeechRecorderProps {
  audioStream: MediaStream | null
  remoteAudioStream: MediaStream | null
  onTranscript: (transcript: string, speaker: 'me' | 'other') => void
  isActive: boolean
  socket: Socket | null
  matchId: string | null
}

export function SpeechRecorder({
  audioStream,
  remoteAudioStream,
  onTranscript,
  isActive,
  socket,
  matchId
}: SpeechRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<any>(null)
  const localMediaRecorderRef = useRef<MediaRecorder | null>(null)
  const remoteMediaRecorderRef = useRef<MediaRecorder | null>(null)
  const localAudioChunksRef = useRef<Blob[]>([])
  const remoteAudioChunksRef = useRef<Blob[]>([])

  // Web Speech API for local real-time transcription
  useEffect(() => {
    if (!isActive || !audioStream) return

    // Check if browser supports Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('Web Speech API not supported, using MediaRecorder fallback')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'vi-VN'
    
    // Set minimum confidence threshold (0.0 to 1.0)
    // Higher value = more strict, only high confidence transcripts
    if ('maxAlternatives' in recognition) {
      (recognition as any).maxAlternatives = 1
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let hasHighConfidence = false
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript
        const confidence = result[0].confidence !== undefined ? result[0].confidence : 0.7
        
        // Only accept transcripts with confidence > 0.6 to filter out background noise
        if (result.isFinal && confidence > 0.6) {
          finalTranscript += transcript + ' '
          hasHighConfidence = true
        }
      }

      // Additional filtering: reject very short transcripts or common noise patterns
      const trimmedTranscript = finalTranscript.trim()
      if (trimmedTranscript && hasHighConfidence) {
        // Filter out very short transcripts (likely noise)
        if (trimmedTranscript.length < 3) {
          return
        }
        
        // Filter out common noise patterns (you can add more patterns)
        const noisePatterns = [
          /^[aeiou]+$/i, // Only vowels
          /^(uh|um|ah|eh|oh)+$/i, // Only filler sounds
        ]
        
        const isNoise = noisePatterns.some(pattern => pattern.test(trimmedTranscript))
        if (isNoise) {
          return
        }
        
        onTranscript(trimmedTranscript, 'me')
        // Send to socket
        if (socket && matchId) {
          socket.emit('send-transcript', {
            matchId,
            transcript: trimmedTranscript,
            speaker: 'me'
          })
        }
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
    }

    recognition.onend = () => {
      if (isActive && audioStream) {
        try {
          recognition.start()
        } catch (e) {
          console.error('Error restarting recognition:', e)
        }
      }
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
      setIsRecording(false)
    }
  }, [isActive, audioStream, socket, matchId, onTranscript])

  // MediaRecorder for local audio (backup)
  useEffect(() => {
    if (!isActive || !audioStream) return

    try {
      const mediaRecorder = new MediaRecorder(audioStream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      localAudioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          localAudioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        if (localAudioChunksRef.current.length > 0) {
          const audioBlob = new Blob(localAudioChunksRef.current, { type: 'audio/webm' })
          // Only transcribe if audio blob is large enough (at least 1KB)
          if (audioBlob.size > 1024) {
            await transcribeAudio(audioBlob, 'me')
          }
          localAudioChunksRef.current = []
        }
      }

      localMediaRecorderRef.current = mediaRecorder
      
      // Record in chunks (every 5 seconds)
      const startRecording = () => {
        if (mediaRecorder.state === 'inactive') {
          mediaRecorder.start()
        }
      }

      startRecording()
      const interval = setInterval(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop()
          setTimeout(() => {
            if (isActive && audioStream) {
              startRecording()
            }
          }, 100)
        }
      }, 10000) // Increased from 5s to 10s to ensure audio is long enough

      return () => {
        clearInterval(interval)
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop()
        }
        localMediaRecorderRef.current = null
      }
    } catch (error) {
      console.error('Error setting up local MediaRecorder:', error)
    }
  }, [isActive, audioStream])

  // MediaRecorder for remote audio
  useEffect(() => {
    if (!isActive || !remoteAudioStream) return

    try {
      const mediaRecorder = new MediaRecorder(remoteAudioStream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      remoteAudioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          remoteAudioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        if (remoteAudioChunksRef.current.length > 0) {
          const audioBlob = new Blob(remoteAudioChunksRef.current, { type: 'audio/webm' })
          // Only transcribe if audio blob is large enough (at least 1KB)
          if (audioBlob.size > 1024) {
            await transcribeAudio(audioBlob, 'other')
          }
          remoteAudioChunksRef.current = []
        }
      }

      remoteMediaRecorderRef.current = mediaRecorder
      
      // Record in chunks (every 5 seconds)
      const startRecording = () => {
        if (mediaRecorder.state === 'inactive') {
          mediaRecorder.start()
        }
      }

      startRecording()
      const interval = setInterval(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop()
          setTimeout(() => {
            if (isActive && remoteAudioStream) {
              startRecording()
            }
          }, 100)
        }
      }, 10000) // Increased from 5s to 10s to ensure audio is long enough

      return () => {
        clearInterval(interval)
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop()
        }
        remoteMediaRecorderRef.current = null
      }
    } catch (error) {
      console.error('Error setting up remote MediaRecorder:', error)
    }
  }, [isActive, remoteAudioStream])

  const transcribeAudio = async (audioBlob: Blob, speaker: 'me' | 'other') => {
    try {
      // Double check blob size before sending
      if (audioBlob.size < 1024) {
        return // Skip if too small
      }

      const formData = new FormData()
      formData.append('audio', audioBlob, 'audio.webm')

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Only log non-common errors (not "too short" errors)
        if (!errorData.details?.includes('too short') && !errorData.details?.includes('could not process')) {
          console.warn('Transcription failed:', errorData.error || 'Unknown error')
        }
        return
      }

      const data = await response.json()
      const transcript = data.transcript?.trim()
      
      if (transcript) {
        // Filter out very short transcripts (likely noise)
        if (transcript.length < 3) {
          return
        }
        
        // Filter out common noise patterns and suspicious content
        const noisePatterns = [
          /^[aeiou]+$/i, // Only vowels
          /^(uh|um|ah|eh|oh)+$/i, // Only filler sounds
          /^(subscribe|like|share|đăng ký|theo dõi)/i, // Common video/ads phrases (if not intentional)
        ]
        
        const isNoise = noisePatterns.some(pattern => pattern.test(transcript))
        if (isNoise) {
          return
        }
        
        // Check confidence if available
        const confidence = data.confidence || 0.7
        if (confidence < 0.5) {
          return // Skip low confidence transcripts
        }
        
        onTranscript(transcript, speaker)
        
        // Send to socket if it's local transcript
        if (speaker === 'me' && socket && matchId) {
          socket.emit('send-transcript', {
            matchId,
            transcript: transcript,
            speaker: 'me'
          })
        }
      }
    } catch (error) {
      // Silently handle errors to avoid console spam
      // Only log unexpected errors
      if (error instanceof Error && !error.message.includes('too short')) {
        console.warn('Error transcribing audio:', error.message)
      }
    }
  }

  return null // This component doesn't render anything
}

