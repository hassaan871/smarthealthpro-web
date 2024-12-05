// src/utils/appointmentConfig.js
export const APPOINTMENT_CONFIGS = {
  priority: {
    low: {
      percentage: 20,
      color: "bg-info",
      textColor: "text-info",
    },
    moderate: {
      percentage: 40,
      color: "bg-success",
      textColor: "text-success",
    },
    severe: {
      percentage: 60,
      color: "bg-warning",
      textColor: "text-warning",
    },
    "high severe": {
      percentage: 80,
      color: "bg-danger",
      textColor: "text-danger",
    },
  },
  status: {
    tbd: {
      badgeClass: "badge-secondary",
    },
    pending: {
      badgeClass: "badge-warning",
    },
    visited: {
      badgeClass: "badge-success",
    },
    cancelled: {
      badgeClass: "badge-danger",
    },
  },
};

export const getPriorityConfig = (priority) => {
  const normalizedPriority = priority.toLowerCase();
  return (
    APPOINTMENT_CONFIGS.priority[normalizedPriority] || {
      percentage: 0,
      color: "bg-secondary",
      textColor: "text-secondary",
    }
  );
};

export const getStatusConfig = (status) => {
  const normalizedStatus = status?.toLowerCase() || "tbd";
  console.log(
    "getStatusConfig Input:",
    status,
    "Normalized:",
    normalizedStatus
  );
  console.log("Config:", APPOINTMENT_CONFIGS.status[normalizedStatus]);
  return (
    APPOINTMENT_CONFIGS.status[normalizedStatus] || {
      badgeClass: "badge-secondary",
    }
  );
};
