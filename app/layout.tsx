'use client';

import type React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { DownloadProvider } from '@/components/download-context';
import AppSidebar from '@/components/sidebar';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { SidebarProvider } from '@/components/ui/sidebar';
import { OsType, type } from '@tauri-apps/plugin-os';
import clsx from 'clsx';
import { useLayoutEffect, useState } from 'react';
import { PresetsThemeProvider } from '@/components/presets-theme-context';
import {
  TITLE_BAR_HEIGHT,
  WindowsTitlebar,
} from '@/components/windows-titlebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [OS, setOS] = useState<OsType>();

  useLayoutEffect(() => {
    setOS(type());
  }, []);

  const windowContainerHeight =
    OS === 'windows' ? `calc(100vh - ${TITLE_BAR_HEIGHT}px - 8px)` : '100vh';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                  (function() {
                     try {
                     var preset = localStorage.getItem('theme-preset');
                     // If a preset is stored and it's not the default, hide the page
                     if (preset && preset !== 'modern-minimal') {
                     document.documentElement.style.visibility = 'hidden';
                     }
                  } catch (e) {}
                     })();
                        `,
          }}
        />
      </head>
      <body
        className={clsx('antialiased h-screen w-screen', {
          'bg-sidebar': OS === 'linux' || OS === 'windows',
          'bg-background/30': OS === 'macos',
        })}
      >
        <PresetsThemeProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="theme"
            themes={['light', 'dark']}
          >
            <DownloadProvider>
              <WindowsTitlebar />
              <div className="overflow-hidden">
                <SidebarProvider className="w-screen">
                  <AppSidebar />
                  <div
                    className="flex items-center justify-start flex-col mr-2 w-full"
                    style={{
                      height: windowContainerHeight,
                    }}
                  >
                    <div className="bg-background w-full h-full rounded-lg overflow-x-hidden pb-3 overflow-y-auto">
                      {children}
                      <Toaster />
                    </div>
                  </div>
                </SidebarProvider>
              </div>
            </DownloadProvider>
          </ThemeProvider>
        </PresetsThemeProvider>
      </body>
    </html>
  );
}
