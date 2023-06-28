export interface LoginModel {
    tokenType: 'google' | 'basic' | 'none', t: string
}
export type LoginProps = {
    setToken: (t: LoginModel) => void
}