import { useEffect, useState } from 'react';

export default function useToken() {
    useEffect(() => {
        const handle = window.setInterval(() => {
            console.log('checking token status', handle);
            if (token && getToken() == null) {
                internalSetToken(null);
            }
        }, 1000);  //check refresh token every 1 second
        return () => clearInterval(handle); //cleanup
    }, []);

    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        if (userToken?.tokenObj?.expires_at && new Date(userToken.tokenObj.expires_at) > new Date()) {
            return userToken;
        }
        return null;
    };

    const [token, internalSetToken] = useState(getToken());

    const saveToken = userToken => {
        localStorage.setItem('token', JSON.stringify(userToken));
        const onlyValidToken = getToken();
        if (onlyValidToken) {
            internalSetToken(onlyValidToken);
        }
    };

    return {
        setToken: saveToken,
        token
    }
}