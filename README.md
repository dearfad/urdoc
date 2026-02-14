# URDOC - Virtual Medical Case Study Platform

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Nuxt.js](https://img.shields.io/badge/Nuxt.js-4.x-green.svg)](https://nuxt.com/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-blue.svg)](https://vuejs.org/)
[![Vuetify](https://img.shields.io/badge/Vuetify-3.x-purple.svg)](https://vuetifyjs.com/)

</div>

**URDOC** (虚拟病例研究平台) is an advanced virtual medical case study platform that integrates **case generation**, **story writing**, **question design**, **consultation simulation**, and **ability assessment**. Leveraging cutting-edge large language model technology, URDOC provides an efficient, flexible, and innovative learning and research environment for medical education and clinical practice.

## ✨ Key Features

- 🏥 **Case Generation** - AI-powered medical case creation with realistic scenarios
- 📝 **Story Writing** - Interactive medical narrative development
- ❓ **Question Design** - Intelligent medical question generation and assessment
- 💬 **Consultation Simulation** - Realistic doctor-patient interaction simulation
- 📊 **Ability Assessment** - Comprehensive evaluation and feedback system
- 🌐 **Multi-language Support** - Built-in Chinese/English internationalization
- 🔐 **Authentication** - Secure user management with Clerk
- ☁️ **Edge Computing** - Serverless deployment with EdgeOne Functions

## 🛠 Technology Stack

### Frontend Framework
- **[Nuxt.js 4.x](https://nuxt.com/)** - Full-stack Vue.js framework
- **[Vue.js 3.x](https://vuejs.org/)** - Progressive JavaScript framework
- **[Vuetify 3.x](https://vuetifyjs.com/)** - Material Design component library
- **TypeScript** - Type-safe development

### Backend & Database
- **[Supabase](https://supabase.com/)** - Open-source Firebase alternative
- **Edge Functions** - Serverless API endpoints
- **Pinia** - State management with persistence

### Authentication & Security
- **[Clerk](https://clerk.com/)** - Modern authentication and user management

### Development Tools
- **Vite** - Next-generation frontend tooling
- **VitePress** - Documentation site generator
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting

## 📁 Project Structure

```
urdoc/
├── app/                    # Main application source code
│   ├── components/        # Reusable Vue components
│   ├── composables/       # Vue composables
│   ├── layouts/          # Application layouts
│   ├── pages/            # Route pages
│   ├── stores/           # Pinia stores
│   └── types/            # TypeScript type definitions
├── server/                # Server-side API endpoints
├── prompts/               # AI prompt templates for medical scenarios
├── docs/                  # VitePress documentation
├── public/                # Static assets
├── i18n/                  # Internationalization files
└── edge-functions/        # EdgeOne serverless functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/urdoc.git
   cd urdoc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Supabase Configuration
   PUBLIC_SUPABASE_URL=your_supabase_url
   PUBLIC_SUPABASE_KEY=your_supabase_anon_key

   # Clerk Configuration (if using Clerk authentication)
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

### Development

**Start the development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

**Generate static site:**
```bash
npm run generate
```

### Documentation

**Start documentation development server:**
```bash
npm run docs:dev
```

**Build documentation:**
```bash
npm run docs:build
```

**Preview documentation:**
```bash
npm run docs:preview
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory and includes:

- **User Guide** - Complete usage instructions and tutorials
- **API Reference** - Detailed API documentation
- **Development Guide** - Contributing guidelines and development workflows
- **Deployment Guide** - Production deployment instructions

Access the documentation locally:
```bash
npm run docs:dev
```

## 🌐 Internationalization

URDOC supports multiple languages with built-in internationalization:

- **Chinese (中文)** - Default language
- **English** - Full translation support

Language files are located in `i18n/locales/` and can be easily extended for additional languages.

## 🚀 Deployment

### EdgeOne Deployment

This project is configured for deployment on EdgeOne with serverless functions:

```bash
# Build and deploy to EdgeOne
npm run edgeone
```

### Environment Configuration

The project uses route rules for optimal performance:
- Static routes are server-side rendered (SSR)
- Dynamic routes (`/user/**`, `/project/**`, etc.) are client-side rendered
- Media routes (`/image/**`, `/video/**`, `/audio/**`) are optimized for static delivery

## 🤝 Contributing

We welcome contributions to URDOC! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Built with [Nuxt.js](https://nuxt.com/) - The Intuitive Vue Framework
- UI components by [Vuetify](https://vuetifyjs.com/)
- Authentication powered by [Clerk](https://clerk.com/)
- Database services by [Supabase](https://supabase.com/)

---

<div align="center">
Made with ❤️ for medical education and clinical practice
</div>
