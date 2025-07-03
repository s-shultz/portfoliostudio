# 3D Interactive Portfolio - Replit Configuration

## Overview

This project is an interactive 3D portfolio application for Shaina Shultz, a Design Technologist. The application features a Three.js-powered 3D office environment where users can interact with virtual monitors to explore different aspects of the portfolio (UI/UX Design, Creative Coding, and 3D Work). The project combines modern web technologies with immersive 3D experiences to showcase professional work in an engaging way.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **3D Engine**: Three.js with React Three Fiber integration
- **UI Framework**: Tailwind CSS with Radix UI components
- **State Management**: Zustand for client-side state management
- **Build Tool**: Vite with custom configuration for 3D assets
- **Styling**: CSS-in-JS with Tailwind utilities and custom CSS variables

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Structure**: RESTful endpoints under `/api` prefix
- **Session Management**: In-memory storage with extensible interface
- **Development**: Hot Module Replacement (HMR) via Vite integration

### Database Strategy
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL via Neon serverless
- **Migrations**: Automated schema management with Drizzle Kit
- **Current State**: Uses in-memory storage with database-ready schema

## Key Components

### 3D Scene Management
- **Scene Initialization**: Custom Three.js utilities for camera, lighting, and renderer setup
- **Model Loading**: Robust FBX/GLB loader with texture management and error handling
- **Interactive Elements**: Raycasting-based monitor interaction system
- **Asset Pipeline**: Support for large 3D models and textures via Vite configuration

### Portfolio Content System
- **Dynamic Sections**: About, Experience, and interactive work showcases
- **Screen Interactions**: Clickable 3D monitors that trigger portfolio overlays
- **Notification System**: Real-time feedback for user interactions
- **Responsive Design**: Mobile-optimized 3D controls and UI layouts

### Audio & Interaction
- **Audio Management**: Global audio state with mute/unmute functionality
- **Interaction Hints**: Contextual guidance for 3D navigation
- **Loading States**: Progressive loading with visual feedback
- **Error Handling**: Graceful fallbacks for failed 3D model loads

## Data Flow

1. **Application Bootstrap**: React app initializes with portfolio store and 3D scene setup
2. **Asset Loading**: Three.js ModelLoader handles FBX/GLB files with texture resolution
3. **User Interaction**: Mouse events trigger raycasting to detect monitor clicks
4. **State Updates**: Zustand stores manage portfolio sections and audio preferences
5. **Content Display**: Modal overlays show detailed portfolio information
6. **Responsive Updates**: Real-time scene adjustments for window resizing

## External Dependencies

### Core Libraries
- **Three.js**: 3D graphics rendering and scene management
- **React Three Fiber**: React integration for Three.js
- **React Three Drei**: Additional Three.js utilities and helpers
- **Radix UI**: Accessible component primitives
- **TanStack Query**: Server state management and caching

### Development Tools
- **Vite**: Fast development server with 3D asset support
- **TypeScript**: Type safety across frontend and backend
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Fast JavaScript bundling for production

### 3D Asset Pipeline
- **GLTF Transform**: 3D model optimization and processing
- **FBX Loader**: Support for Autodesk FBX format
- **Texture Management**: Automatic texture path resolution and loading

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Assets**: 3D models and textures served as static files
- **Environment**: Production mode with optimized Three.js rendering

### Development Environment
- **Hot Reload**: Vite middleware integrated with Express for seamless development
- **Asset Serving**: Direct file serving for 3D models during development
- **Error Overlay**: Real-time error reporting with stack traces
- **TypeScript**: Continuous type checking with path alias support

### Database Configuration
- **Connection**: Environment-based PostgreSQL connection string
- **Migrations**: Drizzle Kit manages schema changes automatically
- **Fallback**: In-memory storage for development without database

## Changelog

- July 03, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.