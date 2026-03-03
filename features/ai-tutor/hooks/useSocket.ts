import { useCallback, useEffect, useRef, useState } from "react";

import { Socket, io } from "socket.io-client";

import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/shared/config/api";

interface UseSocketOptions {
  autoConnect?: boolean;
}

export function useSocket(options: UseSocketOptions = {}) {
  const { autoConnect = true } = options;
  const { session } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (!autoConnect || !session) return;

    const socket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token: session.access_token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on("connected", () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (error: Error) => {
      setConnectionError(error.message);
      setIsConnected(false);
    });

    socket.on("error", (data: { message: string }) => {
      setConnectionError(data.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [autoConnect, session]);

  const emit = useCallback(<T>(event: string, data: T) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback(<T>(event: string, callback: (data: T) => void) => {
    socketRef.current?.on(event, callback as (...args: unknown[]) => void);
    return () => {
      socketRef.current?.off(event, callback as (...args: unknown[]) => void);
    };
  }, []);

  const off = useCallback((event: string, callback?: (...args: unknown[]) => void) => {
    if (callback) {
      socketRef.current?.off(event, callback);
    } else {
      socketRef.current?.off(event);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    emit,
    on,
    off,
  };
}
