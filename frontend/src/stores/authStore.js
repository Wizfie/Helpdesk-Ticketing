import { defineStore } from 'pinia';
import { api } from '../services/api';

export const ROLES = ['ADMIN', 'ENGINEER'];

export const DEFAULT_USERS = [
  {
    id: 1,
    role: 'ADMIN',
    roleCode: 'ADMIN',
    name: 'Ahmad Fauzi',
    email: 'admin@glotratech.com',
    phone: '0812-9876-5432',
    isActive: true
  }
];

const STORAGE_KEY_USER_ID = 'gtt_current_user_id';
const STORAGE_KEY_ROLE = 'gtt_current_role';
const STORAGE_KEY_USERS = 'gtt_users_data';

const USER_DATA_VERSION_KEY = 'gtt_user_data_version';
const CURRENT_USER_DATA_VERSION = 'v9.0-no-roles-table';

function getStoredUsers() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_USERS;
  }
  try {
    const ver = localStorage.getItem(USER_DATA_VERSION_KEY);
    if (ver !== CURRENT_USER_DATA_VERSION) {
      localStorage.setItem(USER_DATA_VERSION_KEY, CURRENT_USER_DATA_VERSION);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEFAULT_USERS));
      localStorage.setItem(STORAGE_KEY_USER_ID, '1');
      localStorage.setItem(STORAGE_KEY_ROLE, 'ADMIN');
      return DEFAULT_USERS;
    }
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load users from localStorage:', e);
  }
  return DEFAULT_USERS;
}

function getStoredCurrentUser(users) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return users[0] || null;
  }
  try {
    const storedUserId = localStorage.getItem(STORAGE_KEY_USER_ID);
    if (storedUserId) {
      const matched = users.find(u => u.id === Number(storedUserId));
      if (matched && matched.isActive) return matched;
    }
  } catch (e) {
    console.error('Failed to load current user from localStorage:', e);
  }

  return users[0] || null;
}

function saveCurrentAuthState(user) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER_ID, String(user.id));
      localStorage.setItem(STORAGE_KEY_ROLE, user.roleCode);
    } else {
      localStorage.removeItem(STORAGE_KEY_USER_ID);
      localStorage.removeItem(STORAGE_KEY_ROLE);
    }
  } catch (e) {
    console.error('Failed to save current user to localStorage:', e);
  }
}

function saveUsersState(users) {
  if (typeof window === 'undefined' || !window.localStorage || !users) return;
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to localStorage:', e);
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const users = getStoredUsers();
    return {
      users,
      currentUser: getStoredCurrentUser(users),
      roles: ROLES
    };
  },
  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    isEngineer: (state) => (state.currentUser?.role || state.currentUser?.roleCode) === 'ENGINEER',
    isAdmin: (state) => (state.currentUser?.role || state.currentUser?.roleCode) === 'ADMIN',
    currentUserInitials: (state) => {
      const name = state.currentUser?.name;
      if (!name) return 'U';
      const parts = name.trim().split(/\s+/);
      return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
    }
  },
  actions: {
    async fetchUsersFromApi() {
      try {
        const res = await api.getUsers();
        const list = Array.isArray(res) ? res : (res?.data || null);
        if (list && list.length > 0) {
          this.users = list.map(u => {
            const roleVal = typeof u.role === 'string' ? u.role : (u.role?.code || u.roleCode || 'ENGINEER');
            return {
              ...u,
              role: roleVal,
              roleCode: roleVal
            };
          });
          saveUsersState(this.users);
          if (this.currentUser) {
            const fresh = this.users.find(u => u.id === this.currentUser.id);
            if (fresh) {
              this.currentUser = fresh;
              saveCurrentAuthState(fresh);
            }
          }
        }
      } catch (e) {
        // Backend offline, keep local state
      }
    },
    login(email, password) {
      const trimmedEmail = (email || '').trim().toLowerCase();
      const user = this.users.find(u => u.email.toLowerCase() === trimmedEmail);
      if (!user) {
        return { success: false, message: 'Email staf tidak terdaftar dalam sistem GTT.' };
      }
      if (!user.isActive) {
        return { success: false, message: 'Akun staf berstatus non-aktif. Silakan hubungi Admin CPIG.' };
      }
      // Demo password check (allow 'password123' or matching user password)
      if (password && password !== 'password123' && user.password && user.password !== password) {
        return { success: false, message: 'Kata sandi tidak sesuai. Gunakan kata sandi akun Anda atau password123.' };
      }

      this.currentUser = user;
      saveCurrentAuthState(user);
      return { success: true, user };
    },
    loginAs(user) {
      if (!user) return;
      this.currentUser = user;
      saveCurrentAuthState(user);
    },
    logout() {
      this.currentUser = null;
      saveCurrentAuthState(null);
    },
    switchUser(userId) {
      const user = this.users.find(u => u.id === Number(userId));
      if (user) {
        this.currentUser = user;
        saveCurrentAuthState(user);
      }
    },
    switchRole(roleCode) {
      const user = this.users.find(u => u.roleCode === roleCode);
      if (user) {
        this.currentUser = user;
        saveCurrentAuthState(user);
      }
    },
    async createUser(userData, actorUser, ticketStore) {
      try {
        const roleVal = userData.role || userData.roleCode || 'ENGINEER';
        const payload = {
          name: userData.name,
          email: userData.email,
          role: roleVal,
          roleCode: roleVal,
          phone: userData.phone
        };
        const created = await api.createUser(payload);
        await this.fetchUsersFromApi();

        if (ticketStore && typeof ticketStore.addAuditLog === 'function') {
          ticketStore.addAuditLog({
            action: 'USER_CREATED',
            details: `Staf baru ${payload.name} (${roleVal}) berhasil didaftarkan ke sistem`,
            user: actorUser ? actorUser.name : 'System Admin',
            role: actorUser ? (actorUser.role || actorUser.roleCode) : 'ADMIN',
            ipAddress: '127.0.0.1 (Local)'
          });
        }
        return created;
      } catch (err) {
        console.error('API createUser failed, fallback local:', err);
        const roleVal = userData.role || userData.roleCode || 'ENGINEER';
        const newUser = {
          id: this.users.length + 1,
          role: roleVal,
          roleCode: roleVal,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          isActive: true
        };
        this.users.push(newUser);
        saveUsersState(this.users);
        return newUser;
      }
    },
    async updateUser(userId, updatedData, actorUser, ticketStore) {
      try {
        const roleVal = updatedData.role || updatedData.roleCode;
        const payload = {
          name: updatedData.name,
          email: updatedData.email,
          role: roleVal,
          roleCode: roleVal,
          phone: updatedData.phone,
          isActive: updatedData.isActive
        };
        const updated = await api.updateUser(userId, payload);
        await this.fetchUsersFromApi();

        if (ticketStore && ticketStore.addAuditLog) {
          ticketStore.addAuditLog({
            userName: actorUser?.name || 'System Admin',
            role: actorUser ? (actorUser.role || actorUser.roleCode) : 'ADMIN',
            action: 'USER_UPDATED',
            entityType: 'USER',
            entityId: `USER-00${userId}`,
            description: `Memperbarui profil staf: ${payload.name} (Peran: ${roleVal || 'Staf'}, Status: ${payload.isActive ? 'Aktif' : 'Nonaktif'})`
          });
        }
        return updated;
      } catch (err) {
        console.error('API updateUser failed, fallback local:', err);
        const user = this.users.find(u => u.id === Number(userId));
        if (!user) return null;

        const roleVal = updatedData.role || updatedData.roleCode || user.role || 'ENGINEER';
        user.name = updatedData.name;
        user.email = updatedData.email;
        user.role = roleVal;
        user.roleCode = roleVal;
        user.phone = updatedData.phone;
        if (typeof updatedData.isActive === 'boolean') {
          user.isActive = updatedData.isActive;
        }

        if (this.currentUser?.id === user.id) {
          this.currentUser = { ...user };
          saveCurrentAuthState(this.currentUser);
        }
        saveUsersState(this.users);
        return user;
      }
    },
    async toggleUserStatus(userId, actorUser, ticketStore) {
      const user = this.users.find(u => u.id === Number(userId));
      if (!user) return;

      const newStatus = !user.isActive;
      try {
        await api.updateUser(userId, { isActive: newStatus });
        await this.fetchUsersFromApi();
      } catch (err) {
        user.isActive = newStatus;
        saveUsersState(this.users);
      }

      if (ticketStore && ticketStore.addAuditLog) {
        ticketStore.addAuditLog({
          userName: actorUser ? actorUser.name : 'System Admin',
          role: actorUser ? actorUser.roleCode : 'ADMIN',
          action: 'USER_STATUS_TOGGLED',
          entityType: 'USER',
          entityId: `USER-00${user.id}`,
          description: `Mengubah status keaktifan staf ${user.name} menjadi ${newStatus ? 'Aktif' : 'Nonaktif'}`
        });
      }
    },

    changePassword(userId, oldPassword, newPassword, ticketStore) {
      const user = this.users.find(u => u.id === Number(userId));
      if (!user) {
        return { success: false, message: 'Pengguna tidak ditemukan.' };
      }

      // Check existing password if present (default fallback is password123)
      const currentStoredPass = user.password || 'password123';
      if (oldPassword !== currentStoredPass) {
        return { success: false, message: 'Kata sandi saat ini yang Anda masukkan salah.' };
      }

      if (!newPassword || newPassword.length < 6) {
        return { success: false, message: 'Kata sandi baru minimal harus 6 karakter.' };
      }

      if (newPassword === oldPassword) {
        return { success: false, message: 'Kata sandi baru tidak boleh sama dengan kata sandi lama.' };
      }

      user.password = newPassword;

      if (this.currentUser && this.currentUser.id === user.id) {
        this.currentUser.password = newPassword;
        saveCurrentAuthState(this.currentUser);
      }

      saveUsersState(this.users);

      if (ticketStore && ticketStore.addAuditLog) {
        ticketStore.addAuditLog({
          userName: user.name,
          role: user.roleCode,
          action: 'USER_PASSWORD_CHANGED',
          entityType: 'USER',
          entityId: `USER-00${user.id}`,
          description: `Pengguna ${user.name} (${user.roleCode}) berhasil memperbarui kata sandi akun secara mandiri.`
        });
      }

      return { success: true, message: 'Kata sandi akun Anda berhasil diperbarui.' };
    },

    async updateProfile(userId, profileData, ticketStore) {
      const user = this.users.find(u => u.id === Number(userId));
      if (!user) {
        return { success: false, message: 'Pengguna tidak ditemukan.' };
      }

      const payload = {};
      if (profileData.name) {
        user.name = profileData.name.trim();
        payload.name = user.name;
      }

      if (profileData.phone !== undefined) {
        user.phone = (profileData.phone || '').trim();
        payload.phone = user.phone;
      }

      try {
        await api.updateUser(userId, payload);
        await this.fetchUsersFromApi();
      } catch (err) {
        console.error('API updateProfile failed, fallback local:', err);
      }

      if (this.currentUser && this.currentUser.id === user.id) {
        this.currentUser = { ...user };
        saveCurrentAuthState(this.currentUser);
      }

      saveUsersState(this.users);

      if (ticketStore && ticketStore.addAuditLog) {
        ticketStore.addAuditLog({
          userName: user.name,
          role: user.roleCode,
          action: 'PROFILE_UPDATED',
          entityType: 'USER',
          entityId: `USER-00${user.id}`,
          description: `Pengguna ${user.name} memperbarui informasi profil akun.`
        });
      }

      return { success: true, message: 'Data profil berhasil diperbarui.' };
    },

    adminResetPassword(userId, newPassword, actorUser, ticketStore) {
      const user = this.users.find(u => u.id === Number(userId));
      if (!user) {
        return { success: false, message: 'Pengguna tidak ditemukan.' };
      }

      const passToSet = newPassword && newPassword.trim() ? newPassword.trim() : 'GTT@2026!';
      user.password = passToSet;

      if (this.currentUser && this.currentUser.id === user.id) {
        this.currentUser.password = passToSet;
        saveCurrentAuthState(this.currentUser);
      }

      saveUsersState(this.users);

      if (ticketStore && ticketStore.addAuditLog) {
        ticketStore.addAuditLog({
          userName: actorUser ? actorUser.name : 'System Admin',
          role: actorUser ? actorUser.roleCode : 'ADMIN',
          action: 'USER_PASSWORD_RESET_BY_ADMIN',
          entityType: 'USER',
          entityId: `USER-00${user.id}`,
          description: `Administrator ${actorUser ? actorUser.name : 'Admin'} mereset kata sandi staf ${user.name} (${user.email}).`
        });
      }

      return {
        success: true,
        message: `Kata sandi untuk ${user.name} berhasil direset menjadi: ${passToSet}`,
        temporaryPassword: passToSet
      };
    }
  }
});

function userData_roleCode_check(code) {
  return code === 'ENGINEER' ? 3 : 4;
}
