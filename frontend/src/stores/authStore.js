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
    phone: '0811-9988-771',
    specialty: 'Lead Helpdesk & System Administrator',
    isActive: true
  },
  {
    id: 10,
    role: 'ENGINEER',
    roleCode: 'ENGINEER',
    name: 'Farhan Pratama',
    email: 'farhan.eng@glotratech.com',
    phone: '0812-9999-8888',
    specialty: 'L2 Network & Infrastructure Specialist',
    isActive: true
  },
  {
    id: 11,
    role: 'ENGINEER',
    roleCode: 'ENGINEER',
    name: 'Budi Santoso',
    email: 'budi.eng@glotratech.com',
    phone: '0813-1122-3344',
    specialty: 'L2 Server & Storage Specialist',
    isActive: true
  },
  {
    id: 12,
    role: 'ENGINEER',
    roleCode: 'ENGINEER',
    name: 'Rizky Ramadhani',
    email: 'rizky.eng@glotratech.com',
    phone: '0812-4455-6677',
    specialty: 'L3 Security & Firewall Specialist',
    isActive: true
  },
  {
    id: 13,
    role: 'ENGINEER',
    roleCode: 'ENGINEER',
    name: 'Siti Nurhaliza',
    email: 'siti.eng@glotratech.com',
    phone: '0813-7788-9900',
    specialty: 'L2 Cloud & Virtualization Specialist',
    isActive: true
  },
  {
    id: 14,
    role: 'ENGINEER',
    roleCode: 'ENGINEER',
    name: 'Dimas Anggara',
    email: 'dimas.eng@glotratech.com',
    phone: '0812-3344-5566',
    specialty: 'L1 NOC Operations Dispatcher',
    isActive: true
  }
];

const STORAGE_KEY_USER_ID = 'gtt_current_user_id';
const STORAGE_KEY_ROLE = 'gtt_current_role';
const STORAGE_KEY_USERS = 'gtt_users_data';

const USER_DATA_VERSION_KEY = 'gtt_user_data_version';
const CURRENT_USER_DATA_VERSION = 'v11.0-prod-auth-clean';

function getStoredUsers() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_USERS;
  }
  try {
    const ver = localStorage.getItem(USER_DATA_VERSION_KEY);
    if (ver !== CURRENT_USER_DATA_VERSION) {
      localStorage.setItem(USER_DATA_VERSION_KEY, CURRENT_USER_DATA_VERSION);
      localStorage.removeItem('gtt_jwt_token');
      localStorage.removeItem(STORAGE_KEY_USER_ID);
      localStorage.removeItem(STORAGE_KEY_ROLE);
      localStorage.removeItem(STORAGE_KEY_USERS);
      localStorage.removeItem('gtt_tickets_data');
      localStorage.removeItem('gtt_customers_data');
      localStorage.removeItem('gtt_customers_data_v3');
      localStorage.removeItem('gtt_sla_policies_clean_v2');
      localStorage.removeItem('gtt_knowledge_base_data');
      localStorage.removeItem('gtt_audit_logs_data');
      localStorage.removeItem('gtt_selected_ticket_id');
      return DEFAULT_USERS;
    }
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (import.meta.env.DEV) {
          let changed = false;
          DEFAULT_USERS.forEach(defU => {
            if (!parsed.some(u => u.id === defU.id || u.email === defU.email)) {
              parsed.push(defU);
              changed = true;
            }
          });
          if (changed) {
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(parsed));
          }
        }
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
    return null;
  }
  try {
    if (localStorage.getItem('gtt_is_logged_out') === 'true') {
      return null;
    }
    const storedUserId = localStorage.getItem(STORAGE_KEY_USER_ID);
    if (storedUserId) {
      const matched = users.find(u => u.id === Number(storedUserId));
      if (matched && matched.isActive) return matched;
    }
  } catch (e) {
    console.error('Failed to load current user from localStorage:', e);
  }

  return null;
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
        return { success: false, message: 'Email atau kata sandi tidak sesuai. Periksa kembali kredensial Anda.' };
      }
      if (!user.isActive) {
        return { success: false, message: 'Akun staf berstatus non-aktif. Silakan hubungi Administrator.' };
      }

      const PLACEHOLDER_HASH = '$2a$10$defaultPlaceholderHash2026';
      const hasCustomPassword = Boolean(user.password && user.password !== PLACEHOLDER_HASH);
      const isPasswordValid = hasCustomPassword
        ? user.password === password
        : password === 'password123';

      if (!password || !isPasswordValid) {
        return { success: false, message: 'Email atau kata sandi tidak sesuai. Periksa kembali kredensial Anda.' };
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('gtt_is_logged_out');
      }
      this.currentUser = user;
      saveCurrentAuthState(user);

      api.login({ userId: user.id, email: user.email })
        .then((res) => {
          if (res?.token && typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('gtt_jwt_token', res.token);
          }
        })
        .catch(() => {});

      return { success: true, user };
    },
    loginAs(user) {
      if (!user) return;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('gtt_is_logged_out');
      }
      this.currentUser = user;
      saveCurrentAuthState(user);
    },
    logout() {
      this.currentUser = null;
      saveCurrentAuthState(null);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('gtt_is_logged_out', 'true');
        localStorage.removeItem('gtt_jwt_token');
        localStorage.removeItem(STORAGE_KEY_USER_ID);
        localStorage.removeItem(STORAGE_KEY_ROLE);
      }
    },
    clearCurrentSession() {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('gtt_jwt_token');
        localStorage.removeItem(STORAGE_KEY_USER_ID);
        localStorage.removeItem(STORAGE_KEY_ROLE);
        localStorage.removeItem(STORAGE_KEY_USERS);
        localStorage.removeItem('gtt_tickets_data');
        localStorage.removeItem('gtt_customers_data');
        localStorage.removeItem('gtt_customers_data_v3');
        localStorage.removeItem('gtt_sla_policies_clean_v2');
        localStorage.removeItem('gtt_knowledge_base_data');
        localStorage.removeItem('gtt_audit_logs_data');
        localStorage.removeItem('gtt_selected_ticket_id');
        localStorage.setItem('gtt_is_logged_out', 'true');
      }
      this.currentUser = null;
    },
    switchUser(userId) {
      if (!import.meta.env.DEV) return;
      const user = this.users.find(u => u.id === Number(userId));
      if (user) {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem('gtt_is_logged_out');
        }
        this.currentUser = user;
        saveCurrentAuthState(user);
      }
    },
    switchRole(roleCode) {
      if (!import.meta.env.DEV) return;
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

    async changePassword(userId, newPassword, ticketStore) {
      const user = this.users.find(u => u.id === Number(userId));
      if (!user) {
        return { success: false, message: 'Pengguna tidak ditemukan.' };
      }

      if (!newPassword || newPassword.length < 6) {
        return { success: false, message: 'Kata sandi baru minimal harus 6 karakter.' };
      }

      user.password = newPassword;

      if (this.currentUser && this.currentUser.id === user.id) {
        this.currentUser.password = newPassword;
        saveCurrentAuthState(this.currentUser);
      }

      saveUsersState(this.users);

      // Sinkronisasi kata sandi ke backend API MySQL
      try {
        await api.updateUser(user.id, { password: newPassword });
      } catch (err) {
        console.warn('API update password warning:', err.message);
      }

      if (ticketStore && ticketStore.addAuditLog) {
        ticketStore.addAuditLog({
          userName: user.name,
          role: user.roleCode || user.role,
          action: 'USER_PASSWORD_CHANGED',
          entityType: 'USER',
          entityId: `USER-00${user.id}`,
          description: `Pengguna ${user.name} (${user.roleCode || user.role}) berhasil memperbarui kata sandi akun.`
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

      if (profileData.email) {
        user.email = profileData.email.trim();
        payload.email = user.email;
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

    async adminResetPassword(userId, newPassword, actorUser, ticketStore) {
      const user = this.users.find(u => u.id === Number(userId));
      if (!user) {
        return { success: false, message: 'Pengguna tidak ditemukan.' };
      }

      const passToSet = newPassword ? String(newPassword).trim() : '';
      if (passToSet.length < 6) {
        return { success: false, message: 'Kata sandi baru minimal harus 6 karakter.' };
      }

      user.password = passToSet;

      if (this.currentUser && this.currentUser.id === user.id) {
        this.currentUser.password = passToSet;
        saveCurrentAuthState(this.currentUser);
      }

      saveUsersState(this.users);

      try {
        await api.updateUser(user.id, { password: passToSet });
      } catch (err) {
        console.warn('API reset password warning:', err.message);
      }

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
        message: `Kata sandi untuk ${user.name} berhasil direset.`,
        temporaryPassword: passToSet
      };
    }
  }
});

function userData_roleCode_check(code) {
  return code === 'ENGINEER' ? 3 : 4;
}
