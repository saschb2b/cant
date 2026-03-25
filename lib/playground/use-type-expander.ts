"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExpandedType, ExpandResponse } from "./types";

interface TypeExpanderState {
  types: ExpandedType[];
  error: string | null;
  isLoading: boolean;
  isReady: boolean;
}

export function useTypeExpander() {
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [state, setState] = useState<TypeExpanderState>({
    types: [],
    error: null,
    isLoading: false,
    isReady: false,
  });

  useEffect(() => {
    const worker = new Worker("/workers/type-expander.js");
    workerRef.current = worker;

    function handleMessage(e: MessageEvent) {
      const msg = e.data as ExpandResponse | { kind: "ready"; ok: boolean };

      if (msg.kind === "ready") {
        setState((prev) => ({ ...prev, isReady: msg.ok }));
        return;
      }

      // kind === "result"
      if (msg.requestId < requestIdRef.current) return;
      setState({
        types: msg.types,
        error: msg.error ?? null,
        isLoading: false,
        isReady: true,
      });
    }

    function handleError(e: ErrorEvent) {
      setState((prev) => ({
        ...prev,
        error: e.message || "Worker error",
        isLoading: false,
      }));
    }

    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", handleError);

    // Ping the worker to check if it's ready (importScripts is synchronous,
    // so by the time the worker processes our ping, it has already loaded).
    worker.postMessage({ kind: "ping" });

    return () => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const expand = useCallback((code: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    setState((prev) => ({ ...prev, isLoading: true }));

    debounceRef.current = setTimeout(() => {
      const id = ++requestIdRef.current;
      workerRef.current?.postMessage({
        kind: "expand",
        code,
        requestId: id,
      });
    }, 300);
  }, []);

  return { ...state, expand };
}
