# 🎨 AdventureNexus Frontend

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=24&pause=1000&color=F43F5E&center=false&vCenter=true&width=600&lines=Modern+React+18+UI;GSAP+Powered+Animations;Responsive+Design;Interactive+Globe+Visualization;Component+Rich+Architecture)](https://git.io/typing-svg)

---

<!-- Tech Stack Badges -->
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Shadcn/UI](https://img.shields.io/badge/Shadcn%2FUI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)

The **AdventureNexus Client** is a cutting-edge web interface designed to immerse users in the travel planning process. It combines the speed of **Vite**, the utility of **Tailwind CSS**, and the motion of **GSAP** to create a fluid, app-like experience.

---

## ✨ Advanced UI Features

| Component | Description | Tech Stack |
| :--- | :--- | :--- |
| **Shared Plan Tabs**| Multi-tab interface (Highlights, Map, Gallery, Stays) for a comprehensive trip view. | `Framer Motion`, `Lucide` |
| **Interactive Map** | Real-time map visualization of destinations and highlights. | `Mapbox` / `Leaflet` |
| **Image Gallery** | Stunning masonry grid layout for destination visuals with zoom functionality. | `React Photo Album` |
| **Bento Grid** | A modern, grid-based layout for displaying features and travel stats. | `CSS Grid`, `Framer Motion` |
| **Interactive Globe** | A stunning 3D globe visualization that users can rotate. | `cobe`, `React Spring` |
| **Velocity Scroll** | Text and elements that react to scroll speed for a dynamic feel. | `ScrollTrigger`, `GSAP` |
| **Card Sliders** | Smooth, gesture-friendly carousels for destinations. | `Embla Carousel` |
| **Smart Forms** | Auto-completing fields for budgets, dates, and preferences. | `React Hook Form`, `Zod` |

---

## 📂 Comprehensive Project Structure

```text
frontend/src
├── assets/             # Static Assets (Images, Icons)
├── components/         # Reusable UI Blocks
│   ├── ui/             # Shadcn Primitive Components (Button, Input, etc.)
│   ├── demo/           # Feature-specific demos (Globe, Charts)
│   └── ...             # Layout Components (Hero, Navbar)
├── context/            # Global State Logic
│   └── useTheme.js     # Dark/Light mode context
├── hooks/              # Custom React Hooks
│   ├── use-toast.js    # Toast notification logic
│   └── ...
├── lib/                # Utilities & Helpers
│   ├── utils.js        # Tailwind class merger (cn)
│   └── api.js          # Axios instance configuration
├── pages/              # Application Routes
│   ├── Home/           # Landing Page
│   ├── Search/         # Smart Search Logic
│   └── Dashboard/      # User Plan Management
├── store/              # Zustand State Store
│   └── usePlanStore.js # Global state for current travel plan
└── App.jsx             # Root Component with Routes
```

---

## 🚀 Detailed Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher is required.
- **Package Manager**: We recommend `npm` or `pnpm`.

### Environment Configuration
Create a `.env` file in the `frontend` directory. This file is **ignored by git** for security.

```env
# Clerk Authentication (Required)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_... 

# Backend API URL (Required)
VITE_BACKEND_URL=http://localhost:3000

# Optional Analytics
VITE_VERCEL_ANALYTICS_ID=...
```

### Script Reference

- `npm run dev`: Starts the Vite development server at `http://localhost:5173`.
- `npm run build`: Compiles the app for production to the `dist` folder.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Locally previews the production build.

---

## 🛠️ Development Patterns

### State Management (Zustand)
We use **Zustand** for global state to avoid prop drilling.
```javascript
import { create } from 'zustand';

export const usePlanStore = create((set) => ({
  destination: '',
  setDestination: (dest) => set({ destination: dest }),
  reset: () => set({ destination: '' }),
}));
```

### Authentication Flow (Clerk)
Protected routes are handled via Clerk wrapper components.
```jsx
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function Dashboard() {
    return (
        <>
            <SignedIn>
                <DashboardContent />
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
}
```

### Styling & Theming
- **Tailwind CSS v4**: We use the latest v4 alpha for performance.
- **Shadcn/UI**: Components are copy-pasted into `src/components/ui`. Customizable via `tailwind.config.js` (if strictly required, though v4 is config-free).

---

## 🐛 Troubleshooting

| Issue | Solution |
| :--- | :--- |
| `VITE_CLERK_PUBLISHABLE_KEY is missing` | Ensure your `.env` file exists and restart the dev server. |
| `Module not found: @/lib/utils` | Check `tsconfig.json` paths configuration. |
| `GSAP ScrollTrigger not working` | Ensure `gsap.registerPlugin(ScrollTrigger)` is called in `useEffect`. |

---

## 🤝 Contributing

1. **Linting**: Please run `npm run lint` before committing.
2. **Commits**: Use conventional commits (e.g., `feat: add new globe animation`).
3. **PRs**: Open a PR to the `dev` branch.

Made with 🎨 and React.