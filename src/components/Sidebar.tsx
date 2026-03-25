import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  Sparkles, 
  BarChart3, 
  User, 
  LogOut
} from "lucide-react";
import { cn } from "../lib/utils";
import { logout } from "../firebase";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: BookOpen, label: "Notes", path: "/notes" },
  { icon: Sparkles, label: "AI Study", path: "/ai" },
  { icon: BarChart3, label: "Performance", path: "/performance" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          Hub
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                isActive 
                  ? "bg-accent/10 text-accent" 
                  : "text-secondary hover:bg-gray-50 hover:text-primary"
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3 w-full text-secondary hover:text-red-500 hover:bg-red-50 transition-all rounded-xl font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
