import axios from 'axios';

// Toggle this flag to switch between local mock database and live backend REST APIs
const USE_MOCK_API = true;

// Create Axios Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Dynamic Local Storage Mock State (no pre-filled static sample data)
let mockUsers = JSON.parse(localStorage.getItem('app_mock_users') || '[]');
let mockExpenses = JSON.parse(localStorage.getItem('app_mock_expenses') || '[]');
let mockAuditLogs = JSON.parse(localStorage.getItem('app_mock_audit_logs') || '[]');

const saveMockState = () => {
  localStorage.setItem('app_mock_users', JSON.stringify(mockUsers));
  localStorage.setItem('app_mock_expenses', JSON.stringify(mockExpenses));
  localStorage.setItem('app_mock_audit_logs', JSON.stringify(mockAuditLogs));
};

// Utility delay for realistic API responses in mock mode
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Auth Services
export const authService = {
  login: async (credentials) => {
    if (USE_MOCK_API) {
      await delay();
      const user = mockUsers.find(u => u.email === credentials.email) || {
        id: 'u-user',
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: credentials.role || 'EMPLOYEE',
        tenantId: 'tenant-alpha'
      };
      const token = `mock-jwt-token-${user.role}-${Date.now()}`;
      return { token, user };
    }
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  register: async (userData) => {
    if (USE_MOCK_API) {
      await delay();
      const newUser = {
        id: `u-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'EMPLOYEE',
        tenantId: userData.companyName ? `tenant-${userData.companyName.toLowerCase().replace(/\s+/g, '-')}` : 'tenant-alpha'
      };
      mockUsers.push(newUser);
      saveMockState();
      const token = `mock-jwt-token-${newUser.role}-${Date.now()}`;
      return { token, user: newUser };
    }
    const res = await api.post('/auth/register', userData);
    return res.data;
  }
};

// User Management Services (Dynamic Tenant User Directory)
export const userService = {
  getUsers: async () => {
    if (USE_MOCK_API) {
      await delay();
      return [...mockUsers];
    }
    const res = await api.get('/users');
    return res.data;
  },

  createUser: async (userData) => {
    if (USE_MOCK_API) {
      await delay();
      const newUser = {
        id: `u-${Date.now().toString().slice(-4)}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'EMPLOYEE',
        status: userData.status || 'ACTIVE',
        joined: new Date().toISOString().split('T')[0],
        tenantId: 'tenant-alpha'
      };
      mockUsers.push(newUser);
      saveMockState();
      return newUser;
    }
    const res = await api.post('/users', userData);
    return res.data;
  },

  deleteUser: async (id) => {
    if (USE_MOCK_API) {
      await delay();
      mockUsers = mockUsers.filter(u => u.id !== id);
      saveMockState();
      return { success: true };
    }
    const res = await api.delete(`/users/${id}`);
    return res.data;
  }
};

// Expense Services
export const expenseService = {
  getAll: async (filters = {}) => {
    if (USE_MOCK_API) {
      await delay();
      let list = [...mockExpenses];
      if (filters.status) {
        list = list.filter(e => e.status === filters.status);
      }
      if (filters.category) {
        list = list.filter(e => e.category === filters.category);
      }
      return list;
    }
    const res = await api.get('/expenses', { params: filters });
    return res.data;
  },

  getById: async (id) => {
    if (USE_MOCK_API) {
      await delay();
      const item = mockExpenses.find(e => e.id === id);
      if (!item) throw new Error('Expense not found');
      return item;
    }
    const res = await api.get(`/expenses/${id}`);
    return res.data;
  },

  create: async (expenseData, currentUser) => {
    if (USE_MOCK_API) {
      await delay();
      const newExpense = {
        id: `exp-${Date.now().toString().slice(-4)}`,
        amount: parseFloat(expenseData.amount),
        category: expenseData.category,
        description: expenseData.description,
        date: expenseData.date || new Date().toISOString().split('T')[0],
        status: 'PENDING',
        reimbursementStatus: 'UNPAID',
        user: currentUser?.name || 'Current User',
        userId: currentUser?.id || 'u1',
        createdAt: new Date().toISOString(),
        rejectionReason: null,
      };
      mockExpenses.unshift(newExpense);
      mockAuditLogs.unshift({
        id: `aud-${Date.now()}`,
        action: 'CREATED',
        user: currentUser?.name || 'Current User',
        expenseId: newExpense.id,
        date: new Date().toISOString(),
        details: `Created expense $${newExpense.amount} for ${newExpense.category}`
      });
      saveMockState();
      return newExpense;
    }
    const res = await api.post('/expenses', expenseData);
    return res.data;
  },

  update: async (id, expenseData, currentUser) => {
    if (USE_MOCK_API) {
      await delay();
      const index = mockExpenses.findIndex(e => e.id === id);
      if (index === -1) throw new Error('Expense not found');
      mockExpenses[index] = {
        ...mockExpenses[index],
        ...expenseData,
        amount: parseFloat(expenseData.amount || mockExpenses[index].amount),
      };
      mockAuditLogs.unshift({
        id: `aud-${Date.now()}`,
        action: 'UPDATED',
        user: currentUser?.name || 'Current User',
        expenseId: id,
        date: new Date().toISOString(),
        details: `Updated expense details for ${id}`
      });
      saveMockState();
      return mockExpenses[index];
    }
    const res = await api.put(`/expenses/${id}`, expenseData);
    return res.data;
  },

  delete: async (id, currentUser) => {
    if (USE_MOCK_API) {
      await delay();
      mockExpenses = mockExpenses.filter(e => e.id !== id);
      mockAuditLogs.unshift({
        id: `aud-${Date.now()}`,
        action: 'DELETED',
        user: currentUser?.name || 'Current User',
        expenseId: id,
        date: new Date().toISOString(),
        details: `Deleted expense ${id}`
      });
      saveMockState();
      return { success: true };
    }
    const res = await api.delete(`/expenses/${id}`);
    return res.data;
  },

  approve: async (id, currentUser) => {
    if (USE_MOCK_API) {
      await delay();
      const item = mockExpenses.find(e => e.id === id);
      if (item) {
        item.status = 'APPROVED';
        mockAuditLogs.unshift({
          id: `aud-${Date.now()}`,
          action: 'APPROVED',
          user: currentUser?.name || 'Manager',
          expenseId: id,
          date: new Date().toISOString(),
          details: `Approved expense ${id} ($${item.amount})`
        });
        saveMockState();
      }
      return item;
    }
    const res = await api.post(`/expenses/${id}/approve`);
    return res.data;
  },

  reject: async (id, reason, currentUser) => {
    if (USE_MOCK_API) {
      await delay();
      const item = mockExpenses.find(e => e.id === id);
      if (item) {
        item.status = 'REJECTED';
        item.rejectionReason = reason;
        mockAuditLogs.unshift({
          id: `aud-${Date.now()}`,
          action: 'REJECTED',
          user: currentUser?.name || 'Manager',
          expenseId: id,
          date: new Date().toISOString(),
          details: `Rejected expense ${id}. Reason: ${reason}`
        });
        saveMockState();
      }
      return item;
    }
    const res = await api.post(`/expenses/${id}/reject`, { reason });
    return res.data;
  },

  updateReimbursement: async (id, reimbursementStatus) => {
    if (USE_MOCK_API) {
      await delay();
      const item = mockExpenses.find(e => e.id === id);
      if (item) {
        item.reimbursementStatus = reimbursementStatus;
        saveMockState();
      }
      return item;
    }
    const res = await api.put(`/expenses/${id}/reimburse`, { reimbursementStatus });
    return res.data;
  }
};

// Report & Audit Services
export const reportService = {
  getSummary: async () => {
    if (USE_MOCK_API) {
      await delay();
      const totalExpenses = mockExpenses.length;
      const pendingExpenses = mockExpenses.filter(e => e.status === 'PENDING').length;
      const approvedExpenses = mockExpenses.filter(e => e.status === 'APPROVED').length;
      const rejectedExpenses = mockExpenses.filter(e => e.status === 'REJECTED').length;
      const totalAmountSpent = mockExpenses
        .filter(e => e.status === 'APPROVED')
        .reduce((sum, e) => sum + e.amount, 0);

      // Category breakdown
      const categoryMap = {};
      mockExpenses.forEach(e => {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
      });

      return {
        totalExpenses,
        pendingExpenses,
        approvedExpenses,
        rejectedExpenses,
        totalAmountSpent,
        categorySummary: categoryMap,
      };
    }
    const res = await api.get('/reports/summary');
    return res.data;
  }
};

export const auditService = {
  getLogs: async () => {
    if (USE_MOCK_API) {
      await delay();
      return [...mockAuditLogs];
    }
    const res = await api.get('/audit');
    return res.data;
  }
};

export default api;
