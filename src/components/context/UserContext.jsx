import React from "react";

const UserContext = React.createContext(
    {
        user: {},
        setUser: (user) => {}
    }
)

export default UserContext
