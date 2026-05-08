
export const showNotification = (message, type = "info") => {
  const alertClass = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info"
  }[type] || "alert-info";


  let container = document.getElementById("notification-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "notification-container";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.maxWidth = "400px";
    document.body.appendChild(container);
  }
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert ${alertClass} shadow-lg mb-2 animate-pulse`;
  alertDiv.style.animation = "slideIn 0.3s ease-in-out";
  alertDiv.innerHTML = `<span>${message}</span>`;

  container.appendChild(alertDiv);

  if (!document.getElementById("notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    alertDiv.style.animation = "slideOut 0.3s ease-in-out";
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
};

export const toast = {
  success: (msg) => showNotification(msg, "success"),
  error: (msg) => showNotification(msg, "error"),
  warning: (msg) => showNotification(msg, "warning"),
  info: (msg) => showNotification(msg, "info")
};
