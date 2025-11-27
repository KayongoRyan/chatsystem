import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, Lock, User, Shield, Moon, HelpCircle, LogOut } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account</h2>
          
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors text-left">
              <User className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">Personal Details</p>
                <p className="text-sm text-muted-foreground">Update your info</p>
              </div>
            </button>
            <Separator />
            <button className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors text-left">
              <Lock className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">Password & Security</p>
                <p className="text-sm text-muted-foreground">Manage your password and 2FA</p>
              </div>
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Preferences</h2>
          
          <div className="bg-card rounded-xl border border-border overflow-hidden">
             <div className="flex items-center justify-between p-4">
               <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                     <Label className="font-medium text-base">Notifications</Label>
                     <p className="text-sm text-muted-foreground">Pause all</p>
                  </div>
               </div>
               <Switch />
             </div>
             <Separator />
             <div className="flex items-center justify-between p-4">
               <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-primary" />
                  <div>
                     <Label className="font-medium text-base">Dark Mode</Label>
                     <p className="text-sm text-muted-foreground">Adjust appearance</p>
                  </div>
               </div>
               <Switch defaultChecked />
             </div>
             <Separator />
             <div className="flex items-center justify-between p-4">
               <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                     <Label className="font-medium text-base">Private Account</Label>
                     <p className="text-sm text-muted-foreground">Only followers can see your photos and videos</p>
                  </div>
               </div>
               <Switch />
             </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">More</h2>
          
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors text-left">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span className="font-medium">Help Center</span>
            </button>
            <Separator />
            <button className="w-full flex items-center gap-3 p-4 hover:bg-red-500/10 transition-colors text-left text-red-500">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
