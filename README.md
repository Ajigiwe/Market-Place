# MarketPlace: Premium E-Procurement Solution

A high-fidelity, B2B2C marketplace platform designed for professional supply chain management and digital procurement. Built with **Next.js 15**, **Drizzle ORM**, and a premium **Authority-themed** UI.

## 🚀 Key Features

### 1. Procurement Oversight (Super Admin)
- **Global Spend Monitor**: Track platform-wide revenue and transaction volume in real-time.
- **Identity Management**: Monitor the entire user base (Buyers & Sellers) with granular roles.
- **Sanctioning Protocol**: Instantly block/unblock accounts to ensure platform integrity and security.
- **Global Order Inspection**: Deep-dive into any transaction for vendor attribution and audit trails.

### 2. Strategic Sourcing (Seller Flow)
- **Prequalified Onboarding**: Mandatory ID verification (GH-format) for all vendors.
- **Supply Metrics Dashboard**: Professional stat cards for active inventory, order fulfillment, and revenue health.
- **Inventory Ledger**: Complete control over digital and physical supply catalogs.

### 3. Smart Acquisition (Buyer Flow)
- **High-Fidelity Discovery**: 2-column mobile-responsive grid for efficient product sourcing.
- **Staging & Requisition**: Advanced cart system for multi-item acquisition.
- **Order Tracking**: Complete visibility into requisition states from `PENDING` to `COMPLETED`.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Database**: SQLite with Drizzle ORM
- **Auth**: NextAuth.js v5 (Beta) with RBAC
- **Styling**: Vanilla CSS with high-vibrancy accent protocols
- **Icons**: Lucide React

## 📄 Documentation

For a detailed breakdown of the platform's operational logic, please refer to:
- [SYSTEM_SPECIFICATION.md](./SYSTEM_SPECIFICATION.md): Frames the marketplace through **Procurement Logic** and enterprise sourcing standards.

## 🏁 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   ```bash
   npx drizzle-kit push
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

---
*Built for Scale. Engineered for Authority.*
