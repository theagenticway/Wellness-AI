import { Card } from '../components/ui/card';
import { User, Shield, Bell, Settings as SettingsIcon, HelpCircle, Info } from 'lucide-react';

export function SettingsScreen() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Account</h2>
          <Card className="p-2">
            <div className="space-y-1">
              <SettingsItem icon={User} label="Personal Information" description="Manage your personal information" />
              <SettingsItem icon={Shield} label="Subscription" description="Manage your subscription" />
              <SettingsItem icon={Bell} label="Connected Devices" description="Manage your connected devices" />
            </div>
          </Card>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Preferences</h2>
          <Card className="p-2">
            <div className="space-y-1">
              <SettingsItem icon={SettingsIcon} label="App Preferences" description="Customize your app experience" />
              <SettingsItem icon={Bell} label="Notifications" description="Manage your notification settings" />
              <SettingsItem icon={Shield} label="Privacy" description="Manage your privacy settings" />
            </div>
          </Card>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Support</h2>
          <Card className="p-2">
            <div className="space-y-1">
              <SettingsItem icon={HelpCircle} label="Help & Support" description="Get help and support" />
              <SettingsItem icon={Info} label="About" description="Learn more about the app" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SettingsItem({ icon: Icon, label, description }: { icon: React.ElementType, label: string, description: string }) {
  return (
    <div className="flex items-center p-3 rounded-lg hover:bg-slate-100 cursor-pointer">
      <Icon className="h-6 w-6 mr-4 text-slate-600" />
      <div>
        <h3 className="font-semibold">{label}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}
