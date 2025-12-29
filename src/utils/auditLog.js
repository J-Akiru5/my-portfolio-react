/**
 * Audit Log Utility
 * 
 * Logs all admin actions to Firestore for tracking and accountability.
 * Actions include: bookings, calendar events, projects, services changes.
 */

import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

/**
 * Log an admin action to Firestore
 * 
 * @param {Object} params - Log parameters
 * @param {string} params.action - Action type (e.g., 'booking.created', 'calendar.updated')
 * @param {string} params.entityType - Entity being modified (booking, calendar, project, service)
 * @param {string} params.entityId - ID of the entity
 * @param {string} [params.refId] - Human-readable reference ID (first 8 chars)
 * @param {string} [params.details] - Additional details or description
 * @param {Object} [params.before] - State before change
 * @param {Object} [params.after] - State after change
 * @param {string} [params.userName] - Name of user performing action
 */
export async function logAction({
  action,
  entityType,
  entityId,
  refId = null,
  details = '',
  before = null,
  after = null,
  userName = 'Admin'
}) {
  try {
    const logsRef = collection(db, 'audit_logs')
    
    await addDoc(logsRef, {
      action,
      entityType,
      entityId,
      refId: refId || (entityId ? entityId.slice(0, 8).toUpperCase() : null),
      details,
      before,
      after,
      userName,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    })
    
    console.log(`[AUDIT] ${action} on ${entityType}:${entityId}`)
  } catch (error) {
    console.error('[AUDIT] Failed to log action:', error)
    // Don't throw - logging failure shouldn't break the main action
  }
}

/**
 * Action type constants for consistency
 */
export const AUDIT_ACTIONS = {
  // Bookings
  BOOKING_CREATED: 'booking.created',
  BOOKING_STATUS_CHANGED: 'booking.status_changed',
  BOOKING_PAYMENT_CHANGED: 'booking.payment_changed',
  BOOKING_DELETED: 'booking.deleted',
  
  // Calendar
  CALENDAR_EVENT_CREATED: 'calendar.event_created',
  CALENDAR_EVENT_UPDATED: 'calendar.event_updated',
  CALENDAR_EVENT_DELETED: 'calendar.event_deleted',
  
  // Projects
  PROJECT_CREATED: 'project.created',
  PROJECT_UPDATED: 'project.updated',
  PROJECT_DELETED: 'project.deleted',
  
  // Services
  SERVICE_CREATED: 'service.created',
  SERVICE_UPDATED: 'service.updated',
  SERVICE_DELETED: 'service.deleted',
  
  // Admin
  ADMIN_LOGIN: 'admin.login',
  ADMIN_LOGOUT: 'admin.logout',
  SETTINGS_UPDATED: 'settings.updated'
}
