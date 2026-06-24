import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

interface Notification {
  notif_id: number;
  concerned_employee_id: number;
  recipient_type: string;
  notif_type: string;
  title: string;
  notif_content: string;
  notif_status: string;
  created_at: string;
}

const API_BASE_URL = "http://127.0.0.1:8000/notifications";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Example:
  // localStorage.setItem("role", "ADMIN")
  // localStorage.setItem("employee_id", "1")
  // localStorage.setItem("candidate_id", "5")

  const role = localStorage.getItem("role");
  const employeeId = localStorage.getItem("employee_id");
  const candidateId = localStorage.getItem("candidate_id");

  const getNotificationsUrl = () => {
    if (role === "ADMIN") {
      return `${API_BASE_URL}/admin`;
    }

    if (role === "EMPLOYEE" && employeeId) {
      return `${API_BASE_URL}/employee/${employeeId}`;
    }

    if (role === "CANDIDATE" && candidateId) {
      return `${API_BASE_URL}/candidate/${candidateId}`;
    }

    return `${API_BASE_URL}/`;
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(getNotificationsUrl());

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();

      setNotifications(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notifId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${notifId}/read`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notif_id === notifId
            ? { ...notif, notif_status: "Read" }
            : notif
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(
    (notif) => notif.notif_status === "Unread"
  ).length;

  return (
    <div style={{ position: "relative" }}>
      <button
  onClick={() => setOpen(!open)}
  style={{
    position: "relative",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "8px",
  }}
>
  <Bell size={22} />

  {unreadCount > 0 && (
    <span
      style={{
        position: "absolute",
        top: "-4px",
        right: "-4px",
        background: "#ef4444",
        color: "white",
        borderRadius: "50%",
        width: "18px",
        height: "18px",
        fontSize: "11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {unreadCount}
    </span>
  )}
</button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 45,
            width: 380,
            maxHeight: 500,
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              padding: 16,
              borderBottom: "1px solid #eee",
              fontWeight: "bold",
            }}
          >
            Notifications
          </div>

          {loading && (
            <div style={{ padding: 16 }}>
              Loading notifications...
            </div>
          )}

          {error && (
            <div
              style={{
                padding: 16,
                color: "red",
              }}
            >
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            notifications.length === 0 && (
              <div style={{ padding: 16 }}>
                No notifications
              </div>
            )}

          {!loading &&
            !error &&
            notifications.map((notif) => (
              <div
                key={notif.notif_id}
                style={{
                  padding: 12,
                  borderBottom: "1px solid #eee",
                  backgroundColor:
                    notif.notif_status === "Unread"
                      ? "#f0f8ff"
                      : "#ffffff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <strong>{notif.title}</strong>

                  {notif.notif_status === "Unread" && (
                    <button
                      onClick={() =>
                        markAsRead(notif.notif_id)
                      }
                      style={{
                        fontSize: "12px",
                        cursor: "pointer",
                        border: "none",
                        background: "transparent",
                        color: "#2563eb",
                      }}
                    >
                      Mark Read
                    </button>
                  )}
                </div>

                <div
                  style={{
                    marginBottom: 6,
                    fontSize: "14px",
                  }}
                >
                  {notif.notif_content}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  {new Date(
                    notif.created_at
                  ).toLocaleString()}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}