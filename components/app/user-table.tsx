import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/catalyst/table'
import { useAuth } from '@/contexts/auth'
import truncateAddress from '@/util/truncate'
import { useEffect, useState } from 'react'

export interface User {
  owner: string
  methods: string[]
}

export default function UserTable({ refreshCount }: { refreshCount?: number }) {
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
  }, [app, refreshCount])

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Identifier</TableHeader>
          <TableHeader>Allowed Methods</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {users
          ? users.map((user) => (
              <TableRow key={user.owner}>
                <TableCell className="font-medium">
                  {truncateAddress(user.owner)}
                </TableCell>
                <TableCell className="capitalize">
                  {user.methods.join(', ')}
                </TableCell>
              </TableRow>
            ))
          : Array.from({ length: 5 }, (v, i) => i).map((e) => (
              <TableRow key={e}>
                <TableCell>
                  <div className="bg-zinc-950/25 dark:bg-white/25 rounded-md animate-pulse w-full h-5"></div>
                </TableCell>
                <TableCell>
                  <div className="bg-zinc-950/25 dark:bg-white/25 rounded-md animate-pulse w-full h-5"></div>
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  )
}
