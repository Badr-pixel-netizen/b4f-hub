import { useState } from "react";
import type { AppNotification } from "../types";

let nextNotificationId = 1;


export function useNotificationQueue() {
  const [queue, setQueue] = useState<AppNotification[]>([]);

  function notify(message: string, tone: AppNotification["tone"] = "success") {
    const entry: AppNotification = { id: nextNotificationId, message, tone };
    nextNotificationId += 1;
    setQueue((current) => [...current, entry]); 
  }

  function dismissFront() {
    setQueue((current) => current.slice(1)); 
  }

  return {
    frontNotification: queue[0] ?? null,
    waitingCount: Math.max(queue.length - 1, 0),
    notify,
    dismissFront,
  };
}
