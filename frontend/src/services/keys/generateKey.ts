const encoder = new TextEncoder();

const toBase64 = (buffer: ArrayBuffer | Uint8Array) => {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
};

export const generateEncryptedKeyPair = async (password: string) => {
  // generate rsa keypair
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

  // export keys
  const publicKeyBuffer = await crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey,
  );
  const privateKeyBuffer = await crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey,
  );

  // generate salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // derive aes key from password
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
      salt,
      iterations: 250000,
      hash: "SHA-256",
    },
    baseKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt"],
  );

  // encrypt private key
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedPrivateKey = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    aesKey,
    privateKeyBuffer,
  );

  // return everything already serialized
  return {
    publicKey: toBase64(publicKeyBuffer),
    encryptedPrivateKey: toBase64(encryptedPrivateKey),
    encryptedPrivateKeySalt: toBase64(salt),
    encryptedPrivateKeyIV: toBase64(iv),
  };
};
