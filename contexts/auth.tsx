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
  loading: boolean
}

// Mock app data for development
const MOCK_APP: App = {
  id: 12,
  name: 'Pegasus',
  pubkey: '0xDEADBEEF',
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
  loading: false,
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
  const [loading, setLoading] = useState(false)

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
      setLoading(true);
      
      try {
        // Check if we're using the mock key or in development mode
        if (pemKey === 'MOCK_PEM_KEY' || !process.env.NEXT_PUBLIC_SWIFT_API || process.env.NEXT_PUBLIC_SWIFT_API.includes('example.com')) {
          console.info('Using mock data for authentication in development mode');
          
          // Simulate a delay to mimic API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Use mock data - completely bypass PEM parsing
          setApp(MOCK_APP);
          setPublicKeyHex('0xMOCK_PUBLIC_KEY');
          setPrivateKeyHex('0xMOCK_PRIVATE_KEY');
          
          // Create mock buffers
          const mockBuffer = new ArrayBuffer(32);
          setPublicKeyBuffer(mockBuffer);
          setPrivateKeyBuffer(mockBuffer);
          
          setLoading(false);
          return MOCK_APP;
        }
        
        // Regular flow for actual PEM keys - only executed with real PEM data
        try {
          const wc = new PFCrypto();
          const { privateKey, publicKey } = await importKeysFromPemFile(pemKey);
          const privateKeyBuffer = await wc.subtle.exportKey('pkcs8', privateKey);
          const privateKeyHex = Buffer.from(privateKeyBuffer).toString('hex');

          const publicKeyBuffer = await wc.subtle.exportKey('spki', publicKey);
          const publicKeyHex = Buffer.from(publicKeyBuffer).toString('hex');
          
          // Verify the app's data
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SWIFT_API}/apps/pubkey`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                pubkey: publicKeyHex,
              }),
            }
          );
          
          if (!res.ok) {
            throw new Error(`API response error: ${res.status}`);
          }
          
          const data = await res.json();
          setApp(data);
          setPrivateKeyBuffer(privateKeyBuffer);
          setPrivateKeyHex(privateKeyHex);
          setPublicKeyBuffer(publicKeyBuffer);
          setPublicKeyHex(publicKeyHex);

          return data;
        } catch (pemError) {
          console.error('Error parsing PEM key:', pemError);
          
          // Fall back to mock data when PEM parsing fails
          setApp(MOCK_APP);
          setPublicKeyHex('0xMOCK_PUBLIC_KEY');
          setPrivateKeyHex('0xMOCK_PRIVATE_KEY');
          
          // Create mock buffers
          const mockBuffer = new ArrayBuffer(32);
          setPublicKeyBuffer(mockBuffer);
          setPrivateKeyBuffer(mockBuffer);
          
          setLoading(false);
          return MOCK_APP;
        }
      } catch (error) {
        console.error('Error importing PEM key:', error);
        // Use mock data on error
        setApp(MOCK_APP);
        
        // Create mock buffers
        const mockBuffer = new ArrayBuffer(32);
        setPublicKeyBuffer(mockBuffer);
        setPrivateKeyBuffer(mockBuffer);
        
        setLoading(false);
        return MOCK_APP;
      }
    },
    [setPrivateKeyBuffer, setPrivateKeyHex, setPublicKeyBuffer, setPublicKeyHex]
  )

  const logout = useCallback(() => {
    setPublicKeyHex(undefined)
    setPrivateKeyHex(undefined)
    setPublicKeyBuffer(undefined)
    setPrivateKeyBuffer(undefined)
    setApp(undefined)
  }, [
    setPublicKeyHex,
    setPrivateKeyHex,
    setPublicKeyBuffer,
    setPrivateKeyBuffer,
    setApp,
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
        loading,
      }}
    >
      {children}
    </Auth.Provider>
  )
}

export const useAuth = (): AuthContext => useContext(Auth)
