
# Kaptrain Mobile App — Notifications
ID: APP-FR-XXX

## Overview
Notifications screen allows users to view, manage, and acknowledge system and coach-related notifications.

## Notification Types
- Daily wellness reminder
- New message from coach
- New training sessions added
- Session reminder
- Post-session feedback reminder
- Ongoing session reminder
- Wellness trend alert (e.g. form decreasing)

## Functional Requirements
- Display notifications in reverse chronological order
- Show unread indicator (dot)
- Show relative timestamps (e.g. 1h, Hier, 28/04)
- Allow marking all notifications as read
- Persist read/unread state per user

## Actions
- Tap notification to navigate to related screen
- "Tout marquer comme lu" marks all as read

## Edge Cases
- Empty state when no notifications
- Offline handling (cached notifications)

## Non-Functional
- Real-time update via push or polling
- Performance optimized for large lists
