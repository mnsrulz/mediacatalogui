import { useState } from 'react';
import { LoginModel } from './tokenProps';

export default function useToken() {
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
    };

    const [token, internalSetToken] = useState(getToken());

    const saveToken = (t?: LoginModel) => {
        if (!t || t.tokenType === 'none') {
            internalSetToken(null);
        } else {
            const stringifyToken = JSON.stringify(t);
            localStorage.setItem('token', stringifyToken);
            internalSetToken(stringifyToken);
        }
    };

    return {
        setToken: saveToken,
        token
    }
}