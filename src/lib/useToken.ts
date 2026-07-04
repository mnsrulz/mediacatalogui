import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export const useToken = () => {
    const [value, setValue] = useLocalStorage('g-access-token', { access_token: '', expires_in: 0, expires_at: 0, scope: '', token_type: '' });
    const [isValid, setIsValid] = useState(false);

    const setToken = (props: { access_token: string, expires_in: number, scope: string, token_type: string }) => {
        const expires_at = Date.now() + (props.expires_in * 1000);
        setValue({ ...props, expires_at });
    }

    useEffect(() => {
        const isValidToken = () => {
            return setIsValid(value.expires_at > Date.now());
        }
        isValidToken();
        const i = setInterval(() => {
            isValidToken();
        }, 1000);
        return () => clearInterval(i);
    }, [value]);

    return {
        access_token: value.access_token,
        setToken,
        isValid
    }
}