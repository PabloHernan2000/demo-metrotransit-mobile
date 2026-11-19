# MetroTransit Architecture Blueprint

This document details the architectural design, patterns, and security guarantees implemented in the **MetroTransit Mobile** reference client.

---

## 1. Architectural Topology

MetroTransit adheres to a decoupled, multi-tiered frontend architecture optimized for low-latency telemetry updates, zero main-thread jank, and cryptographic isolation of sensitive credentials:

```mermaid
flowchart TD
    subgraph UI ["Presentation Layer (React Native 0.87 / React 19)"]
        Screens["Screens (Map, Routes, Stations, Auth)"]
        Components["Stateless UI Components (Markers, Modals, Buttons)"]
    end

    subgraph State ["Application State & Coordination"]
        AppConfig["AppConfigContext (Theme, Feature Flags, System Alerts)"]
        Hooks["Domain Hooks (useTrackingLocations, useBiometric, useAppConfig)"]
    end

    subgraph Infrastructure ["Infrastructure & Core Services"]
        SocketService["WebSocket Telemetry Engine (Socket.io Client)"]
        CacheService["CacheService (Cache-Aside with TTL via AsyncStorage)"]
        SecureStorage["Keychain Storage Tier (Hardware Keystore / Secure Enclave)"]
        RestGateway["REST Client (Fetch Gateway)"]
    end

    subgraph External ["External Services / Mock Infrastructure"]
        MockServer["Mock Telemetry & REST Server (:3001)"]
        GoogleMaps["Google Maps SDK (Vector Tiles & Polylines)"]
    end

    Screens --> Hooks
    Screens --> Components
    Hooks --> AppConfig
    Hooks --> SocketService
    Hooks --> CacheService
    Hooks --> SecureStorage
    Hooks --> RestGateway

    SocketService <-->|WSS / Polling Fallback| MockServer
    RestGateway <-->|HTTP/2 JSON| MockServer
    Screens -.->|Native Rendering| GoogleMaps
```

---

## 2. Core Architectural Patterns

### 2.1 Real-Time Telemetry Streaming (WebSocket with Reconnection Policy)
Vehicle tracking uses a persistent, event-driven WebSocket pipe managed through `createTrackingSocket`. It features automated reconnection with exponential backoff and transparent transport fallback (`websocket` $\to$ `polling`).

```mermaid
sequenceDiagram
    autonumber
    participant App as React Native Client (useTrackingLocations)
    participant Socket as Socket.io Engine
    participant Server as Mock Telemetry Gateway (:3001)

    App->>Socket: connect(baseUrl, token, path="/metrotransit/socket.io")
    Socket->>Server: Handshake (Transport: WebSocket)
    Server-->>Socket: Connection ACK + Session ID
    Socket-->>App: on("connect")

    Server->>Socket: emit("vehicles:snapshot", initialVehicleList)
    Socket-->>App: setVehicles(initialVehicleList)

    loop High-Frequency Jitter Broadcast (~3s interval)
        Server->>Socket: emit("vehicles:update", updatedCoordinates)
        Socket-->>App: updateVehicleMarkers(smoothInterpolation)
    end

    alt Network Interruption
        Server--xSocket: Connection Lost
        Socket-->>App: on("disconnect")
        Socket->>Socket: Exponential Backoff (1000ms..5000ms)
        Socket->>Server: Reconnection Handshake (Fallback: Polling)
        Server-->>Socket: Reconnected
        Socket-->>App: on("reconnect")
    end
```

---

### 2.2 Dual-Tier Storage (Cryptographic Keystore vs Local Storage)
To satisfy rigorous cybersecurity benchmarks (OWASP MASVS / Mobile Application Security), MetroTransit segregates data into two distinct tiers:

1. **Hardware-Backed Cryptographic Tier (`react-native-keychain`):**
   - Stores session tokens, JWTs, and biometric unlock flags.
   - Enforces `Keychain.ACCESSIBLE.WHEN_UNLOCKED` (iOS Secure Enclave / Android Keystore Provider).
2. **Non-Sensitive Key-Value Tier (`@react-native-async-storage/async-storage`):**
   - Stores non-sensitive UI preferences (maintenance banners, tutorial completion flags, theme overrides).

```mermaid
sequenceDiagram
    autonumber
    participant Caller as App / Service Caller
    participant StorageRouter as keychainStorage.ts
    participant Keychain as OS Secure Enclave / Keystore
    participant AsyncStore as Local AsyncStorage

    Caller->>StorageRouter: setSecureItem(serviceKey, payload)
    alt serviceKey in NON_SENSITIVE_SERVICES
        StorageRouter->>AsyncStore: setItem(serviceKey, payload)
        AsyncStore-->>Caller: void
    else Sensitive Credential / Token
        StorageRouter->>Keychain: setGenericPassword(serviceKey, payload, WHEN_UNLOCKED)
        Keychain-->>Caller: void
    end
```

---

### 2.3 Cache-Aside Pattern with Time-To-Live (TTL)
The `CacheService` encapsulates offline data retrieval and network request suppression:

```mermaid
sequenceDiagram
    autonumber
    participant Hook as Domain Hook (e.g. useEstaciones)
    participant Cache as CacheService
    participant Storage as AsyncStorage
    participant API as REST Gateway

    Hook->>Cache: get(cacheKey, allowExpired=false)
    Cache->>Storage: getItem(cacheKey)
    alt Cache Hit & Date.now() < entry.expiresAt
        Storage-->>Cache: JSON { data, expiresAt }
        Cache-->>Hook: Cached Data (Immediate Render)
    else Cache Miss or Expired
        Storage-->>Cache: null or expired entry
        Cache-->>Hook: null
        Hook->>API: fetchLatestData()
        API-->>Hook: Fresh Remote Response
        Hook->>Cache: set(cacheKey, freshData, ttlMs=3600000)
        Cache->>Storage: setItem(cacheKey, JSON)
    end
```

---

## 3. Technology Stack & Runtime Specifications

| Category | Component / Library | Specification / Version |
| :--- | :--- | :--- |
| **Framework** | React Native | `0.87.1` (Fabric / New Architecture Enabled) |
| **Runtime Engine** | React / Hermes | React `19.2.3` / Hermes Engine |
| **Language** | TypeScript | `6.0.3` (Strict Mode) |
| **Navigation** | React Navigation | Native Stack `7.21` |
| **Geospatial & Maps** | react-native-maps | `1.29.11` (Google Maps Provider) |
| **Telemetry / Sockets** | socket.io-client | `4.8.4` (WSS / Polling dual mode) |
| **Secure Enclave** | react-native-keychain | `10.0.0` (Hardware Keystore / FaceID / TouchID) |
| **Notifications** | @notifee / @react-native-firebase | Background & Foreground Push Processing |
| **Mock Backend** | Node.js Express / Socket.io | Containerized Mock Telemetry Gateway |
