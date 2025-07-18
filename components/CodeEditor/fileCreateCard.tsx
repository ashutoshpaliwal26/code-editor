"use client"

import { useSocket } from '@/provider/SocketProvider';
import React, { useState } from 'react'

interface FileCreateCardProps {
    theme: string,
    initPath : string
    handelClose : () => void
}

const FileCreateCard: React.FC<FileCreateCardProps> = ({
    theme,
    handelClose,
    initPath
}) => {
    const [showCreateDialog, setShowCreateDialog] = useState<{ type: "file" | "folder"; parentPath: string } | null>(null)
    const [newItemName, setNewItemName] = useState<string>("");
    const socket = useSocket();
    
    function confirmCreateItem(): void {
        socket?.emit("write:cmd", `cd \ cd app/workspace \ mkdir ${initPath} ${newItemName} && clear \n`);
        setShowCreateDialog(null);
        handelClose();
    }

    return (
        <div>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className={`w-96 rounded-lg shadow-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                    <div className={`p-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                        <h3 className="text-lg font-medium">Create New {showCreateDialog?.type === "file" ? "File" : "Folder"}</h3>
                    </div>
                    <div className="p-4">
                        <input
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value as string)}
                            placeholder={`Enter ${showCreateDialog?.type} name...`}
                            className={`w-full px-3 py-2 rounded border ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-gray-300"
                                : "bg-white border-gray-300 text-gray-700"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            autoFocus
                        />
                    </div>
                    <div
                        className={`flex justify-end space-x-2 p-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                    >
                        <button
                            onClick={() => {
                                handelClose();
                                setShowCreateDialog(null)
                                setNewItemName("")
                            }}
                            className={`px-4 py-2 rounded transition-colors ${theme === "dark"
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmCreateItem}
                            disabled={!newItemName.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FileCreateCard

