import { useEffect, useState } from 'react';
import { LoginModel } from './tokenProps';

export default function useToken() {
    useEffect(() => {
        // const handle = window.setInterval(() => {
        //     console.log('checking token status', handle);
        //     if (token && getToken() == null) {
        //         internalSetToken(null);
        //     }
        // }, 1000);  //check refresh token every 1 second
        // return () => clearInterval(handle); //cleanup
    }, []);

    const getToken = () => {
        try {
            const tokenString = localStorage.getItem('token');
            if (tokenString) {
                const userToken = JSON.parse(tokenString) as LoginModel;
                if (userToken && (userToken.tokenType === 'basic' || userToken.tokenType === 'google'))
                    return tokenString;
            }
        } catch (error) {
            
        }

        return null;
        // if (userToken?.tokenObj?.expires_at && new Date(userToken.tokenObj.expires_at) > new Date()) {
        //     return userToken;
        // }
        // return null;
    };

    const [token, internalSetToken] = useState(getToken());

    const saveToken = (t: LoginModel) => {
        const stringifyToken = JSON.stringify(t);
        localStorage.setItem('token', stringifyToken);
        internalSetToken(stringifyToken);
    };

    return {
        setToken: saveToken,
        token
    }
}