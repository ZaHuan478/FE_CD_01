import { adminAccessApi } from '../../../shared/api/admin-access.api'
export type { AdminUser, AuditResult, PermissionProfile, SopResource, SopRoleAssignment, SopRoleCode, SystemSettings, SystemRole } from '../../../shared/api/admin-access.api'

export const administrationGateway = {
  audit: adminAccessApi.audit,
  settings: adminAccessApi.settings,
  updateSettings: adminAccessApi.updateSettings,
  profiles: adminAccessApi.profiles,
  createProfile: adminAccessApi.createProfile,
  updateProfile: adminAccessApi.updateProfile,
  userProfiles: adminAccessApi.userProfiles,
  replaceUserProfiles: adminAccessApi.replaceUserProfiles,
  sopResources: adminAccessApi.sopResources,
  sopRoles: adminAccessApi.sopRoles,
  replaceSopRoles: adminAccessApi.replaceSopRoles,
  bootstrapSuperAdmin: adminAccessApi.bootstrapSuperAdmin
}
