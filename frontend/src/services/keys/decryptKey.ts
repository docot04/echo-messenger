const encoder = new TextEncoder();

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
  salt,
  iv,
}: {
  password: string;
  encryptedPrivateKey: string;
  salt: string;
  iv: string;
}) => {
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
      salt: fromBase64(salt),
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
      iv: fromBase64(iv),
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
