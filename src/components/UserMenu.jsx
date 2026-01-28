import React from "react"
import { LogOut, User } from "lucide-react"

// Simple mock Auth hook since we don't have the full context
const useAuth = () => {
    return {
        logout: async () => { console.log("Logging out..."); }
    }
}

export default function UserMenu({ onClose }) {
    const { logout } = useAuth()

    return (
        <>
            <div className="fixed inset-0 z-[95]" onClick={onClose} />
            <div className="user-menu absolute right-0 top-full mt-2 w-64 p-2 rounded-xl border border-border bg-panel shadow-strong animate-fade-down animate-duration-200">
                <a href="/profile" onClick={onClose} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background transition-colors text-foreground">
                    <User size={16} className="text-primary" />
                    <span>Mi perfil</span>
                </a>
                <button
                    onClick={async () => { await logout(); onClose(); }}
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-background transition-colors text-foreground text-left"
                >
                    <LogOut size={16} className="text-muted" />
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </>
    )
}
