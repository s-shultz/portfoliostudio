# PortfolioStudio 🎨

> A stunning 3D interactive portfolio website showcasing UI/UX design, creative coding, and extended reality experiences.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-shainashultz.com-blue?style=for-the-badge)](https://shainashultz.com)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/portfoliostudio)

## ✨ Features

### 🎮 Interactive 3D Experience
- **Immersive 3D Environment** - Navigate through a beautifully rendered virtual office space
- **Dynamic Camera Controls** - Smooth orbital controls for exploring the scene
- **Interactive Hotspots** - Click on monitors and objects to reveal portfolio content
- **Responsive 3D** - Optimized performance across desktop and mobile devices

### 🎨 Portfolio Showcase
- **UI/UX Design Projects** - Mixed reality interfaces, healthcare applications, Fortune 500 digital experiences
- **Creative Coding** - Three.js installations, P5.js generative art, TouchDesigner visuals
- **Extended Reality** - Unity XR applications, Unreal Engine environments, Adobe Aero AR experiences
- **Professional Experience** - Comprehensive resume with education and work history

### 🚀 Modern Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Backend**: Express.js, Node.js
- **Deployment**: Vercel with custom domain
- **Development**: Vite, ESBuild

### 📱 Responsive Design
- **Mobile-First** - Optimized for all screen sizes
- **Touch-Friendly** - Intuitive mobile navigation
- **Performance** - Fast loading with efficient asset management

## 🛠️ Tech Stack

```typescript
Frontend:
├── React 18 + TypeScript     // Modern React with type safety
├── Three.js + R3F            // 3D graphics and WebGL
├── Tailwind CSS              // Utility-first styling
├── Framer Motion             // Smooth animations
├── Radix UI                  // Accessible component primitives
└── Zustand                   // State management

Backend:
├── Express.js                // Web server framework
├── Node.js                   // Runtime environment
└── TypeScript                // Type-safe backend

Deployment:
├── Vercel                    // Serverless deployment
├── Custom Domain             // Professional hosting
└── CI/CD Pipeline            // Automated deployments
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfoliostudio.git
   cd portfoliostudio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5000
   ```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🏗️ Project Structure

```
portfoliostudio/
├── client/                   # Frontend React application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Scene3D.tsx          # Main 3D scene
│   │   │   ├── InteractiveScreens.tsx # Portfolio popups
│   │   │   ├── Navigation.tsx       # UI navigation
│   │   │   └── ui/                  # Reusable UI components
│   │   ├── lib/              # Utilities and stores
│   │   │   ├── stores/              # Zustand state management
│   │   │   └── three-utils.ts       # 3D helpers
│   │   └── pages/            # Page components
│   └── public/               # Static assets
│       ├── models/           # 3D models (.glb files)
│       └── textures/         # Texture assets
├── server/                   # Backend Express application
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes
│   └── vite.ts              # Vite integration
├── api/                     # Vercel serverless functions
└── shared/                  # Shared TypeScript types
```

## 🎨 Key Features Breakdown

### 3D Scene Architecture
- **Modular Components** - Reusable 3D objects and scenes
- **Performance Optimization** - LOD, frustum culling, efficient rendering
- **Asset Pipeline** - Optimized .glb models with texture compression
- **Lighting System** - Dynamic lighting with shadows and reflections

### Responsive UI System
- **Mobile-First Design** - Progressive enhancement for larger screens
- **Accessibility** - WCAG compliant with keyboard navigation
- **Component Library** - Radix UI primitives with custom styling
- **Animation** - Smooth transitions with Framer Motion

### State Management
- **Zustand Stores** - Lightweight, TypeScript-friendly state
- **Portfolio Data** - Dynamic content management
- **UI State** - Navigation and interaction states
- **3D State** - Camera controls and scene interactions

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configure Custom Domain**
   ```bash
   vercel domains add yourdomain.com
   ```

3. **Environment Variables** (if needed)
   - Add any required environment variables in Vercel dashboard

### Alternative Deployment Options
- **Netlify** - Static site hosting with serverless functions
- **DigitalOcean App Platform** - Full-stack deployment
- **Railway** - Container-based deployment
- **Self-hosted** - Traditional VPS deployment

## 🎯 Performance Optimizations

- **Code Splitting** - Dynamic imports for route-based splitting
- **Asset Optimization** - Compressed 3D models and textures
- **Lazy Loading** - Progressive loading of heavy 3D assets
- **Caching** - Efficient browser and CDN caching strategies
- **Bundle Analysis** - Optimized bundle sizes with tree shaking

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # TypeScript type checking
```

### Code Quality
- **TypeScript** - Full type safety across the stack
- **ESLint** - Code linting and formatting
- **Prettier** - Consistent code formatting
- **Git Hooks** - Pre-commit quality checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** - For the incredible 3D graphics library
- **React Three Fiber** - For the React integration
- **Vercel** - For seamless deployment and hosting
- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Contact

**Shaina Shultz** - Creative Technologist & UI/UX Designer

- 🌐 **Portfolio**: [shainashultz.com](https://shainashultz.com)
- 💼 **LinkedIn**: [linkedin.com/in/shaina-shultz](https://linkedin.com/in/shaina-shultz)
- 🐙 **GitHub**: [github.com/s-shultz](https://github.com/s-shultz)

---

⭐ **Star this repository if you found it helpful!**