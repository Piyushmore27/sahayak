import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminLogin, volunteerLogin, adminLogout, volunteerLogout, getAdminMe, getVolunteerMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin' | 'volunteer'
  const [loading, setLoading] = useState(true);

  // Rehydrate on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const token = localStorage.getItem('accessToken');
    if (!token || !storedRole) { setLoading(false); return; }
    const fetch = storedRole === 'admin' ? getAdminMe : getVolunteerMe;
    fetch()
      .then(({ data }) => { setUser(data.data); setRole(storedRole); })
      .catch(() => localStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const loginAdmin = useCallback(async (credentials) => {
    const { data } = await adminLogin(credentials);
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('role', 'admin');
    setUser(data.data.admin);
    setRole('admin');
    return data.data.admin;
  }, []);

  const loginVolunteer = useCallback(async (credentials) => {
    const { data } = await volunteerLogin(credentials);
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('role', 'volunteer');
    setUser(data.data.volunteer);
    setRole('volunteer');
    return data.data.volunteer;
  }, []);

  const logout = useCallback(async () => {
    const rt = localStorage.getItem('refreshToken');
    try {
      if (role === 'admin') await adminLogout(rt);
      else await volunteerLogout(rt);
    } catch {}
    localStorage.clear();
    setUser(null);
    setRole(null);
  }, [role]);

  return (
    <AuthContext.Provider value={{ user, role, loading, loginAdmin, loginVolunteer, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
