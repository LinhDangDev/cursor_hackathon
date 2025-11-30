"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Video, Send, X, Mic, MicOff, VideoOff, PhoneOff, FileText, Volume2, VolumeX } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useSocket } from '@/contexts/SocketContext'
import { useAuth } from '@/contexts/AuthContext'
import { SpeechRecorder } from '@/components/SpeechRecorder'
import { SummaryPanel, SummaryItem } from '@/components/SummaryPanel'

interface Message {
  id: string
  text: string
  sender: 'me' | 'other'
  timestamp: Date
}

type CallState = 'idle' | 'calling' | 'ringing' | 'active' | 'ended'

export default function ChatPage() {
  const router = useRouter()
  const { socket, matchId, matchedUser, commonInterests } = useSocket()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  
  // Call states
  const [callState, setCallState] = useState<CallState>('idle')
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [incomingCall, setIncomingCall] = useState<{ callType: 'voice' | 'video', from: any } | null>(null)
  
  // WebRTC refs
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Transcript states
  const [summaries, setSummaries] = useState<SummaryItem[]>([])
  const [showTranscript, setShowTranscript] = useState(true) // Show by default
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(true) // Enable transcription by default
  
  // Handler for transcript
  const handleTranscript = (transcript: string, speaker: 'me' | 'other') => {
    setSummaries(prev => [...prev, {
      id: Date.now().toString(),
      text: transcript,
      timestamp: new Date(),
      speaker
    }])
  }

  useEffect(() => {
    setIsMounted(true)
    if (matchedUser) {
      setMessages([
        {
          id: '1',
          text: `Xin chào! Rất vui được gặp bạn! Chúng ta có chung sở thích về: ${commonInterests.join(', ')}`,
          sender: 'other',
          timestamp: new Date()
        }
      ])
    }
  }, [matchedUser, commonInterests])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Update local video when stream changes
  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current && callType === 'video' && callState === 'active') {
      // Use setTimeout to ensure video element is fully rendered
      setTimeout(() => {
        if (localVideoRef.current && localStreamRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current
          // Force video to play
          localVideoRef.current.play().catch(err => console.error('Error playing local video:', err))
        }
      }, 100)
    }
  }, [callType, callState])

  // Update remote video when stream changes
  useEffect(() => {
    if (remoteVideoRef.current && remoteStreamRef.current && callType === 'video' && callState === 'active') {
      // Use setTimeout to ensure video element is fully rendered
      setTimeout(() => {
        if (remoteVideoRef.current && remoteStreamRef.current) {
          // Ensure we're not setting local stream to remote video
          if (remoteVideoRef.current.srcObject !== remoteStreamRef.current) {
            remoteVideoRef.current.srcObject = remoteStreamRef.current
            // Force video to play
            remoteVideoRef.current.play().catch(err => console.error('Error playing remote video:', err))
          }
        }
      }, 100)
    }
  }, [callType, callState])


  // Monitor remote stream changes periodically
  useEffect(() => {
    if (callType !== 'video' || callState !== 'active') return
    
    const checkRemoteStream = () => {
      if (remoteVideoRef.current && remoteStreamRef.current) {
        const currentSrc = remoteVideoRef.current.srcObject
        if (currentSrc !== remoteStreamRef.current) {
          console.log('Updating remote video with remote stream')
          remoteVideoRef.current.srcObject = remoteStreamRef.current
          remoteVideoRef.current.play().catch(err => console.error('Error playing remote video:', err))
        } else if (!currentSrc) {
          // If srcObject is null but we have a stream, set it
          console.log('Remote video srcObject is null, setting stream')
          remoteVideoRef.current.srcObject = remoteStreamRef.current
          remoteVideoRef.current.play().catch(err => console.error('Error playing remote video:', err))
        }
      } else if (remoteVideoRef.current && !remoteStreamRef.current) {
        // If we have video element but no stream yet, check if peer connection has tracks
        if (peerConnectionRef.current) {
          const receivers = peerConnectionRef.current.getReceivers()
          const videoReceiver = receivers.find(r => r.track && r.track.kind === 'video')
          if (videoReceiver && videoReceiver.track) {
            const stream = new MediaStream([videoReceiver.track])
            remoteStreamRef.current = stream
            console.log('Found remote video track, setting stream')
            remoteVideoRef.current.srcObject = stream
            remoteVideoRef.current.play().catch(err => console.error('Error playing remote video:', err))
          }
        }
      }
    }
    
    // Check immediately
    checkRemoteStream()
    
    // Also check periodically in case stream arrives later
    const interval = setInterval(checkRemoteStream, 500)
    
    return () => clearInterval(interval)
  }, [callType, callState])

  // Socket event handlers
  useEffect(() => {
    if (!socket) return

    socket.on('new-message', (data: { message: string, from: any }) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: data.message,
        sender: 'other',
        timestamp: new Date()
      }])
    })

    socket.on('call-offer', async (data: { matchId: string, offer: RTCSessionDescriptionInit, callType: 'voice' | 'video', from: any }) => {
      setIncomingCall({ callType: data.callType, from: data.from })
      setCallState('ringing')
      
      // Tạo peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      })
      peerConnectionRef.current = pc

      // Setup remote stream
      pc.ontrack = (event) => {
        console.log('Received remote track (call-offer):', event)
        console.log('Track kind:', event.track.kind, 'Streams:', event.streams.length)
        
        let remoteStream: MediaStream | null = null
        
        if (event.streams && event.streams.length > 0) {
          remoteStream = event.streams[0]
        } else if (event.track) {
          // If no stream, create one from the track
          remoteStream = new MediaStream([event.track])
        }
        
        if (remoteStream) {
          remoteStreamRef.current = remoteStream
          console.log('Remote stream set (call-offer), tracks:', remoteStream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, id: t.id })))
          
          // Update remote video element immediately if available
          const updateRemoteVideo = () => {
            if (remoteVideoRef.current && remoteStreamRef.current) {
              console.log('Setting remote video srcObject (call-offer)')
              remoteVideoRef.current.srcObject = remoteStreamRef.current
              remoteVideoRef.current.play().catch(err => console.error('Error playing remote video:', err))
            }
          }
          
          updateRemoteVideo()
          
          // Also try again after delays in case element wasn't ready
          setTimeout(updateRemoteVideo, 200)
          setTimeout(updateRemoteVideo, 500)
          setTimeout(updateRemoteVideo, 1000)
        }
      }

      // Setup ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('ice-candidate', {
            matchId,
            candidate: event.candidate
          })
        }
      }

      await pc.setRemoteDescription(new RTCSessionDescription(data.offer))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      if (socket) {
        socket.emit('call-answer', {
          matchId,
          answer
        })
      }
    })

    socket.on('call-answer', async (data: { matchId: string, answer: RTCSessionDescriptionInit }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer))
        setCallState('active')
        setShowTranscript(true) // Auto show transcript panel when call is answered
        
        // Ensure remote video is updated when answer is received
        // Remote stream should come via ontrack event, but we'll also check periodically
        const checkRemoteVideo = () => {
          if (callType === 'video') {
            if (remoteVideoRef.current && remoteStreamRef.current) {
              if (remoteVideoRef.current.srcObject !== remoteStreamRef.current) {
                console.log('Updating remote video after call-answer')
                remoteVideoRef.current.srcObject = remoteStreamRef.current
                remoteVideoRef.current.play().catch(err => console.error('Error playing remote video:', err))
              }
            } else if (remoteVideoRef.current && peerConnectionRef.current) {
              // Check if peer connection has remote tracks
              const receivers = peerConnectionRef.current.getReceivers()
              const videoReceiver = receivers.find(r => r.track && r.track.kind === 'video')
              if (videoReceiver && videoReceiver.track) {
                const stream = new MediaStream([videoReceiver.track])
                remoteStreamRef.current = stream
                console.log('Found remote video track after call-answer, setting stream')
                remoteVideoRef.current.srcObject = stream
                remoteVideoRef.current.play().catch(err => console.error('Error playing remote video:', err))
              }
            }
          }
        }
        
        // Check immediately and then periodically
        setTimeout(checkRemoteVideo, 300)
        setTimeout(checkRemoteVideo, 1000)
        setTimeout(checkRemoteVideo, 2000)
        setTimeout(checkRemoteVideo, 3000)
      }
    })

    socket.on('ice-candidate', async (data: { matchId: string, candidate: RTCIceCandidateInit }) => {
      if (peerConnectionRef.current && data.candidate) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate))
      }
    })

    socket.on('call-accepted', () => {
      setCallState('active')
      setIncomingCall(null)
      setShowTranscript(true) // Auto show transcript panel when call is accepted
    })

    socket.on('call-rejected', () => {
      setCallState('idle')
      setIncomingCall(null)
      endCall()
    })

    socket.on('call-ended', () => {
      endCall()
    })

    socket.on('partner-disconnected', () => {
      endCall()
      alert('Người dùng kia đã ngắt kết nối')
    })

    socket.on('new-transcript', (data: { matchId: string, transcript: string, speaker: 'me' | 'other', from: any }) => {
      setSummaries(prev => [...prev, {
        id: Date.now().toString(),
        text: data.transcript,
        timestamp: new Date(),
        speaker: data.speaker
      }])
    })

    return () => {
      socket.off('new-message')
      socket.off('call-offer')
      socket.off('call-answer')
      socket.off('ice-candidate')
      socket.off('call-accepted')
      socket.off('call-rejected')
      socket.off('call-ended')
      socket.off('partner-disconnected')
      socket.off('new-transcript')
    }
  }, [socket, matchId])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && socket && matchId) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'me',
        timestamp: new Date()
      }])
      
      socket.emit('send-message', {
        matchId,
        message: newMessage
      })
      
      setNewMessage('')
    }
  }

  const createPeerConnection = async (callType: 'voice' | 'video') => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })
    peerConnectionRef.current = pc

    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!)
      })
    }

    // Setup remote stream
    pc.ontrack = (event) => {
      console.log('Received remote track:', event)
      console.log('Track kind:', event.track.kind, 'Streams:', event.streams.length)
      
      let remoteStream: MediaStream | null = null
      
      if (event.streams && event.streams.length > 0) {
        remoteStream = event.streams[0]
      } else if (event.track) {
        // If no stream, create one from the track
        remoteStream = new MediaStream([event.track])
      }
      
      if (remoteStream) {
        remoteStreamRef.current = remoteStream
        console.log('Remote stream set, tracks:', remoteStream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, id: t.id })))
        
        // Update remote video element immediately if available
        const updateRemoteVideo = () => {
          if (remoteVideoRef.current && remoteStreamRef.current) {
            console.log('Setting remote video srcObject')
            remoteVideoRef.current.srcObject = remoteStreamRef.current
            remoteVideoRef.current.play().catch(err => console.error('Error playing remote video:', err))
          }
        }
        
        updateRemoteVideo()
        
        // Also try again after delays in case element wasn't ready
        setTimeout(updateRemoteVideo, 200)
        setTimeout(updateRemoteVideo, 500)
        setTimeout(updateRemoteVideo, 1000)
      }
    }

    // Setup ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socket && matchId) {
        socket.emit('ice-candidate', {
          matchId,
          candidate: event.candidate
        })
      }
    }

    return pc
  }

  const startVoiceCall = async () => {
    if (!socket || !matchId) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      localStreamRef.current = stream
      setCallType('voice')
      setCallState('calling')

      const pc = await createPeerConnection('voice')
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      socket.emit('call-offer', {
        matchId,
        offer,
        callType: 'voice'
      })
    } catch (error) {
      console.error('Error starting voice call:', error)
      alert('Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.')
      setCallState('idle')
    }
  }

  const startVideoCall = async () => {
    if (!socket || !matchId) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: true 
      })
      localStreamRef.current = stream
      
      setCallType('video')
      setCallState('calling')
      
      // Set video after state update to ensure element is rendered
      setTimeout(() => {
        if (localVideoRef.current && localStreamRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current
          localVideoRef.current.play().catch(err => console.error('Error playing local video:', err))
        }
      }, 100)

      const pc = await createPeerConnection('video')
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      socket.emit('call-offer', {
        matchId,
        offer,
        callType: 'video'
      })
    } catch (error) {
      console.error('Error starting video call:', error)
      alert('Không thể truy cập camera/microphone. Vui lòng kiểm tra quyền truy cập.')
      setCallState('idle')
    }
  }

  const acceptCall = async () => {
    if (!incomingCall || !socket || !matchId) return

    const callTypeToAccept = incomingCall.callType // Save before setting to null

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callTypeToAccept === 'video'
      })
      localStreamRef.current = stream

      // Add tracks to existing peer connection
      if (peerConnectionRef.current && localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          peerConnectionRef.current!.addTrack(track, localStreamRef.current!)
        })
      }

      setCallType(callTypeToAccept)
      setCallState('active')
      setIncomingCall(null)
      setShowTranscript(true) // Auto show transcript panel when accepting call

      // Set video after state update to ensure element is rendered
      if (callTypeToAccept === 'video') {
        const updateVideos = () => {
          // Update local video
          if (localVideoRef.current && localStreamRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current
            localVideoRef.current.play().catch(err => console.error('Error playing local video:', err))
          }
          
          // Update remote video if stream exists
          if (remoteVideoRef.current && remoteStreamRef.current) {
            remoteVideoRef.current.srcObject = remoteStreamRef.current
            remoteVideoRef.current.play().catch(err => console.error('Error playing remote video:', err))
          } else if (remoteVideoRef.current && peerConnectionRef.current) {
            // Check if peer connection has remote tracks
            const receivers = peerConnectionRef.current.getReceivers()
            const videoReceiver = receivers.find(r => r.track && r.track.kind === 'video')
            if (videoReceiver && videoReceiver.track) {
              const stream = new MediaStream([videoReceiver.track])
              remoteStreamRef.current = stream
              remoteVideoRef.current.srcObject = stream
              remoteVideoRef.current.play().catch(err => console.error('Error playing remote video:', err))
            }
          }
        }
        
        // Update immediately and with delays
        setTimeout(updateVideos, 100)
        setTimeout(updateVideos, 500)
        setTimeout(updateVideos, 1000)
        setTimeout(updateVideos, 2000)
      }

      socket.emit('call-accept', { matchId })
    } catch (error) {
      console.error('Error accepting call:', error)
      rejectCall()
    }
  }

  const rejectCall = () => {
    if (socket && matchId) {
      socket.emit('call-reject', { matchId })
    }
    setCallState('idle')
    setIncomingCall(null)
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
  }

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      localStreamRef.current = null
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach(track => track.stop())
      remoteStreamRef.current = null
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    if (socket && matchId) {
      socket.emit('end-call', { matchId })
    }
    setCallState('idle')
    setCallType(null)
    setIsMuted(false)
    setIsVideoOff(false)
    // Clear summaries when call ends
    setSummaries([])
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff
      })
      setIsVideoOff(!isVideoOff)
    }
  }


  if (!matchId || !matchedUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="neo-border-sm bg-background p-8">
          <CardContent className="text-center">
            <p className="text-lg font-bold">Đang tìm người phù hợp...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get audio streams for SpeechRecorder
  const getLocalAudioStream = () => {
    if (!localStreamRef.current) return null
    const audioTracks = localStreamRef.current.getAudioTracks()
    return audioTracks.length > 0 ? new MediaStream(audioTracks) : null
  }

  const getRemoteAudioStream = () => {
    if (!remoteStreamRef.current) return null
    const audioTracks = remoteStreamRef.current.getAudioTracks()
    return audioTracks.length > 0 ? new MediaStream(audioTracks) : null
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Speech Recorder - runs automatically when call is active */}
      {callState === 'active' && transcriptionEnabled && (
        <SpeechRecorder
          audioStream={getLocalAudioStream()}
          remoteAudioStream={getRemoteAudioStream()}
          onTranscript={handleTranscript}
          isActive={callState === 'active' && transcriptionEnabled}
          socket={socket}
          matchId={matchId}
        />
      )}
      
      <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="neo-border-sm bg-background p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="neo-border-sm w-12 h-12 neo-blue-bg rounded-full flex items-center justify-center text-white font-bold">
              {matchedUser.hoTen?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="font-bold text-lg">{matchedUser.hoTen || 'Người dùng khác'}</h2>
              <p className="text-sm text-muted-foreground">
                {callState === 'active' ? 'Đang gọi' : 'Đang hoạt động'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {callState === 'idle' && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={startVoiceCall}
                  className="neo-border-sm"
                  title="Voice Call"
                >
                  <Phone className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={startVideoCall}
                  className="neo-border-sm"
                  title="Video Call"
                >
                  <Video className="h-5 w-5" />
                </Button>
              </>
            )}
            {(callState === 'active' || callState === 'calling') && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  className="neo-border-sm"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                {callType === 'video' && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleVideo}
                    className="neo-border-sm"
                    title={isVideoOff ? "Turn on video" : "Turn off video"}
                  >
                    {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </Button>
                )}
                {callState === 'active' && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTranscriptionEnabled(!transcriptionEnabled)}
                    className="neo-border-sm"
                    title={transcriptionEnabled ? "Tắt transcription (môi trường ồn)" : "Bật transcription"}
                  >
                    {transcriptionEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </Button>
                )}
                {(callState === 'active' || summaries.length > 0) && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="neo-border-sm"
                    title={showTranscript ? "Ẩn transcript" : "Hiện transcript"}
                  >
                    <FileText className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={endCall}
                  className="neo-border-sm"
                  title="End Call"
                >
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="neo-border-sm"
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>

      {/* Incoming Call Modal */}
      {incomingCall && callState === 'ringing' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="neo-border-sm bg-background p-8">
            <CardContent className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto neo-border-sm neo-blue-bg rounded-full flex items-center justify-center">
                {incomingCall.callType === 'video' ? (
                  <Video className="h-16 w-16 text-white" />
                ) : (
                  <Phone className="h-16 w-16 text-white" />
                )}
              </div>
              <h3 className="text-xl font-bold">
                {incomingCall.callType === 'video' ? 'Cuộc gọi video' : 'Cuộc gọi thoại'}
              </h3>
              <p className="text-muted-foreground">{incomingCall.from?.hoTen || 'Người dùng khác'}</p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={rejectCall}
                  className="neo-border-sm"
                >
                  <X className="h-5 w-5 mr-2" />
                  Từ chối
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  onClick={acceptCall}
                  className="neo-border-sm neo-blue-bg text-white"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Chấp nhận
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Video Call View */}
      {callState === 'active' && callType === 'video' && (
        <div className="flex-1 grid gap-4 p-4 bg-black grid-cols-2">
          <div className="relative rounded-lg overflow-hidden neo-border-sm">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded text-white text-sm font-bold">
              Bạn
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden neo-border-sm bg-gray-800">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded text-white text-sm font-bold">
              {matchedUser.hoTen || 'Người dùng khác'}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      {callState !== 'active' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isMounted && messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg neo-border-sm ${
                  message.sender === 'me'
                    ? 'neo-blue-bg text-white'
                    : 'bg-background'
                }`}
              >
                <p className="text-sm font-bold">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'
                }`}>
                  {isMounted && message.timestamp.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Voice Call Indicator */}
      {callState === 'active' && callType === 'voice' && (
        <div className="flex-1 flex items-center justify-center">
          <Card className="neo-border-sm bg-background p-8">
            <CardContent className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto neo-border-sm neo-blue-bg rounded-full flex items-center justify-center">
                <Phone className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-xl font-bold">Đang gọi...</h3>
              <p className="text-muted-foreground">{matchedUser.hoTen || 'Người dùng khác'}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calling Indicator */}
      {callState === 'calling' && (
        <div className="flex-1 flex items-center justify-center">
          <Card className="neo-border-sm bg-background p-8">
            <CardContent className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto neo-border-sm neo-blue-bg rounded-full flex items-center justify-center animate-pulse">
                {callType === 'video' ? (
                  <Video className="h-16 w-16 text-white" />
                ) : (
                  <Phone className="h-16 w-16 text-white" />
                )}
              </div>
              <h3 className="text-xl font-bold">Đang gọi...</h3>
              <p className="text-muted-foreground">{matchedUser.hoTen || 'Người dùng khác'}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Message Input */}
      {callState !== 'active' && (
        <div className="neo-border-sm bg-background p-4">
          <form onSubmit={handleSendMessage} className="container mx-auto flex gap-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1"
            />
            <Button
              type="submit"
              variant="default"
              className="neo-border-sm"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      )}
      </div>
      
      {/* Summary Panel - Right side - Auto show when call is active */}
      {(callState === 'active' || showTranscript || summaries.length > 0) && (
        <div className="w-80 border-l neo-border-sm">
          <SummaryPanel summaries={summaries} />
        </div>
      )}
    </div>
  )
}
