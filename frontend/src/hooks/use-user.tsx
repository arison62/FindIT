import React from "react";
interface User {
    is_logged_in: boolean;
    is_admin: boolean;
    id?: string
    username?: string;
    email?: string;
}

const UserContext = React.createContext<User & {
    setUser?: React.Dispatch<React.SetStateAction<User>>;
}>({
    is_logged_in: false,
    is_admin: false,
});

export const useUser = () => {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState<User & {
        setUser?: React.Dispatch<React.SetStateAction<User>>;
    }>({
        is_logged_in: false,
        is_admin: false,
    });

    React.useEffect(() => {
      const token = localStorage.getItem("token");
      const expire_in = localStorage.getItem("expire_in");
      if(token && expire_in && parseInt(expire_in) > Date.now()){
        setUser({
            is_logged_in: true,
            is_admin: false,
            setUser
        })
      }
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}