const encoder = new TextEncoder();

type DecryptPrivateKeyParams = {
  password: string;
  encryptedPrivateKey: string;
  encryptedPrivateKeySalt: string;
  encryptedPrivateKeyIV: string;
};

const fromBase64 = (base64: string) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
};

export const decryptPrivateKey = async ({
  password,
  encryptedPrivateKey,
  encryptedPrivateKeySalt,
  encryptedPrivateKeyIV,
}: DecryptPrivateKeyParams) => {
  // derive aes key
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: fromBase64(encryptedPrivateKeySalt),
      iterations: 250000,
      hash: "SHA-256",
    },
    baseKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["decrypt"],
  );

  // decrypt private key
  const decryptedPrivateKeyBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: fromBase64(encryptedPrivateKeyIV),
    },
    aesKey,
    fromBase64(encryptedPrivateKey),
  );

  // import NON-EXTRACTABLE private key
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    decryptedPrivateKeyBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false, // NON-EXTRACTABLE
    ["decrypt"],
  );

  return privateKey;
};
