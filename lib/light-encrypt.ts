const shiftAmount = 3;

// Encrypt function
export const encrypt = (text: string): string => {
  let encryptedText = "";
  for (let i = 0; i < text.length; i++) {
    // Shift character and concatenate to the result
    encryptedText += String.fromCharCode(text.charCodeAt(i) + shiftAmount);
  }
  return encryptedText;
};

// Decrypt function
export const decrypt = (encryptedText: string): string => {
  let decryptedText = "";
  for (let i = 0; i < encryptedText.length; i++) {
    // Shift character back and concatenate to the result
    decryptedText += String.fromCharCode(
      encryptedText.charCodeAt(i) - shiftAmount
    );
  }
  return decryptedText;
};
