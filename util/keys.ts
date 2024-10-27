import { Crypto as PFCrypto } from '@peculiar/webcrypto'

function pemToArrayBuffer(pem: string) {
  const base64 = pem.replace(
    /(-----(BEGIN|END) (PUBLIC|PRIVATE) KEY-----|\s)/g,
    ''
  )
  const binaryString = window.atob(base64)
  const buffer = new ArrayBuffer(binaryString.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < binaryString.length; i++) {
    view[i] = binaryString.charCodeAt(i)
  }
  return buffer
}

export async function importKeysFromPemFile(content: string) {
  const wc = new PFCrypto()
  // Extract the private and public key sections from the PEM content
  const privateKeyPem = content.match(
    /-----BEGIN PRIVATE KEY-----[\s\S]+?-----END PRIVATE KEY-----/
  )![0]
  const publicKeyPem = content.match(
    /-----BEGIN PUBLIC KEY-----[\s\S]+?-----END PUBLIC KEY-----/
  )![0]

  // Convert each PEM section to ArrayBuffer
  const privateKeyBuffer = pemToArrayBuffer(privateKeyPem)
  const publicKeyBuffer = pemToArrayBuffer(publicKeyPem)

  // Import the private key
  const privateKey = await wc.subtle.importKey(
    'pkcs8',
    privateKeyBuffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['decrypt']
  )

  // Import the public key
  const publicKey = await wc.subtle.importKey(
    'spki',
    publicKeyBuffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  )

  return { privateKey, publicKey }
}
