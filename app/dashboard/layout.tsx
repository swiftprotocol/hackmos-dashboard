'use client'

import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/catalyst/sidebar'
import { SidebarLayout } from '@/components/catalyst/sidebar-layout'
import { useAuth } from '@/contexts/auth'
import {
  Cog6ToothIcon,
  HomeIcon,
  KeyIcon,
  NewspaperIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  UsersIcon,
} from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { app, logout } = useAuth()
  useEffect(() => {
    if (!app) router.push('/')
  }, [app])
  const router = useRouter()
  return (
    <main>
      <SidebarLayout
        navbar={<></>}
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <SidebarLabel className="mb-4 pl-1 uppercase font-semibold">
                {app?.name}
              </SidebarLabel>
              <SidebarSection className="max-lg:hidden">
                <SidebarItem href="/dashboard">
                  <HomeIcon />
                  <SidebarLabel>Home</SidebarLabel>
                </SidebarItem>
                <SidebarItem disabled href="/dashboard/settings">
                  <Cog6ToothIcon />
                  <SidebarLabel>Settings</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarHeader>
            <SidebarBody>
              <SidebarSection>
                <SidebarItem href="/dashboard/users">
                  <UsersIcon />
                  <SidebarLabel>Users</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/dashboard/newsletters">
                  <NewspaperIcon />
                  <SidebarLabel>Newsletters</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
              <SidebarSpacer />
              <SidebarSection>
                <SidebarItem disabled href="/support">
                  <QuestionMarkCircleIcon />
                  <SidebarLabel>Support</SidebarLabel>
                </SidebarItem>
                <SidebarItem disabled href="/changelog">
                  <SparklesIcon />
                  <SidebarLabel>Changelog</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarBody>
            <SidebarFooter className="max-lg:hidden">
              <span className="flex min-w-0 items-center gap-3">
                <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded-lg inline-flex items-center justify-center">
                  <KeyIcon className="w-6 h-6 text-black dark:text-white" />
                </div>
                <span className="min-w-0">
                  <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                    Logged in with PEM
                  </span>
                  <a
                    onClick={() => {
                      logout()
                      router.push('/')
                    }}
                    className="cursor-pointer hover:opacity-75 block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400"
                  >
                    Log out
                  </a>
                </span>
              </span>
            </SidebarFooter>
          </Sidebar>
        }
      >
        {children}
      </SidebarLayout>
    </main>
  )
}
