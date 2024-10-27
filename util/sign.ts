import { Crypto as PFCrypto } from '@peculiar/webcrypto'
import Encoding from 'text-encoding'

export default async function signMsg(
  privateKeyBuffer: ArrayBuffer,
  message: string
) {
  const wc = new PFCrypto()

  const privateKey = await wc.subtle.importKey(
    'pkcs8',
    privateKeyBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  )

  const encoder = new Encoding.TextEncoder()
  const messageBuffer = encoder.encode(message)

  const signatureBuffer = await wc.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    messageBuffer
  )

  const signatureHex = Buffer.from(signatureBuffer).toString('hex')

  return signatureHex
}
