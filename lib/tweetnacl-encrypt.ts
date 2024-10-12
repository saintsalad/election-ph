// lib/encryption.ts
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

// Retrieve the secret key from the environment variable
const secretKeyBase64 = process.env.TWEETNACL_SECRET_KEY;

if (!secretKeyBase64) {
  throw new Error("TWEETNACL_SECRET_KEY is missing");
}

const secretKey = naclUtil.decodeBase64(secretKeyBase64);

// Encrypt and stringify before saving to the database
export const encrypt = (message: string) => {
  const nonce = nacl.randomBytes(24); // 24-byte nonce
  const messageUint8 = naclUtil.decodeUTF8(message);
  const box = nacl.secretbox(messageUint8, nonce, secretKey);

  // Stringify the encrypted data and nonce
  const encryptedData = JSON.stringify({
    nonce: naclUtil.encodeBase64(nonce),
    box: naclUtil.encodeBase64(box),
  });

  // Save `encryptedData` to your database
  return encryptedData;
};

// Retrieve and decrypt the data
export const decrypt = (encryptedData: string) => {
  // Parse the JSON string back into an object
  const { nonce, box } = JSON.parse(encryptedData);

  // Decode the Base64 strings back to Uint8Arrays
  const nonceUint8 = naclUtil.decodeBase64(nonce);
  const boxUint8 = naclUtil.decodeBase64(box);

  // Decrypt the message
  const decrypted = nacl.secretbox.open(boxUint8, nonceUint8, secretKey);

  if (!decrypted) {
    throw new Error("Failed to decrypt message");
  }

  return naclUtil.encodeUTF8(decrypted);
};
