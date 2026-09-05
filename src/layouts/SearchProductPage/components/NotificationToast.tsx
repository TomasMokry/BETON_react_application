import { useEffect } from "react";

interface NotificationToastProps {
  show: boolean;
  type: "success" | "error";
  title?: string;
  message: React.ReactNode;
  onClose: () => void;
}

export const NotificationToast = ({
  show,
  type,
  title,
  message,
  onClose,
}: NotificationToastProps) => {
  useEffect(() => {
    if (!show) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  const isSuccess = type === "success";

  return (
    <div
      className="toast show position-fixed bottom-0 end-0 m-3"
      role="alert"
      style={{ zIndex: 1050 }}
    >
      <div className="toast-header">
        <strong
          className={`me-auto fs-5 ${
            isSuccess ? "text-success" : "text-danger"
          }`}
        >
          {title || (isSuccess ? "Success" : "Error")}
        </strong>

        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <div className="toast-body fs-6">{message}</div>
    </div>
  );
};
