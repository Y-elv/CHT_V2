// utils/formatters.ts
export const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    normal: "gray",
    high: "orange",
    urgent: "red",
  };
  return colors[priority] || "gray";
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    scheduled: "blue",
    "in-progress": "green",
    completed: "gray",
    cancelled: "red",
  };
  return colors[status] || "gray";
};

export const getAvailabilityColor = (availability: string): string => {
  const colors: Record<string, string> = {
    available: "green",
    busy: "orange",
    offline: "gray",
  };
  return colors[availability] || "gray";
};
