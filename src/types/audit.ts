export enum AuditAction {
  GOVERNMENT_ROLE_ADDED = "GOVERNMENT_ROLE_ADDED",
  GOVERNMENT_ROLE_REMOVED = "GOVERNMENT_ROLE_REMOVED",
  GUILD_SETTING_UPDATED = "GUILD_SETTING_UPDATED",
}

export interface AuditEvent {
  id: string;
  action: AuditAction;
  userId: string;
  guildId: string;
  targetId: string | null;
  targetType: string | null;
  metadata: string | null;
  createdAt: string;
}

export interface AuditLogResponse {
  data: AuditEvent[];
}
