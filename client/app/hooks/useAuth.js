'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 1. Get the token you stored during login
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        // 2. Call your new backend route
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 3. Set the user data
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error("Fetch User Error:", err.response?.data?.message || err.message);
        setError(err.response?.data?.message || "Failed to fetch user");
        // Optional: localStorage.removeItem("token") if token is expired
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};