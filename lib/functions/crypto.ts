import crypto from "crypto";

const algorithm = "aes-256-gcm";
const secretKey = crypto.randomBytes(32); // Ensure to securely store this key
const ivLength = 16; // For AES, this is always 16

interface EncryptedData {
  iv: string;
  content: string;
  tag: string;
}

export function encryptJson(jsonData: object): EncryptedData {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const jsonString = JSON.stringify(jsonData);

  let encrypted = cipher.update(jsonString, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");

  return {
    iv: iv.toString("hex"),
    content: encrypted,
    tag,
  };
}

export function decryptJson<T>(encryptedData: EncryptedData): T {
  const iv = Buffer.from(encryptedData.iv, "hex");
  const tag = Buffer.from(encryptedData.tag, "hex");
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encryptedData.content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted) as T;
}
