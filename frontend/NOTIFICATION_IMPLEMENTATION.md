# Notification System Implementation

## Overview

This document describes the complete notification system implementation that integrates with the backend notification APIs.

## Architecture Summary

### Current Implementation Analysis

**Before Integration:**
- Notifications were dummy/mock data in `navbar.jsx` and `Header.tsx`
- Used local state (`useState`) for notification management
- No API integration
- No real-time updates
- No mark-as-read functionality
- Badge count was based on chat messages, not actual notifications

**After Integration:**
- Full backend API integration
- Global Zustand store for state management
- Real-time notification support (ready for WebSocket integration)
- Mark-as-read with optimistic UI updates
- Toast notifications for new incoming notifications
- Auto-fetch on app load
- Proper unread count badge (shows "9+" for counts > 9)

## File Structure

```
src/
├── services/
│   └── notificationService.js          # API service functions
├── zustandStore/
│   └── notificationStore.js            # Global notification state
├── hooks/
│   └── useNotificationListener.js      # Auto-fetch and toast hook
├── components/
│   ├── navbar/
│   │   └── navbar.jsx                  # Updated with notification store
│   └── admin/
│       └── Header.tsx                  # Updated with notification store
├── config/
│   └── axiosConfig.js                  # Updated to inject auth token
└── App.jsx                              # Added notification listener
```

## API Integration

### Endpoints Used

1. **Get Notifications**
   - `GET https://chtv2-bn.onrender.com/api/v1/notification?page=1&limit=20`
   - Returns paginated list of notifications

2. **Get Unread Count**
   - `GET https://chtv2-bn.onrender.com/api/v1/notification/unread-count`
   - Returns number of unread notifications

3. **Mark as Read**
   - `PATCH https://chtv2-bn.onrender.com/api/v1/notification/:id/read`
   - Marks a specific notification as read

### API Service (`notificationService.js`)

- `getNotifications(page, limit)` - Fetches paginated notifications
- `getUnreadCount()` - Fetches unread count
- `markNotificationAsRead(id)` - Marks notification as read
- `markAllAsRead()` - Marks all notifications as read (optional)

All functions handle different API response structures gracefully.

## Zustand Store (`notificationStore.js`)

### State
- `notifications: []` - Array of notification objects
- `unreadCount: 0` - Number of unread notifications
- `loading: false` - Loading state
- `error: null` - Error state
- `lastFetched: null` - Timestamp of last fetch

### Actions
- `fetchNotifications(page, limit)` - Fetch notifications from API
- `fetchUnreadCount()` - Fetch unread count from API
- `markAsRead(id)` - Mark notification as read (optimistic update)
- `addIncomingNotification(notif)` - Add new notification (for real-time)
- `refresh()` - Refresh both notifications and count
- `clear()` - Clear all notifications (on logout)

## Features Implemented

### 1. Notification Badge
- Shows unread count on bell icon
- Rules:
  - `unreadCount = 0` → No badge
  - `1-9` → Shows the number
  - `> 9` → Shows "9+"
- Updates live when notifications are marked as read

### 2. Notification Modal/Dropdown
- **Max height:** 360px (scrollable)
- **Smooth scrolling** with custom scrollbar styling
- **Unread notifications:**
  - Highlighted background (blue tint)
  - Left border accent
  - Bold text
  - Blue dot indicator
- **Read notifications:**
  - Normal background
  - Hover effects
- **Click behavior:**
  - Marks as read (if unread)
  - Navigates to link (if provided)
  - Closes dropdown

### 3. Auto-Fetch on App Load
- Fetches notifications and unread count when:
  - App loads (if user is logged in)
  - User logs in
- Polls unread count every 30 seconds (background refresh)

### 4. Toast Notifications
- Shows toast alert for new incoming notifications
- Uses Chakra UI's `useToast` hook
- Position: top-right
- Duration: 5 seconds
- Closable

### 5. Mark-as-Read Logic
- **Optimistic UI Update:**
  - Immediately updates UI when notification is clicked
  - Then calls API
  - Reverts on error
- **State Updates:**
  - Removes highlight from notification
  - Decreases unread count
  - Updates notification `read` status

### 6. UI/UX Improvements
- **Hover states:** Smooth transitions on notification items
- **Animations:** Framer Motion for entrance/exit animations
- **Typography:** Proper font weights and sizes
- **Spacing:** Clean padding and margins
- **Colors:** Brand colors (#F7941D, #2B2F92) for accents
- **Responsive:** Works on all screen sizes

## Usage

### In Components

```javascript
import useNotificationStore from "../zustandStore/notificationStore";

const MyComponent = () => {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
  } = useNotificationStore();

  // Use notifications...
};
```

### Auto-Fetch Hook

The `useNotificationListener` hook is automatically called in `App.jsx`:
- Fetches notifications on app load
- Shows toast for new notifications
- Polls unread count every 30 seconds

## Notification Object Structure

```typescript
interface Notification {
  _id: string;              // or 'id'
  title: string;
  message: string;          // or 'content'
  type: string;             // 'system', 'message', 'consultation', etc.
  read: boolean;
  createdAt: string;        // ISO date string
  link?: string;           // Optional redirect URL
}
```

## Error Handling

- API errors are caught and logged
- UI gracefully handles missing data
- Unread count defaults to 0 on error
- Notifications array defaults to empty array on error

## Future Enhancements

1. **WebSocket Integration:** Real-time notifications via Socket.IO
2. **Notification Categories:** Filter by type (system, message, etc.)
3. **Mark All as Read:** Bulk action button
4. **Notification Settings:** User preferences for notification types
5. **Sound Alerts:** Optional sound for new notifications
6. **Desktop Notifications:** Browser notification API integration

## Testing Checklist

- [ ] Notifications load on app start (when logged in)
- [ ] Badge shows correct unread count
- [ ] Badge shows "9+" for counts > 9
- [ ] Clicking notification marks it as read
- [ ] Unread count decreases after marking as read
- [ ] Toast appears for new notifications
- [ ] Modal is scrollable
- [ ] Unread notifications are highlighted
- [ ] Navigation works when link is provided
- [ ] Auto-refresh works (30-second polling)

## Notes

- The notification system is fully integrated with the backend APIs
- All API calls automatically include the Authorization token (via axios interceptor)
- The system handles different API response structures gracefully
- Optimistic UI updates provide instant feedback
- The implementation is ready for real-time WebSocket integration

