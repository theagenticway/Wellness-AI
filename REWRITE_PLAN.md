# WellnessAI Frontend Rewrite Plan

## 📋 Current Status
- **Date:** July 21, 2025
- **Current Issues Identified:** Tailwind CSS build problems, incomplete component styling, React hydration working but CSS not applying
- **Working Solution:** Pure inline CSS styles (as implemented in LoginScreen.tsx)

## 🎯 Complete Rewrite Strategy

### **Recommended Tech Stack**
- **Frontend:** Next.js 15 + TypeScript
- **Styling:** Styled-Components + Design System (NO Tailwind)
- **State Management:** Zustand + React Query
- **UI Components:** Radix UI + Arco Design
- **Real-time:** Socket.io + React
- **Animations:** Framer Motion

### **Why This Stack**
1. **Server-Side Rendering** - Critical for SEO and fast loading
2. **No CSS Framework Dependencies** - Eliminates build issues we experienced
3. **Type Safety** - Full TypeScript throughout
4. **Styled-Components** - CSS-in-JS, no build issues, dynamic styling
5. **Performance** - Next.js optimization out of the box

## 🎨 Screen Design Analysis

### **Key Screens Identified:**
1. **Progress Dashboard** (Unknown-13.png) - Progress tracking with charts/metrics
2. **Onboarding Flow** (Unknown-14.png) - Multi-step health quiz and goal setting
3. **Main Dashboard** (Unknown-15.png) - Today's plan (workout, nutrition, mindfulness, CBT)
4. **Clients Management** (Unknown-16.png) - Professional portal for client oversight
5. **Client Details** (Unknown-17.png) - Individual client progress and metrics
6. **Exercise Module** (Unknown-18.png) - Workout recommendations and tracking
7. **Nutrition Module** (Unknown-19.png) - Meal plans and dietary tracking
8. **Reminders/Settings** (Unknown-20.png) - Notification preferences

### **Design Principles from Screens:**
- **Clean, minimalist aesthetic** with soft colors
- **Card-based layout** for modular content
- **Progress visualization** with charts and metrics
- **Mobile-first responsive design**
- **Professional dual-interface** (member + professional views)

## 🏗️ Recommended Project Structure
```
wellness-ai-v2/
├── apps/
│   ├── web/                 # Next.js 15 main app
│   ├── admin/              # Professional portal
│   └── api/                # Existing backend (preserve)
├── packages/
│   ├── ui/                 # Shared component library
│   ├── hooks/              # Shared React hooks
│   └── types/              # TypeScript definitions
└── docs/
```

## 🚀 Implementation Phases

### **Phase 1: Foundation (Week 1-2)**
1. Set up Next.js 15 with TypeScript
2. Create design system with Styled-Components
3. Build core components (Button, Input, Card, etc.)
4. Implement authentication with NextAuth.js

### **Phase 2: Core Features (Week 3-4)**
1. Dashboard with today's plan (matching Unknown-15.png)
2. Progress tracking with beautiful charts
3. AI integration for personalized recommendations
4. Real-time updates with Socket.io

### **Phase 3: Advanced Features (Week 5-6)**
1. Professional portal (Unknown-16.png)
2. Client management and overrides
3. Advanced analytics and reporting

## 🔧 Current Backend Integration
- **Preserve existing backend** at `/apps/backend/`
- **Docker setup** working correctly
- **API endpoints** functional (tested working)
- **Database** (PostgreSQL + Prisma) ready

## 🎯 Key Features to Implement

### **Member Features:**
- Personalized daily dashboard
- Progress tracking with visual charts
- AI-powered wellness recommendations
- Modular wellness components (nutrition, exercise, CBT, mindfulness)
- Real-time plan updates

### **Professional Features:**
- Client roster management
- Individual client progress monitoring
- Plan override capabilities
- Secure messaging
- Analytics and reporting

### **Technical Features:**
- Real-time AI agent communication
- HIPAA/GDPR compliant data handling
- Mobile-responsive design
- Progressive Web App capabilities
- Offline functionality

## 📝 Next Session Action Items

1. **Initialize Next.js 15 project** with recommended structure
2. **Set up Styled-Components** design system
3. **Create core UI components** based on screen designs
4. **Implement authentication** system
5. **Build first dashboard** prototype

## 🔍 Critical Lessons Learned
- **Avoid complex CSS frameworks** in favor of CSS-in-JS solutions
- **Tailwind content configuration** was incomplete (missing `/components/` directory)
- **UI component libraries** (like Radix) need proper CSS generation
- **Inline styles** work reliably when CSS frameworks fail
- **React hydration** was working correctly - issue was CSS-specific

## 📂 Preserve Current Working Code
- **LoginScreen.tsx** - Working inline CSS implementation
- **Backend API** - All endpoints functional
- **Docker setup** - Container architecture working
- **Database schema** - Prisma setup complete

---
**Status:** Ready to begin complete frontend rewrite with modern tech stack
**Next Session:** Initialize Next.js 15 + Styled-Components foundation