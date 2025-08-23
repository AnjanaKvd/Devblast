import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isAdmin, setIsAdmin] = useState(false);

  // Update isAdmin whenever user changes
  useEffect(() => {
    setIsAdmin(user && user.role === 'admin');
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAdmin(userData && userData.role === 'admin');
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  const redirectAfterLogin = () => {
    if (!user) return '/login';
    return isAdmin ? '/admin-dashboard' : '/';
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, redirectAfterLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
