const { CryptoVault } = require('./crypto');
require('dotenv').config();
const si = require('systeminformation');
const io = require('socket.io-client');
const RELAY_URL = process.env.RELAY_URL || 'http://localhost:3001';
const PROVISIONING_KEY = process.env.PROVISIONING_KEY;

let sessionKey = null;
let localKeyPair = null;

if (!PROVISIONING_KEY) {
    console.error('CRITICAL ERROR: No PROVISIONING_KEY found in .env');
    process.exit(1);
}

console.log('--- REMOTE VAULT AGENT v1.0.0 (SECURE) ---');

const socket = io(RELAY_URL, {
    transports: ['websocket'],
    reconnection: true
});

socket.on('connect', async () => {
    console.log('Successfully connected to Relay Server.');
    
    // 1. Generate local ECDH keys for ZK-Tunnel
    localKeyPair = await CryptoVault.generateKeyPair();
    const publicKeyStr = await CryptoVault.exportPublicKey(localKeyPair.publicKey);

    // 2. Get Hardware Identity (DNA)
    const system = await si.uuid();
    const hardwareHash = system.os; // Using OS UUID as simple fingerprint

    console.log(`Initiating Secure Handshake [HWID: ${hardwareHash}]...`);
    
    socket.emit('device:handshake', { 
        provisioningKey: PROVISIONING_KEY,
        hardwareHash: hardwareHash,
        type: 'PC'
    });
});

socket.on('handshake:success', (data) => {
    console.log(`✅ Handshake Verified! Node identity bound.`);
    console.log(`System Status: QUARANTINE: ${data.isApproved ? 'CLEARED' : 'PENDING APPROVAL'}`);
});

// ZERO-KNOWLEDGE HANDSHAKE: Handle web-client availability
socket.on('pair:available', async (data) => {
    if (!localKeyPair) return;

    console.log(`Exchanging keys with Web Console: ${data.webId}`);
    
    // 1. Import remote public key
    const remotePubKey = await CryptoVault.importPublicKey(data.publicKey);
    
    // 2. Derive shared secret
    sessionKey = await CryptoVault.deriveSessionKey(localKeyPair.privateKey, remotePubKey);
    
    // 3. Send back our public key to finish the exchange
    const myPubKeyStr = await CryptoVault.exportPublicKey(localKeyPair.publicKey);
    socket.emit('relay:tunnel', {
        targetId: data.webId,
        payload: { deviceId: PROVISIONING_KEY, publicKey: myPubKeyStr } // Relay uses deviceId/room
    });

    console.log(`✅ Secure E2EE Tunnel Ready.`);
});

// ZERO-KNOWLEDGE RELAY: Handle encrypted commands
socket.on('relay:receive', async (data) => {
    if (!sessionKey) return;

    try {
        const decrypted = await CryptoVault.decrypt(data.payload, sessionKey);
        const command = JSON.parse(decrypted);
        console.log(`Secure Signal Received: [${command.cmd}]`);
        
        // Execute command logic...
        const result = await handleCommand(command.cmd, command.params);

        // Encrypt and send back
        const encryptedResult = await CryptoVault.encrypt(JSON.stringify(result), sessionKey);
        socket.emit('relay:tunnel', {
            targetId: data.from,
            payload: encryptedResult
        });

    } catch (err) {
        console.error('Decryption/Execution Failed:', err.message);
    }
});

async function handleCommand(cmd, params) {
    switch (cmd) {
        case 'sys:info':
            const cpu = await si.cpu();
            const os = await si.osInfo();
            return { cpu: `${cpu.manufacturer} ${cpu.brand}`, os: `${os.distro}` };
        case 'ping':
            return "PONG";
        default:
            return { error: 'Unknown command' };
    }
}
