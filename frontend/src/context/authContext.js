import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const updateProfilePic = profileUrl => {
    let stores = JSON.parse(localStorage.getItem("user"));
    stores.profilePic = profileUrl;
    localStorage.setItem("user", JSON.stringify(stores));
    // setCurrentUser(stores);
  };
  const login = async inputs => {
    //TO DO
    const res = await axios.post(
      "http://52.87.255.171:8800/api/auth/login",
      inputs,
      {
        withCredentials: true,
      }
    );

    setCurrentUser(res.data);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, updateProfilePic }}>
      {children}
    </AuthContext.Provider>
  );
};
