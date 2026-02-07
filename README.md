# Spoolman Scanner

Spoolman Scanner is an open-source, static web application designed to help you manage your 3D printing filaments by interfacing with a **Spoolman** instance. It features a modern, responsive dashboard with NFC tag integration for easy spool identification and tracking.

> [!IMPORTANT]
> **Android Only**: The NFC tag reading and writing features currently only work on **Android devices** using a compatible web browser (like Chrome).
> 
> **CORS Configuration**: Your Spoolman instance must be configured with appropriate CORS settings to allow this static page to connect. For example, if you are using Docker, you may need to set `SPOOLMAN_CORS_ORIGINS="*"`.

## 🚀 Features

- **Spool Dashboard**: Visualize all your filaments at a glance.
- **Advanced Search**: Quickly find filaments by name, vendor, or material.
- **Custom Metadata**: Supports an optional `subtype` string field in Spoolman filament "extra" data for more granular classification.
- **NFC Tag Integration**: 
  - **Scan Tag**: Instantly identify a spool by scanning its NFC tag.
  - **Write Tag**: Encode spool data onto NFC tags for physical tracking.
- **Configurable Settings**: Easily connect to your own Spoolman instance.
- **Fully Responsive**: Optimized for both desktop and mobile use.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

> [!NOTE]
> This project was developed by an experienced software developer with the assistance of AI tools to accelerate the building process while maintaining high architectural standards.

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/vibe.git
   cd vibe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## 🚀 Deployment

Since this is a static web application, it can be deployed to any static site hosting service (GitHub Pages, Vercel, Netlify, etc.).

Build the project for production:
```bash
npm run build
```

The output will be in the `dist/` directory.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the MIT License.
