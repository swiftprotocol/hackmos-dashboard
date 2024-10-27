'use client'

import UserTable from '@/components/app/user-table'
import { ArrowPathIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

export default function Users() {
  const [refreshCount, setRefreshCount] = useState(0)
  function refreshUserTable() {
    setRefreshCount(refreshCount + 1)
  }

  return (
    <main>
      <div className="flex justify-between items-start">
        <h1 className="font-semibold text-2xl">Users</h1>
        <a
          onClick={refreshUserTable}
          className="bg-transparent cursor-pointer p-2 hover:bg-zinc-950/10 dark:hover:bg-white/10 rounded-md"
        >
          <ArrowPathIcon className="h-6 w-6 text-zinc-950 dark:text-white" />
        </a>
      </div>
      <div className="mt-4">
        <UserTable refreshCount={refreshCount} />
      </div>
    </main>
  )
}
