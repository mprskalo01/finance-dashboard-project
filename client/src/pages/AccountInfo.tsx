import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  username: string;
  // Add other user properties here as needed
}

const AccountInfo = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get<User>("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "An error occurred while fetching user data"
          );
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-xl font-bold">
      Welcome, {user.username}! {console.log(user.username)}
    </div>
  );
};

export default AccountInfo;
