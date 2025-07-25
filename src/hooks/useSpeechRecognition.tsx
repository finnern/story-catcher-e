import { useState, useRef, useCallback } from 'react';
import { pipeline } from '@huggingface/transformers';
import { useToast } from '@/hooks/use-toast';

interface UseSpeechRecognitionReturn {
  isRecording: boolean;
  isLoading: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  transcript: string;
  error: string | null;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const transcriberRef = useRef<any>(null);
  const { toast } = useToast();

  const initializeTranscriber = useCallback(async () => {
    if (transcriberRef.current) return transcriberRef.current;
    
    try {
      setIsLoading(true);
      toast({
        title: "Loading AI Model",
        description: "Initializing speech recognition model..."
      });
      
      // Initialize Whisper model
      transcriberRef.current = await pipeline(
        "automatic-speech-recognition",
        "onnx-community/whisper-tiny.en",
        { device: "webgpu" } // Use WebGPU if available, fallback to CPU
      );
      
      toast({
        title: "Model Ready",
        description: "Speech recognition is ready to use!"
      });
      
      return transcriberRef.current;
    } catch (err) {
      console.error('Error initializing transcriber:', err);
      // Fallback to CPU if WebGPU fails
      try {
        transcriberRef.current = await pipeline(
          "automatic-speech-recognition",
          "onnx-community/whisper-tiny.en"
        );
        return transcriberRef.current;
      } catch (fallbackErr) {
        setError('Failed to initialize speech recognition');
        toast({
          title: "Model Loading Failed",
          description: "Could not load speech recognition model",
          variant: "destructive"
        });
        throw fallbackErr;
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000, // Optimal for Whisper
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Initialize transcriber
      await initializeTranscriber();

      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        try {
          setIsLoading(true);
          toast({
            title: "Processing Speech",
            description: "Converting your speech to text..."
          });

          // Convert to the format Whisper expects
          const audioUrl = URL.createObjectURL(audioBlob);
          const result = await transcriberRef.current(audioUrl);
          
          setTranscript(result.text);
          toast({
            title: "Transcription Complete",
            description: "Your speech has been converted to text!"
          });

          // Clean up
          URL.revokeObjectURL(audioUrl);
        } catch (err) {
          console.error('Transcription error:', err);
          setError('Failed to transcribe audio');
          toast({
            title: "Transcription Failed",
            description: "Could not convert speech to text",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone"
      });

    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording');
      toast({
        title: "Recording Failed",
        description: "Could not access microphone",
        variant: "destructive"
      });
    }
  }, [initializeTranscriber, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording Stopped",
        description: "Processing your speech..."
      });
    }
  }, [isRecording, toast]);

  return {
    isRecording,
    isLoading,
    startRecording,
    stopRecording,
    transcript,
    error
  };
}