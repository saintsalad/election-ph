"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

// Reusable Components
function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className='bg-card rounded-lg p-6 shadow-sm'>
      <h2 className='text-lg font-semibold mb-4'>{title}</h2>
      {children}
    </div>
  );
}

// Settings Section Components
function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className='flex items-center justify-between'>
      <div>
        <p className='font-medium'>Theme</p>
        <p className='text-sm text-muted-foreground'>
          Choose your preferred theme
        </p>
      </div>
      <Button
        variant='outline'
        size='lg'
        onClick={() => setTheme(isDarkMode ? "light" : "dark")}
        className={cn(
          "w-[120px] transition-colors duration-300",
          isDarkMode
            ? "hover:bg-amber-500/10 hover:text-amber-500"
            : "hover:bg-indigo-500/10 hover:text-indigo-500"
        )}>
        {isDarkMode ? (
          <div className='flex items-center'>
            <SunIcon className='mr-2 h-4 w-4' />
            Light
          </div>
        ) : (
          <div className='flex items-center'>
            <MoonIcon className='mr-2 h-4 w-4' />
            Dark
          </div>
        )}
      </Button>
    </div>
  );
}

// Main Component
function Settings() {
  return (
    <div className='py-11 pt-24'>
      <div className='container max-w-4xl mx-auto px-4'>
        <h1 className='text-2xl font-bold mb-6'>Settings</h1>

        <div className='space-y-6'>
          <SettingsSection title='Appearance'>
            <AppearanceSettings />
          </SettingsSection>

          {/* Example of how to add future sections */}
          {/* <SettingsSection title="Notifications">
            <NotificationSettings />
          </SettingsSection> */}

          {/* <SettingsSection title="Privacy">
            <PrivacySettings />
          </SettingsSection> */}
        </div>
      </div>
    </div>
  );
}

export default Settings;
