'use client'

import UserTable, { User } from '@/components/app/user-table'
import { Divider } from '@/components/catalyst/divider'
import { useAuth } from '@/contexts/auth'
import { useEffect, useState } from 'react'

function Greeting() {
  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 18
        ? 'Good afternoon'
        : 'Good evening'

  return <h1 className="font-semibold text-2xl">{greeting}</h1>
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="pr-6">
      <Divider />
      <p className="font-medium mt-4 text-sm">{title}</p>
      <p className="text-4xl font-semibold mt-4">{value}</p>
    </div>
  )
}

export default function Home() {
  const { app, signMessage, publicKeyHex } = useAuth()
  const [users, setUsers] = useState<User[] | undefined>(undefined)

  useEffect(() => {
    async function fetchUsers() {
      if (!app || !publicKeyHex || !signMessage) return
      const signature = await signMessage(app.id.toString())
      const res = await fetch(
        process.env.NEXT_PUBLIC_SWIFT_API + '/notify/auth/all',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pubkey: publicKeyHex,
            signature,
          }),
        }
      )
      const data = await res.json()
      setUsers(data.authorizations)
    }
    fetchUsers()
  }, [app])

  return (
    <div>
      <Greeting />

      <h2 className="mt-8 font-semibold">Overview</h2>

      <div className="grid grid-cols-3 mt-4">
        <Stat
          title="Total users"
          value={users ? users.length.toString() : '-'}
        />
        <Stat title="Newsletters sent" value="0" />
        <Stat title="Newsletter conversion rate" value="--%" />
      </div>

      <h2 className="mt-8 font-semibold">Users</h2>
      <div className="mt-2">
        <UserTable />
      </div>
    </div>
  )
}
