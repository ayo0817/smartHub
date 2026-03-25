import React from "react";
import { User, Mail, Bell, Shield, Moon, LogOut, Camera } from "lucide-react";
import { motion } from "motion/react";

export function Profile() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">User Profile</h2>
        <p className="text-secondary mt-1">Manage your account settings and preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="card flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                <User size={64} className="text-gray-400" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-accent text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                <Camera size={16} />
              </button>
            </div>
            <h3 className="mt-4 text-xl font-bold">John Doe</h3>
            <p className="text-sm text-secondary">Computer Science Student</p>
            <div className="mt-6 w-full pt-6 border-t border-gray-100 flex justify-around">
              <div className="text-center">
                <p className="text-lg font-bold">12</p>
                <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">Courses</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">48</p>
                <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">Tasks</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">A-</p>
                <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">GPA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <section className="card space-y-6">
            <h3 className="text-xl font-bold">Account Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-xl text-secondary">
                  <Mail size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Email Address</p>
                  <p className="text-sm text-secondary">john.doe@university.edu</p>
                </div>
                <button className="text-accent text-sm font-bold">Change</button>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-xl text-secondary">
                  <Shield size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Password</p>
                  <p className="text-sm text-secondary">••••••••••••</p>
                </div>
                <button className="text-accent text-sm font-bold">Update</button>
              </div>
            </div>
          </section>

          <section className="card space-y-6">
            <h3 className="text-xl font-bold">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-secondary">
                    <Bell size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Notifications</p>
                    <p className="text-sm text-secondary">Get alerts for deadlines and AI tips.</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-accent rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-secondary">
                    <Moon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-sm text-secondary">Switch to a darker theme for late studies.</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </section>

          <button className="w-full py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all flex items-center justify-center gap-2">
            <LogOut size={20} />
            Sign Out of All Devices
          </button>
        </div>
      </div>
    </div>
  );
}
