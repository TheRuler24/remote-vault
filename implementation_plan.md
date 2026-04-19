# RemoteVault: Global Device Architecture & Permissions Plan

This document outlines the architectural blueprint bridging your Web Dashboard with remote hardware (PCs, Phones) anywhere in the world. This system ensures instant presence, high reliability, and strict, granular owner controls.

## ⚠️ User Review Required
Before we build the infrastructure, please review these key technical hurdles:
> [!IMPORTANT]
> **Mobile OS Restrictions:** If you want to intercept OTPs, read SMS, or view notifications, **Android** allows this via Accessibility/Notification Listener Services. **iOS (Apple) explicitly blocks this** in the background. The mobile agent will likely need to be Android-first.
> **Bandwidth Routing:** For simple commands or reading an OTP, a central server is fine. For streaming a whole folder or remote desktop, routing traffic through our server will be slow. We must use **WebRTC (P2P)** so your browser connects *directly* to the phone/PC, completely bypassing the server for heavy data.

## Proposed System Architecture

### 1. The Core Infrastructure (The Relay Server)
To allow your web browser and your locked-down laptop to communicate when neither has a public IP address, we will build a **Backend Relay Server (Fastify/Node.js)**.
- **WebSocket Registry:** When your laptop turns on, its Agent silently connects to the Relay Server and says "I am online."
- **Signaling:** When you log into the Web Dashboard, the Relay Server links your browser session and your laptop using your authenticated STUN/TURN tokens to establish a direct P2P (Peer-to-Peer) tunnel.

### 2. Device Registration & Identity Map
Devices must cryptographically map to your `next-auth` Identity (Google/GitHub).
- The user generates a **One-Time Provisioning Key** on the dashboard.
- The user enters this key into the Agent software on their PC or Phone.
- The remote device securely binds to the User ID in the database.

### 3. Granular Control Matrix (Capabilities)
The foundation of the security model relies on the Device Agent explicitly dictating what it allows the Web Dashboard to do. Instead of giving "full access", the Agent registers with a set of Capability Flags:
- `CAP_SHELL`: Allows remote terminal/command execution (PC).
- `CAP_FILESYSTEM`: Allows viewing, downloading, and uploading files in specific paths.
- `CAP_NOTIFICATIONS`: Streams live push notifications and OTPs to the web (Android).
- `CAP_CAMERA`: Live streams device camera (WebRTC).
- `CAP_FULL_RDP`: Full remote desktop control.

The owner can individually toggle these flags *from the device itself*, ensuring that a compromised Web Session cannot arbitrarily take over a capability that the device owner disabled.

## Phased Implementation Strategy

### Phase 1: Database & Registry Schema (Prisma)
- Map `User` -> `Device` (1-to-Many).
- Map `Device` -> `Capabilities` (JSON mapping allowed permissions).
- Design `Session` to distinguish between a "Web Dashboard" session vs "Headless Agent" session.

### Phase 2: The Fastify Relay API & WebSocket Matrix
- Build the standalone Node/Fastify server.
- Implement STUN/TURN proxy logic for WebRTC.
- Create WebSocket channels (`/device-sync`, `/c2-channel`).

### Phase 3: The Client Dashboard Update
- Overhaul `/dashboard` to act as the Command & Control (C2) center.
- Fetch active devices via WebSockets.
- Conditionally render UI (File Explorer vs Terminal vs OTP Reader) based on the targeted device's `Capabilities`.

## Phase 4: Hardware Agent Development
- **Desktop Agent (Node.js):** Cross-platform system service for file IO and command execution.
- **Mobile Agent (Android):**
    - **IMEI Fingerprinting:** Use the phone's unique hardware IMEI as the permanent identity basis.
    - **Automatic Mesh Discovery (mDNS/Zeroconf):** The dashboard will "find" your phone automatically when nearby, removing manual setup.
    - **Two-Factor Phone Password:** A password set *on the phone* is required both during addition and for every remote session.

## Phase 5: Zero-Knowledge Security Hardening
To achieve absolute trust, we will implement a **Zero-Knowledge Architecture** where the Relay Server cannot see user data.
- **E2EE Handshake:** Implement Diffie-Hellman (ECDH) key exchange between browser and agent.
- **Hardware DNA:** Collect and sign messages with hashed hardware IDs (Mothelrboard Serial, principa MAC).
- **Device Quarantine:** All new nodes start in a restricted "Waiting Room" until approved by the owner from a trusted session.
- **Audit Logging:** Non-reputable local logs of every system interaction.

## Open Questions
1. **Master Password:** Should we derive client-side encryption keys from a "Vault Master Password" or automatically from your OAuth session?
2. **Mobile Constraints:** Are you comfortable focusing on Android for the mobile agent where background scraping is possible?
3. **Recovery:** Should we implement a "System Recovery Code" for cases where a device is lost?
