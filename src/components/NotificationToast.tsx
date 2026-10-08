import type { AppNotification } from "../types";

interface NotificationToastProps {
  notification: AppNotification | null;
  waitingCount: number;
  onDismiss: () => void;
}

function NotificationToast({ notification, waitingCount, onDismiss }: NotificationToastProps) {
  if (!notification) return null;

  return (
    <div className={`notification-toast ${notification.tone}`}>
      <span>{notification.message}</span>
      {waitingCount > 0 && <span className="notification-more">+{waitingCount} more</span>}
      <button type="button" className="notification-dismiss" onClick={onDismiss} aria-label="Dismiss">
        &times;
      </button>
    </div>
  );
}

export default NotificationToast;
