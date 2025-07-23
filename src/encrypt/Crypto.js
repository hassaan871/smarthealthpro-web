import { v4 as uuidv4 } from "uuid";
import api from "../api/axiosInstance";

export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"]
  );

  return {
    publicKey: await exportKey(keyPair.publicKey),
    privateKey: await exportKey(keyPair.privateKey),
  };
}

export async function generatePreKeys(count = 10) {
  const preKeys = [];

  for (let i = 0; i < count; i++) {
    const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"]
    );

    preKeys.push({
      id: uuidv4(),
      publicKey: await exportKey(publicKey),
      privateKey: await exportKey(privateKey),
    });
  }

  return preKeys;
}

export async function uploadPublicKeys(identityPublicKey, preKeys) {
  await api.post("/api/keys/upload", {
    identityPublicKey,
    preKeys: preKeys.map((p) => ({
      id: p.id,
      publicKey: p.publicKey,
    })),
  });
}

async function exportKey(key) {
  const exported = await window.crypto.subtle.exportKey("jwk", key);
  return exported;
}
