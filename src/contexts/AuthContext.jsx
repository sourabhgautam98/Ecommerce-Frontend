import { createContext, useState, useEffect, useCallback, useContext } from "react";
import Cookies from "js-cookie";
import { authAPI } from "../api/auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    isLoggedIn: false,
    user: null,
    loading: true,
    error: null,
  });

  const fetchUser = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const userData = await authAPI.getUser();
      
      Cookies.set("userData", JSON.stringify(userData), { sameSite: 'strict' });
      
      setState({
        isLoggedIn: true,
        user: userData,
        loading: false,
        error: null,
      });

      return userData;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setState(prev => ({
        ...prev,
        isLoggedIn: false,
        user: null,
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch user',
      }));
      Cookies.remove("token");
      Cookies.remove("userData");
      return null;
    }
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const userData = await fetchUser();
          setState({
            isLoggedIn: true,
            user: userData,
            loading: false,
            error: null,
          });
        } catch (error) {
          setState({
            isLoggedIn: false,
            user: null,
            loading: false,
            error: error.message,
          });
        }
      } else {
        setState({
          isLoggedIn: false,
          user: null,
          loading: false,
          error: null,
        });
      }
    };

    checkAuthStatus();
  }, [fetchUser]);

  const login = async (credentials) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { token, _id, name, email, role } = await authAPI.login(credentials);
      const userData = { _id, name, email, role };
      
      Cookies.set("token", token, { sameSite: 'strict' });
      Cookies.set("userData", JSON.stringify(userData), { sameSite: 'strict' });
      
      setState({
        isLoggedIn: true,
        user: userData,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Login failed',
      }));
      return false;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("userData");
    setState({
      isLoggedIn: false,
      user: null,
      loading: false,
      error: null,
    });
    return true;
  };

  const hasRole = (role) => state.user?.role === role;
  const isAdmin = () => hasRole("admin");
  const isUser = () => hasRole("user") || isAdmin();

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        getToken: () => Cookies.get("token"),
        hasRole,
        isAdmin,
        isUser,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };