import { useCallback, useEffect, useRef, useState } from "react";
import { LogsViewerResponseDTO } from "../../context/RightSidePanelContext";

interface UseLogsScrollReturn {
  panelContentRef: React.RefObject<HTMLDivElement>;
  showScrollToBottom: boolean;
  handleScroll: () => void;
  scrollToBottom: () => void;
}

export const useLogsScroll = (logs: LogsViewerResponseDTO[]): UseLogsScrollReturn => {
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const panelContentRef = useRef<HTMLDivElement>(null);

  const checkIfAtBottom = useCallback(() => {
    if (!panelContentRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = panelContentRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
    
    setShowScrollToBottom(!isAtBottom);
  }, []);

  const handleScroll = useCallback(() => {
    checkIfAtBottom();
  }, [checkIfAtBottom]);

  const scrollToBottom = useCallback(() => {
    if (panelContentRef.current) {
      panelContentRef.current.scrollTo({
        top: panelContentRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, []);

  useEffect(() => {
    if (panelContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = panelContentRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      
      if (isAtBottom) {
        panelContentRef.current.scrollTop = panelContentRef.current.scrollHeight;
      }
      checkIfAtBottom();
    }
  }, [logs, checkIfAtBottom]);

  return {
    panelContentRef,
    showScrollToBottom,
    handleScroll,
    scrollToBottom
  };
};
