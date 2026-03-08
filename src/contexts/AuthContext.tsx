import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  detectIdentifierType,
  isValidIdentifier,
  normalizeIdentifier,
} from "@/lib/authValidation";

export interface User {
  name: string;
  email: string;
  phone: string;
  photo: string | null;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isReady: boolean;
  login: (
    identifier: string,
    password: string,
  ) => { success: boolean; message: string };
  signup: (
    identifier: string,
    password: string,
  ) => { success: boolean; message: string };
  guestLogin: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  resetPassword: (
    identifier: string,
    newPassword: string,
  ) => { success: boolean; message: string };
  socialAuth: (
    provider: "google" | "apple",
  ) => { success: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const USERS_KEY = "rra_users";
const SESSION_KEY = "rra_session";

interface SessionData {
  identifier: string;
  isGuest: boolean;
}

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): SessionData | null {
  try {
    const stored = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!stored) return null;

    // Backward compatibility with older session shape that used "email".
    const identifier =
      typeof stored.identifier === "string"
        ? stored.identifier
        : typeof stored.email === "string"
          ? stored.email
          : "";

    if (!identifier) return null;

    return {
      identifier: normalizeIdentifier(identifier),
      isGuest: Boolean(stored.isGuest),
    };
  } catch {
    return null;
  }
}

function saveSession(session: SessionData | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function findUserByIdentifier(users: StoredUser[], identifier: string) {
  const normalized = normalizeIdentifier(identifier);
  return users.find((user) => {
    const email = normalizeIdentifier(user.email || "");
    const phone = normalizeIdentifier(user.phone || "");
    return normalized === email || normalized === phone;
  });
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const session = getSession();
    if (session) {
      if (session.isGuest) {
        setIsGuest(true);
        setUser(null);
      } else {
        const users = getStoredUsers();
        const found = findUserByIdentifier(users, session.identifier);
        if (found) {
          const { password: _, ...userData } = found;
          setUser(userData);
        }
      }
    }
    setIsReady(true);
  }, []);

  const signup = (identifier: string, password: string) => {
    const normalizedIdentifier = normalizeIdentifier(identifier);
    if (!isValidIdentifier(normalizedIdentifier)) {
      return {
        success: false,
        message: "Please enter a valid email or phone number",
      };
    }
    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }

    const users = getStoredUsers();
    if (findUserByIdentifier(users, normalizedIdentifier)) {
      return {
        success: false,
        message: "An account with this email or phone already exists",
      };
    }

    const identifierType = detectIdentifierType(normalizedIdentifier);
    const displayName =
      identifierType === "email"
        ? normalizedIdentifier.split("@")[0]
        : "New User";

    const newUser: StoredUser = {
      name: displayName,
      email: identifierType === "email" ? normalizedIdentifier : "",
      phone: identifierType === "phone" ? normalizedIdentifier : "",
      photo: null,
      password,
    };
    saveStoredUsers([...users, newUser]);
    const { password: _, ...userData } = newUser;
    setUser(userData);
    setIsGuest(false);
    saveSession({ identifier: normalizedIdentifier, isGuest: false });
    return { success: true, message: "Account created successfully" };
  };

  const login = (identifier: string, password: string) => {
    const normalizedIdentifier = normalizeIdentifier(identifier);
    if (!isValidIdentifier(normalizedIdentifier)) {
      return {
        success: false,
        message: "Please enter a valid email or phone number",
      };
    }

    const users = getStoredUsers();
    const found = findUserByIdentifier(users, normalizedIdentifier);
    if (!found) {
      return {
        success: false,
        message: "No account found with this email or phone",
      };
    }
    if (found.password !== password) {
      return { success: false, message: "Incorrect password" };
    }
    const { password: _, ...userData } = found;
    setUser(userData);
    setIsGuest(false);
    saveSession({ identifier: normalizedIdentifier, isGuest: false });
    return { success: true, message: "Logged in successfully" };
  };

  const guestLogin = () => {
    setUser(null);
    setIsGuest(true);
    saveSession({ identifier: "guest", isGuest: true });
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    saveSession(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    // Update in stored users
    const users = getStoredUsers();
    const currentSession = getSession();
    const currentIdentifier = currentSession
      ? normalizeIdentifier(currentSession.identifier)
      : "";
    const currentEmail = normalizeIdentifier(user.email || "");
    const currentPhone = normalizeIdentifier(user.phone || "");

    const idx = users.findIndex((u) => {
      const userEmail = normalizeIdentifier(u.email || "");
      const userPhone = normalizeIdentifier(u.phone || "");
      return (
        userEmail === currentIdentifier ||
        userPhone === currentIdentifier ||
        (userEmail === currentEmail && userPhone === currentPhone)
      );
    });

    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      // Keep session identifier in sync if the active login identifier changed.
      if (currentSession && !currentSession.isGuest) {
        if (updates.email && currentIdentifier === currentEmail) {
          saveSession({
            identifier: normalizeIdentifier(updates.email),
            isGuest: false,
          });
        } else if (updates.phone && currentIdentifier === currentPhone) {
          saveSession({
            identifier: normalizeIdentifier(updates.phone),
            isGuest: false,
          });
        }
      }
      saveStoredUsers(users);
    }
  };

  const resetPassword = (identifier: string, newPassword: string) => {
    const normalizedIdentifier = normalizeIdentifier(identifier);
    if (!isValidIdentifier(normalizedIdentifier)) {
      return {
        success: false,
        message: "Please enter a valid email or phone number",
      };
    }
    if (newPassword.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }

    const users = getStoredUsers();
    const idx = users.findIndex((u) => {
      const email = normalizeIdentifier(u.email || "");
      const phone = normalizeIdentifier(u.phone || "");
      return email === normalizedIdentifier || phone === normalizedIdentifier;
    });
    if (idx === -1) {
      return {
        success: false,
        message: "No account found with this email or phone",
      };
    }
    users[idx].password = newPassword;
    saveStoredUsers(users);
    return { success: true, message: "Password reset successfully" };
  };

  const socialAuth = (provider: "google" | "apple") => {
    const normalizedProvider = provider.toLowerCase();
    const email = `${normalizedProvider}.social@rra.app`;
    const password = `social-${normalizedProvider}-auth`;
    const users = getStoredUsers();
    let account = users.find((u) => u.email === email);

    if (!account) {
      account = {
        name: provider === "google" ? "Google User" : "Apple User",
        email,
        phone: "",
        photo: null,
        password,
      };
      saveStoredUsers([...users, account]);
    }

    const { password: _, ...userData } = account;
    setUser(userData);
    setIsGuest(false);
    saveSession({ identifier: account.email, isGuest: false });

    return {
      success: true,
      message: `Signed in with ${provider === "google" ? "Google" : "Apple"}`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isGuest,
        isReady,
        login,
        signup,
        guestLogin,
        logout,
        updateProfile,
        resetPassword,
        socialAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
