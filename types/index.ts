export interface SignupLoginFormType {
    name? : string,
    email : string,
    password : string
}

export interface UserState {
    id : string,
    name : string, 
    email : string
}

export interface AuthState {
    user : UserState | null,
    showAuthModel : boolean
}