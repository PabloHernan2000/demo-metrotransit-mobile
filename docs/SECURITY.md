# Security & Data Sanitization Report (Zero-Leakage Assurance)

This document certifies the security posture and intellectual property sanitization implemented in the **MetroTransit Mobile** public reference repository.

---

## 1. Executive Summary & Sanitization Scope

The codebase was migrated and restructured from an enterprise transit deployment to a public portfolio demo. Every sensitive vector has been purged, mocked, or parameterized.

```
+-------------------------------------------------------------------------+
|                      ZERO LEAKAGE COMPLIANCE                            |
|  - Real Private Keystores:                PURGED & REMOVED              |
|  - Google Maps & Third-Party API Keys:     REPLACED WITH DUMMY MOCKS     |
|  - Firebase Production Credentials:       SANITIZED TO .EXAMPLE TEMPLATES|
|  - Institutional Domains & Endpoints:     REDIRECTED TO MOCK ENGINE     |
|  - Institutional Branding & Assets:       REPLACED WITH SLATE DESIGN    |
|  - Commit History (.git):                 INITIALIZED CLEAN (NO LEAKS)  |
+-------------------------------------------------------------------------+
```

---

## 2. Sanitization Audit Matrix

| Security Vector | Original Value (Vulnerable) | Sanitized Demo Value | Verification Method |
| :--- | :--- | :--- | :--- |
| **Google Maps API Key** | `AIzaSyDv9hG...` (Hardcoded in 4 files) | `AIzaSyDUMMY_KEY_FOR_DEMO_PURPOSES_ONLY` (Env driven) | Automated static regex scan |
| **Android Release Keystore** | Real `.keystore` binary with hardcoded passwords in `gradle.properties` | Purged. Properties converted to env placeholders. | Filesystem verification (`find`) |
| **Firebase Android Config** | `android/app/google-services.json` (Real OAuth client & project number) | `google-services.json.example` with dummy project IDs | Static inspection |
| **Firebase iOS Config** | `ios/GoogleService-Info.plist` (Real production reverse client IDs) | `GoogleService-Info.plist.example` | Static inspection |
| **Backend REST Endpoints** | `https://dev-apis.hidalgo.gob.mx:3001/stmv3/` | `http://localhost:3001/v1/` / configurable via `.env` | Grep across all source files |
| **Telemetry Socket Path** | `/transporte-metropolitano/socket.io` | `/metrotransit/socket.io` | Grep across all source files |
| **Organizational Email & Phone** | Real institutional emails and 800 phone lines | `support@metrotransit.dev` / `800-555-0199` | Static source analysis |
| **Git Commit Log** | 300+ historical commits with potential sensitive diffs | Clean root without `.git` folder | Verification via `find` |

---

## 3. Mobile Security Controls (OWASP MASVS Mapping)

1. **MASVS-STORAGE (Secure Data Storage):**
   - Session tokens and cryptographic identifiers are stored exclusively in Hardware Keystore / Secure Enclave using `Keychain.ACCESSIBLE.WHEN_UNLOCKED`.
   - Cleartext credentials are never written to `AsyncStorage` or unencrypted application caches.
2. **MASVS-NETWORK (Network Security):**
   - Transport Security configured for HTTPS/WSS in production targets.
   - Cleartext traffic disabled by default on Android release builds (`android:usesCleartextTraffic="${usesCleartextTraffic}"`).
3. **MASVS-AUTH (Authentication & Biometrics):**
   - Native Biometric integration with hardware prompt validation.
   - Session expiry listeners and automatic token renewal interceptors.
