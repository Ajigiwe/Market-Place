# E-Procurement Marketplace: System Specification & Procurement Logic

## 1. Executive Summary: Digital Supply Chain Integration
This platform is engineered as a high-fidelity **E-Procurement Ecosystem**, facilitating seamless interaction between Tier-1 Suppliers (Sellers) and Procuring Entities (Buyers). The system logic is built around the **Strategic Sourcing** lifecycle, ensuring transaction integrity, vendor accountability, and platform-wide spend visibility.

---

## 2. Procurement Architecture & Entity Mapping

### 2.1 Vendor Management (Seller Ecosystem)
The system treats Sellers as specialized vendors within a digital supply chain.
- **Onboarding & Prequalification**: Sellers must complete a rigorous verification flow, including mandated ID formatting (`GH-xxxxxx-x`) to ensure statutory compliance and anti-fraud overhead reduction.
- **Inventory Dissemination**: Vendors manage their own catalogs with real-time stock synchronization, reducing lead-time inaccuracies.
- **Performance Monitoring**: Sellers have access to a visual dashboard to track order fulfillment rates, revenue generation, and inventory health.

### 2.2 Requisition & Acquisition (Buyer Workflow)
- **Discovery**: Real-time search and categorization allow buyers to identify goods through a high-fidelity grid system.
- **Procurement Cart**: A persistent requisition tool facilitates the staging of multiple items before final acquisition.
- **Order Lifecycle**: Transactions move through distinct states: `PENDING` (Requisitioned), `PAID` (Acquisition Finalized), and `COMPLETED` (Asset Received/Fulfilled).

---

## 3. Platform Authority & Oversight (Super Admin Logic)

The **Super Admin Dashboard** serves as the primary **Procurement Oversight Body** (POB). It provides centralized governance across the entire marketplace.

### 3.1 Global Spend Visibility
- **Total Revenue Tracking**: Real-time monitoring of all platform-wide sales volume (GTV).
- **Transaction Ledger**: A granular report of every acquisition event, ensuring complete audit trails.
- **Inspection Protocol**: Admins can deep-dive into any order to verify vendor attribution and customer authenticity.

### 3.2 Supply Chain Moderation
- **Identity & Access Management (IAM)**: Monitoring the user base with role-based split metrics (Buyers vs. Sellers).
- **Vendor Blocking (Sanctioning)**: The authority to immediately suspend a vendor or buyer's access if compliance breaches occur, using the integrated `Ban` protocol.

---

## 4. Technical Compliance & Security

### 4.1 Data Integrity
- **Persistence Layer**: Built on SQLite with Drizzle ORM to ensure ACID-compliant transactions.
- **Role-Based Access Control (RBAC)**: Secure middleware layers prevent unauthorized access to sensitive procurement data.

### 4.2 UI/UX Engineering
- **Premium Aesthetics**: Designed for executive-level clarity, featuring ultra-shrunk forms for precision and high-vibrancy accent colors for critical status monitoring.
- **Mobile Fidelity**: A 2-column mobile responsive grid ensures procurers can monitor the supply chain from any device.

---

*Verified & Validated for Deployment.*
