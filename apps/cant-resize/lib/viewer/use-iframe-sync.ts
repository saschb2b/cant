"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SyncMessageData {
  type?: string;
  sourceId?: string;
  scrollY?: number;
  mouseX?: number;
  mouseY?: number;
  selector?: string;
  url?: string;
  sameOrigin?: boolean;
}

interface UseIframeSyncOptions {
  viewportId: string;
  url: string;
  scrollPosition: number;
  broadcastScroll: (position: number, sourceId: string) => void;
  broadcastMouse: (x: number, y: number, sourceId: string) => void;
  broadcastClick: (
    x: number,
    y: number,
    selector: string,
    sourceId: string,
  ) => void;
  broadcastHover: (selector: string, sourceId: string) => void;
  broadcastNavigation: (url: string, sourceId: string) => void;
}

function createSyncedIframeHtml(url: string, viewportId: string): string {
  return `<!DOCTYPE html>
<html style="height:100%;margin:0;padding:0;">
<head>
  <style>
    * { margin: 0; padding: 0; }
    html, body { height: 100%; overflow: hidden; }
    iframe { width: 100%; height: 100%; border: none; }
    .sync-cursor {
      position: fixed;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(59, 130, 246, 0.6);
      border: 2px solid rgba(59, 130, 246, 0.9);
      pointer-events: none;
      z-index: 999999;
      transform: translate(-50%, -50%);
      transition: opacity 0.15s;
      display: none;
    }
    .sync-hover {
      outline: 2px dashed rgba(59, 130, 246, 0.7) !important;
      outline-offset: 2px !important;
    }
  </style>
</head>
<body>
  <div id="sync-cursor" class="sync-cursor"></div>
  <iframe id="inner" src="${url}" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
  <script>
    (function() {
      const viewportId = '${viewportId}';
      const inner = document.getElementById('inner');
      const syncCursor = document.getElementById('sync-cursor');
      let lastScrollY = 0;
      let isReceiving = false;
      let innerWindow = null;
      let innerDoc = null;
      let isSameOrigin = false;
      let lastHovered = null;
      let cursorHideTimeout = null;

      function getUniqueSelector(el) {
        if (!el || el === innerDoc.body) return 'body';
        if (el.id) return '#' + el.id;
        let path = [];
        while (el && el.nodeType === 1 && el !== innerDoc.body) {
          let selector = el.tagName.toLowerCase();
          if (el.className && typeof el.className === 'string') {
            selector += '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.');
          }
          const siblings = el.parentNode ? Array.from(el.parentNode.children).filter(c => c.tagName === el.tagName) : [];
          if (siblings.length > 1) {
            selector += ':nth-of-type(' + (siblings.indexOf(el) + 1) + ')';
          }
          path.unshift(selector);
          el = el.parentNode;
        }
        return path.join(' > ');
      }

      function findElement(selector) {
        try { return innerDoc.querySelector(selector); } catch { return null; }
      }

      inner.addEventListener('load', function() {
        try {
          innerWindow = inner.contentWindow;
          innerDoc = inner.contentDocument || inner.contentWindow.document;
          isSameOrigin = true;

          innerWindow.addEventListener('scroll', function() {
            if (isReceiving) return;
            const maxScroll = Math.max(1, innerDoc.documentElement.scrollHeight - innerWindow.innerHeight);
            const scrollY = innerWindow.scrollY / maxScroll;
            if (Math.abs(scrollY - lastScrollY) > 0.001) {
              lastScrollY = scrollY;
              window.parent.postMessage({ type: 'SCROLL', scrollY, sourceId: viewportId }, '*');
            }
          }, { passive: true });

          innerDoc.addEventListener('mousemove', function(e) {
            if (isReceiving) return;
            const x = e.clientX / innerWindow.innerWidth;
            const y = e.clientY / innerWindow.innerHeight;
            window.parent.postMessage({ type: 'MOUSE_MOVE', mouseX: x, mouseY: y, sourceId: viewportId }, '*');
          }, { passive: true });

          innerDoc.addEventListener('click', function(e) {
            if (isReceiving) return;
            const x = e.clientX / innerWindow.innerWidth;
            const y = e.clientY / innerWindow.innerHeight;
            const selector = getUniqueSelector(e.target);
            window.parent.postMessage({ type: 'CLICK', mouseX: x, mouseY: y, selector, sourceId: viewportId }, '*');
          }, { passive: true });

          innerDoc.addEventListener('mouseover', function(e) {
            if (isReceiving) return;
            const selector = getUniqueSelector(e.target);
            window.parent.postMessage({ type: 'HOVER', selector, sourceId: viewportId }, '*');
          }, { passive: true });

          let lastUrl = innerWindow.location.href;
          const checkNav = setInterval(function() {
            try {
              const currentUrl = innerWindow.location.href;
              if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                window.parent.postMessage({ type: 'NAVIGATE', url: currentUrl, sourceId: viewportId }, '*');
              }
            } catch (e) {}
          }, 500);

          window.addEventListener('unload', function() { clearInterval(checkNav); });

          window.parent.postMessage({ type: 'VIEWPORT_READY', sourceId: viewportId, sameOrigin: true }, '*');
        } catch (e) {
          window.parent.postMessage({ type: 'VIEWPORT_READY', sourceId: viewportId, sameOrigin: false }, '*');
        }
      });

      window.addEventListener('message', function(e) {
        if (!e.data?.type || !isSameOrigin) return;
        isReceiving = true;

        if (e.data.type === 'SCROLL_TO' && typeof e.data.scrollY === 'number') {
          const maxScroll = Math.max(1, innerDoc.documentElement.scrollHeight - innerWindow.innerHeight);
          innerWindow.scrollTo({ top: e.data.scrollY * maxScroll, behavior: 'instant' });
          lastScrollY = e.data.scrollY;
        }

        if (e.data.type === 'MOUSE_MOVE' && typeof e.data.mouseX === 'number') {
          syncCursor.style.display = 'block';
          syncCursor.style.left = (e.data.mouseX * innerWindow.innerWidth) + 'px';
          syncCursor.style.top = (e.data.mouseY * innerWindow.innerHeight) + 'px';
          clearTimeout(cursorHideTimeout);
          cursorHideTimeout = setTimeout(() => { syncCursor.style.display = 'none'; }, 2000);
        }

        if (e.data.type === 'CLICK' && e.data.selector) {
          const el = findElement(e.data.selector);
          if (el) {
            el.click();
            el.style.transition = 'box-shadow 0.15s';
            el.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
            setTimeout(() => { el.style.boxShadow = ''; }, 300);
          }
        }

        if (e.data.type === 'HOVER' && e.data.selector) {
          if (lastHovered) lastHovered.classList.remove('sync-hover');
          const el = findElement(e.data.selector);
          if (el) {
            el.classList.add('sync-hover');
            lastHovered = el;
          }
        }

        if (e.data.type === 'NAVIGATE' && e.data.url) {
          inner.src = e.data.url;
        }

        setTimeout(() => { isReceiving = false; }, 50);
      });
    })();
  </script>
</body>
</html>`;
}

export function useIframeSync(options: UseIframeSyncOptions) {
  const {
    viewportId,
    url,
    scrollPosition,
    broadcastScroll,
    broadcastMouse,
    broadcastClick,
    broadcastHover,
    broadcastNavigation,
  } = options;

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSyncEnabled, setIsSyncEnabled] = useState<boolean | null>(null);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  // Listen for sync messages from iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent<unknown>) => {
      const data = e.data as SyncMessageData | null;
      if (!data || typeof data !== "object" || typeof data.type !== "string")
        return;
      if (data.sourceId !== viewportId) return;

      switch (data.type) {
        case "SCROLL":
          if (data.scrollY != null) broadcastScroll(data.scrollY, viewportId);
          break;
        case "MOUSE_MOVE":
          if (data.mouseX != null && data.mouseY != null)
            broadcastMouse(data.mouseX, data.mouseY, viewportId);
          break;
        case "CLICK":
          if (
            data.mouseX != null &&
            data.mouseY != null &&
            data.selector != null
          )
            broadcastClick(data.mouseX, data.mouseY, data.selector, viewportId);
          break;
        case "HOVER":
          if (data.selector != null) broadcastHover(data.selector, viewportId);
          break;
        case "NAVIGATE":
          if (data.url != null) broadcastNavigation(data.url, viewportId);
          break;
        case "VIEWPORT_READY":
          setIsSyncEnabled(data.sameOrigin ?? false);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [
    viewportId,
    broadcastScroll,
    broadcastMouse,
    broadcastClick,
    broadcastHover,
    broadcastNavigation,
  ]);

  // Forward scroll position to iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    iframe.contentWindow.postMessage(
      { type: "SCROLL_TO", scrollY: scrollPosition },
      "*",
    );
  }, [scrollPosition]);

  const srcDoc = createSyncedIframeHtml(url, viewportId);

  return {
    iframeRef,
    isLoading,
    hasError,
    isSyncEnabled,
    handleIframeLoad,
    handleIframeError,
    srcDoc,
  };
}
