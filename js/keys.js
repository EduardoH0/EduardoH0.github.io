

export async function generateKeyPair() {
    // Use P-256 curve for ECC (shorter keys)
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256",
        },
        true, // extractable, so we can export the keys
        ["sign", "verify"]
    );

    // Export the private key in a format that can be shared
    const privateKey = await window.crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
    );

    // Export the public key
    const publicKey = await window.crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey
    );

    // Convert the keys to Base64 for display or storage
    const privateKeyBase64 = arrayBufferToBase64(privateKey);
    const publicKeyBase64 = arrayBufferToBase64(publicKey);

    console.log("Private Key:", privateKeyBase64);
    console.log("Public Key:", publicKeyBase64);

    return { privateKeyBase64, publicKeyBase64 };
}

// Helper function to convert an ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export async function signData(privateKeyBase64, data) {
    // Convert the base64 private key back to ArrayBuffer
    const privateKeyBuffer = base64ToArrayBuffer(privateKeyBase64);

    // Import the private key for signing
    const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        privateKeyBuffer,
        {
            name: "ECDSA",
            namedCurve: "P-256",
        },
        false,
        ["sign"]
    );

    // Sign the data
    const signature = await window.crypto.subtle.sign(
        {
            name: "ECDSA",
            hash: { name: "SHA-256" },
        },
        privateKey,
        new TextEncoder().encode(data) // data to be signed
    );

    return arrayBufferToBase64(signature);
}

export async function verifyData(publicKeyBase64, data, signatureBase64) {
    // Convert the base64 public key and signature back to ArrayBuffer
    const publicKeyBuffer = base64ToArrayBuffer(publicKeyBase64);
    const signatureBuffer = base64ToArrayBuffer(signatureBase64);

    // Import the public key for verification
    const publicKey = await window.crypto.subtle.importKey(
        "spki",
        publicKeyBuffer,
        {
            name: "ECDSA",
            namedCurve: "P-256",
        },
        false,
        ["verify"]
    );

    // Verify the signature
    const isValid = await window.crypto.subtle.verify(
        {
            name: "ECDSA",
            hash: { name: "SHA-256" },
        },
        publicKey,
        signatureBuffer,
        new TextEncoder().encode(data) // original data
    );

    console.log("Is valid:", isValid);
    return isValid;
}

// Helper function to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
