'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  Database,
  ChevronRight
} from 'lucide-react';

const settingsSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile Information", desc: "Update your name, email, and photo" },
      { icon: Shield, label: "Security", desc: "Change password and enable 2FA" },
      { icon: Bell, label: "Notifications", desc: "Configure how you receive alerts" },
    ]
  },
  {
    title: "System",
    items: [
      { icon: Moon, label: "Appearance", desc: "Dark mode and theme settings" },
      { icon: Globe, label: "Language", desc: "Select your preferred language" },
      { icon: Database, label: "Database Management", desc: "Backup and restore system data" },
    ]
  }
];

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-secondary mt-1">Manage your account and system preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {settingsSections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-bold text-secondary uppercase tracking-widest text-xs px-2">{section.title}</h3>
            <div className="glass rounded-2xl divide-y divide-glass-border overflow-hidden">
              {section.items.map((item, i) => (
                <button 
                  key={i}
                  className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold">{item.label}</p>
                      <p className="text-sm text-secondary">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4">
          <button className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/5">
            Reset All Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
