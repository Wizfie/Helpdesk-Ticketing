import { defineStore } from 'pinia';
import { MOCK_USERS, ROLES } from '../data/mockData';

const STORAGE_KEY_USER_ID = 'gtt_current_user_id';
const STORAGE_KEY_ROLE = 'gtt_current_role';
const STORAGE_KEY_USERS = 'gtt_mock_users';

function getStoredUsers() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return MOCK_USERS;
  }
  try {
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
  return MOCK_USERS;
}

function getStoredCurrentUser(users) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return users[1] || users[0];
  }
  try {
    const storedUserId = localStorage.getItem(STORAGE_KEY_USER_ID);
    if (storedUserId) {
      const matched = users.find(u => u.id === Number(storedUserId));
      if (matched) return matched;
    }

    const storedRole = localStorage.getItem(STORAGE_KEY_ROLE);
    if (storedRole) {
      const matchedByRole = users.find(u => u.roleCode === storedRole);
      if (matchedByRole) return matchedByRole;
    }
  } catch (e) {
    console.error('Failed to load current user from localStorage:', e);
  }

  // Default fallback: Rina Anggraini (CPIG / Helpdesk)
  return users.find(u => u.roleCode === 'CPIG') || users[1] || users[0];
}

function saveCurrentAuthState(user) {
  if (typeof window === 'undefined' || !window.localStorage || !user) return;
  try {
    localStorage.setItem(STORAGE_KEY_USER_ID, String(user.id));
    localStorage.setItem(STORAGE_KEY_ROLE, user.roleCode);
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
  actions: {
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
    createUser(userData, actorUser, ticketStore) {
      const parts = userData.name.trim().split(' ');
      const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();

      const newUser = {
        id: this.users.length + 1,
        roleId: userData.roleCode === 'ADMIN' ? 1 : userData.roleCode === 'CPIG' ? 2 : userData.roleCode === 'ENGINEER' ? 3 : 4,
        roleCode: userData.roleCode,
        name: userData.name,
        email: userData.email,
        initials,
        phone: userData.phone,
        isActive: true
      };

      this.users.push(newUser);
      saveUsersState(this.users);

      if (ticketStore && ticketStore.addAuditLog) {
        ticketStore.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: 'USER_CREATED',
          entityType: 'USER',
          entityId: `USER-00${newUser.id}`,
          description: `Mendaftarkan akun staf baru: ${newUser.name} (${newUser.roleCode})`
        });
      }

      return newUser;
    },
    updateUser(userId, updatedData, actorUser, ticketStore) {
      const user = this.users.find(u => u.id === Number(userId));
      if (!user) return null;

      const oldRole = user.roleCode;
      const oldName = user.name;

      user.name = updatedData.name;
      user.email = updatedData.email;
      user.roleCode = updatedData.roleCode;
      user.roleId = updatedData.roleCode === 'ADMIN' ? 1 : updatedData.roleCode === 'CPIG' ? 2 : userData_roleCode_check(updatedData.roleCode);
      user.phone = updatedData.phone;
      if (typeof updatedData.isActive === 'boolean') {
        user.isActive = updatedData.isActive;
      }

      const parts = user.name.trim().split(' ');
      user.initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();

      // If updating current logged in user, update currentUser state too
      if (this.currentUser.id === user.id) {
        this.currentUser = { ...user };
        saveCurrentAuthState(this.currentUser);
      }

      saveUsersState(this.users);

      if (ticketStore && ticketStore.addAuditLog) {
        ticketStore.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: 'USER_UPDATED',
          entityType: 'USER',
          entityId: `USER-00${user.id}`,
          description: `Memperbarui profil staf: ${user.name} (Peran: ${user.roleCode}${oldRole !== user.roleCode ? ` dari ${oldRole}` : ''}, Status: ${user.isActive ? 'Aktif' : 'Nonaktif'})`
        });
      }

      return user;
    },
    toggleUserStatus(userId, actorUser, ticketStore) {
      const user = this.users.find(u => u.id === Number(userId));
      if (!user) return;

      user.isActive = !user.isActive;
      saveUsersState(this.users);

      if (ticketStore && ticketStore.addAuditLog) {
        ticketStore.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: 'USER_STATUS_TOGGLED',
          entityType: 'USER',
          entityId: `USER-00${user.id}`,
          description: `Mengubah status keaktifan staf ${user.name} menjadi ${user.isActive ? 'Aktif' : 'Nonaktif'}`
        });
      }
    }
  }
});

function userData_roleCode_check(code) {
  return code === 'ENGINEER' ? 3 : 4;
}
