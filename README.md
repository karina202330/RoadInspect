# 🛣️ RoadVision AI — Autonomous Road Surface Inspection & Infrastructure Asset Management

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> An intelligent, end-to-end computer vision and spatial intelligence platform designed for municipal corporations, highway authorities (NHAI), and civil infrastructure engineers to detect, classify, track, and remediate road surface distress in real time.

---

## 📌 Executive Summary

Manual road surveying is hazardous, labor-intensive, and subjective. **RoadVision AI** transforms highway inspection by applying deep learning algorithms to video and high-resolution imagery captured by inspection vehicles and drones. The system automatically segments defects, computes Pavement Condition Index (PCI) ratings in accordance with **ASTM D6433**, maps defects to exact road chainages, and generates actionable work orders for maintenance crews.

---

## ✨ Key Features

### 🔍 1. AI-Driven Defect Detection & Localization
- **Multi-Class Distress Segmentation**: Automatically identifies and tracks:
  - Cavity defects & potholes
  - Longitudinal & transverse thermal cracks
  - Fatigue / Alligator cracking
  - Wheel-path rutting & corrugation
  - Shoulder damage & road edge drop-offs
  - Lane marking deterioration & surface degradation
- **Normalized Bounding Box Precision**: High-accuracy spatial localization with bounding box annotations and confidence scores.

### 📊 2. Pavement Condition Index (PCI) & Severity Scoring
- Real-time scoring using standardized ASTM D6433 distress deduct curves.
- Multi-tier severity classification (**Critical**, **High**, **Medium**, **Low**).
- Defect impact quantification on overall road health and asset longevity.

### 📍 3. Chainage Progression & Spatial Timeline
- High-fidelity linear referencing (**KM 00.000 to KM XX.XXX**).
- Lane-specific assignment (e.g., *Lane 1 Shoulder*, *Lane 2 Middle*).
- Interactive timeline scrubber to inspect defects along sequential distance intervals.

### 🔄 4. Comparative Inspection Viewer
- Side-by-side and split-screen overlay to contrast historical surveys against current scans.
- Visual verification of repair patch effectiveness and post-monsoon degradation tracking.

### 🛠️ 5. Defect Register & Maintenance Work Order Dispatch
- Comprehensive defect register with search, filter, and sorting by urgency and severity.
- Detailed inspection drawer with:
  - Repair recommendations (e.g., polymer sealant injection, cold-mix asphalt infill)
  - Estimated repair costs (in ₹ INR)
  - Crew dispatch assignment (e.g., NHAI Rapid Response Units)
  - Status lifecycle: `New` ➔ `Verified` ➔ `Assigned` ➔ `In Progress` ➔ `Resolved`

### 🏢 6. Infrastructure Asset Registry
- Centralized inventory of highways, expressways, flyovers, bridges, and culverts.
- Structural health monitoring, historical audit logs, and maintenance expenditure logs.

### 📈 7. Executive Analytics & Dynamic Dashboards
- Interactive condition distribution donut charts (Recharts).
- Defect density per kilometer heatmap.
- Budget allocation forecasts and priority matrix.

### 📑 8. Automated Engineering Reports
- Instant compilation of inspection dossiers.
- Executive summary, distress breakdown, cost estimates, and digital engineer sign-off export.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components) |
| **Language** | [TypeScript 5.6](https://www.typescriptlang.org/) (Strict type-safety) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [PostCSS](https://postcss.org/) |
| **Component Library** | Radix UI primitives & custom accessible design tokens |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **State Management** | React Context API (`RoadVisionContext`) with persistent store |
| **AI Inference Architecture** | Modular AI Provider interface (`lib/ai/provider.ts`) |

---

## 📂 Project Structure

```plaintext
RoadInspect/
├── app/
│   ├── analysis/             # AI survey analysis & chainage timeline
│   │   └── [id]/             # Single inspection deep-dive
│   ├── analytics/            # Executive charts & defect trends
│   ├── assets/               # Road asset inventory & metadata
│   │   └── [id]/             # Asset details & defect logs
│   ├── dashboard/            # Overview KPIs & active alerts
│   ├── defects/              # Centralized defect register
│   ├── inspections/          # Inspection batch manager
│   │   ├── [id]/             # Inspection review & comparative viewer
│   │   └── new/              # Upload & schedule new inspection scan
│   ├── login/                # Authentication page
│   ├── notifications/        # Real-time inspection alert center
│   ├── reports/              # Engineering audit reports
│   │   └── [id]/             # Full report view & PDF export
│   ├── settings/             # System configuration & AI thresholds
│   ├── globals.css           # Global typography & Tailwind styling
│   ├── layout.tsx            # Root application shell & context provider
│   └── page.tsx              # Root route entry
├── components/
│   ├── analysis/
│   │   ├── AIProcessingModal.tsx     # Batch inference simulation modal
│   │   └── ChainageTimeline.tsx      # Linear road distance timeline
│   ├── dashboard/
│   │   └── RoadConditionDonut.tsx    # PCI distribution chart
│   ├── defects/
│   │   └── DefectDetailDrawer.tsx    # Slide-over detail drawer
│   ├── inspection/
│   │   └── ComparativeImageViewer.tsx# Split-screen before/after viewer
│   └── layout/
│       ├── AppLayout.tsx             # Master page wrapper
│       ├── Sidebar.tsx               # Primary navigation
│       ├── Topbar.tsx                # Breadcrumbs, search & quick actions
│       └── ToastContainer.tsx        # Notification toast dispatch
├── lib/
│   ├── ai/
│   │   ├── mockProvider.ts           # Realistic AI inference simulation
│   │   └── provider.ts               # Abstract AI inspection contract
│   ├── context/
│   │   └── RoadVisionContext.tsx     # Global application state
│   ├── mock/
│   │   └── data.ts                   # Comprehensive road distress mock data
│   └── utils.ts                      # Class merging & formatters
├── types/
│   └── index.ts                      # Strict TypeScript interfaces
├── next.config.mjs                   # Next.js build configuration
├── tailwind.config.js                # Custom color palettes & animations
└── tsconfig.json                     # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher (or `pnpm` / `yarn`)
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/karina202330/RoadInspect.git
   cd RoadInspect
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to access the RoadVision AI dashboard.

### Building for Production

```bash
npm run build
npm run start
```

---

## 🚦 Defect Severity Taxonomy

| Severity | Color Code | Response Time | Typical Defects |
|---|---|---|---|
| **Critical** | `🔴 Red` | Immediate (24-48 hrs) | Deep potholes (>50mm), major pavement collapse, severe rutting |
| **High** | `🟠 Orange` | Scheduled (7 days) | Wide transverse fractures, extensive alligator cracking, edge drop-off |
| **Medium** | `🟡 Amber` | Routine (30 days) | Longitudinal cracks, moderate surface ravelling, block cracking |
| **Low** | `🟢 Green` | Preventative (90 days) | Hairline fractures, minor lane paint fading, superficial weathering |

---

## 🗺️ Application Routes

- `/dashboard` — Master command center, KPIs, road condition summary.
- `/inspections` — Active and completed road scan batches.
- `/inspections/new` — Create scan, upload video/imagery, configure AI confidence.
- `/inspections/[id]` — Detailed image inspection with bounding boxes.
- `/analysis` — Chainage timeline & spatial progression view.
- `/assets` — Highway and arterial road asset database.
- `/defects` — Defect registry with filtering, status change, and dispatching.
- `/analytics` — PCI trends, distress distribution, and predictive maintenance.
- `/reports` — Formal engineering reports ready for export.
- `/notifications` — System alerts, critical defect notifications.
- `/settings` — Model parameters, confidence threshold adjustment, system preferences.

---

## 👤 Author

Developed by **[karina202330](https://github.com/karina202330)**.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
