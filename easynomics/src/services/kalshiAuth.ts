import * as crypto from "crypto";

/**
 * Loads the private key from the environment variable
 * @returns {crypto.KeyObject} - the private key
 */
function loadPrivateKeyFromEnv() {
  const keyData = process.env.PRIVATE_KEY;
  
  if (!keyData) {
    throw new Error("Private key not found in environment variables");
  }

  const keyDataFormatted = keyData.split(String.raw`\n`).join('\n');

  const privateKey = crypto.createPrivateKey({
    key: keyDataFormatted,
    format: "pem",
  });

  return privateKey;
}

/**
 * Signs the text with the private key
 * @param privateKey - the private key
 * @param text - the text to sign
 * @returns {string} - the signature
 */
function signPssText(privateKey: crypto.KeyObject, text: string): string {
  const message = Buffer.from(text, "utf-8");

  try {
    const signature = crypto.sign("sha256", message, {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
    });

    return signature.toString("base64");
  } catch (error) {
    throw new Error("RSA sign PSS failed: " + (error as Error).message);
  }
}

/**
 * Gets the current timestamp string
 * @returns {string} - the timestamp string
 */
function getCurrentTimestampStr(): string {
  const currentTime = new Date();
  const currentTimeMilliseconds = currentTime.getTime();

  return currentTimeMilliseconds.toString();
}

export { loadPrivateKeyFromEnv, signPssText, getCurrentTimestampStr };
