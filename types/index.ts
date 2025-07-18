import { Socket } from 'socket.io-client'

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

export interface SocketState {
    socket : Socket
}

export interface FileNode {
  name: string
  type: "file" | "folder"
  children? : FileNode[]
  path: string
  isOpen?: boolean
}

//  This is the file state of the fileSlice Redux
export interface FileStates {
    loading : boolean,
    files : FileNode[] | null,
    isError : boolean
}