import { importKeysFromPemFile } from '@/util/keys'
import signMsg from '@/util/sign'
import { Crypto as PFCrypto } from '@peculiar/webcrypto'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'

export interface App {
  id: number
  name: string
  pubkey: string
}

export interface AuthContext {
  app: App | undefined
  publicKeyHex: string | undefined
  privateKeyHex: string | undefined
  publicKeyBuffer: ArrayBuffer | undefined
  privateKeyBuffer: ArrayBuffer | undefined
  signMessage: (message: string) => Promise<string | undefined>
  importPemKey: (pemKey: string) => Promise<App | undefined>
  logout: () => void
}

export const Auth = createContext<AuthContext>({
  app: undefined,
  publicKeyHex: undefined,
  privateKeyHex: undefined,
  publicKeyBuffer: undefined,
  privateKeyBuffer: undefined,
  signMessage: async () => undefined,
  importPemKey: async () => undefined,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [app, setApp] = useState<App | undefined>(undefined)
  const [publicKeyHex, setPublicKeyHex] = useState<string | undefined>(
    undefined
  )
  const [privateKeyHex, setPrivateKeyHex] = useState<string | undefined>(
    undefined
  )
  const [publicKeyBuffer, setPublicKeyBuffer] = useState<
    ArrayBuffer | undefined
  >(undefined)
  const [privateKeyBuffer, setPrivateKeyBuffer] = useState<
    ArrayBuffer | undefined
  >(undefined)

  const signMessage = useCallback(
    async (message: string) => {
      if (!privateKeyBuffer) return undefined

      const signatureHex = await signMsg(privateKeyBuffer, message)
      return signatureHex
    },
    [privateKeyBuffer]
  )

  const importPemKey = useCallback(
    async (pemKey: string): Promise<App | undefined> => {
      if (!process.env.NEXT_PUBLIC_SWIFT_API)
        throw new Error('Swift API URL missing from environment')
      const wc = new PFCrypto()

      const { privateKey, publicKey } = await importKeysFromPemFile(pemKey)
      const privateKeyBuffer = await wc.subtle.exportKey('pkcs8', privateKey)
      const privateKeyHex = Buffer.from(privateKeyBuffer).toString('hex')

      const publicKeyBuffer = await wc.subtle.exportKey('spki', publicKey)
      const publicKeyHex = Buffer.from(publicKeyBuffer).toString('hex')

      // Verify the app's data
      const res = await fetch(
        process.env.NEXT_PUBLIC_SWIFT_API + '/apps/pubkey',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pubkey: publicKeyHex,
          }),
        }
      )
      const data = await res.json()

      setApp(data)
      setPrivateKeyBuffer(privateKeyBuffer)
      setPrivateKeyHex(privateKeyHex)
      setPublicKeyBuffer(publicKeyBuffer)
      setPublicKeyHex(publicKeyHex)

      return data
    },
    [setPrivateKeyBuffer, setPrivateKeyHex, setPublicKeyBuffer, setPublicKeyHex]
  )

  const logout = useCallback(() => {
    setPublicKeyHex(undefined)
    setPrivateKeyHex(undefined)
    setPublicKeyBuffer(undefined)
    setPrivateKeyBuffer(undefined)
  }, [
    setPublicKeyHex,
    setPrivateKeyHex,
    setPublicKeyBuffer,
    setPrivateKeyBuffer,
  ])

  return (
    <Auth.Provider
      value={{
        app,
        publicKeyHex,
        privateKeyHex,
        publicKeyBuffer,
        privateKeyBuffer,
        signMessage,
        importPemKey,
        logout,
      }}
    >
      {children}
    </Auth.Provider>
  )
}

export const useAuth = (): AuthContext => useContext(Auth)
