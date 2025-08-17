import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const isAuthenticated = !!authUser;

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
             axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Login failed. Please try again. " + error.message);
        }
    };

    const logout = async () => {
        try {
            setAuthUser(null);
            setToken(null);
            localStorage.removeItem("token");
            setOnlineUsers([]);
            axios.defaults.headers.common["token"] = null;
            toast.success("Logged out successfully.");
            socket?.disconnect();
        } catch (error) {
            toast.error("Logout failed. Please try again. " + error.message);
        }
    };

    const updateProfile = async (userData) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", userData);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully.");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Profile update failed. Please try again. " + error.message);
        }
    };

    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;

        const newSocket = io(backendUrl, {
            query: { userId: userData._id },
        });

        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        }
        checkAuth();
    }, []);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        isAuthenticated,
        login,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            <Toaster />
        </AuthContext.Provider>
    );
};
