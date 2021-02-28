import { useEffect, useState } from 'react';

export default function useToken() {    
    useEffect(() => {
        window.setInterval(() => {            
            if (getToken() == null) {
                setToken(null);
            }
        }, 1000);  //check refresh token every 1 second
    }, []);

    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        if (userToken?.tokenObj?.expires_at && new Date(userToken.tokenObj.expires_at) > new Date()) {
            return userToken;
        }
        return null;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken);
    };

    return {
        setToken: saveToken,
        token
    }
}