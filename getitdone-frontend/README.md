# GetItDone Frontend

React-based frontend for the GetItDone task management platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run on `http://localhost:8080`

## 🛠️ Technologies

- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Shadcn/ui** - UI component library
- **React Router v6** - Client-side routing
- **Lucide React** - Icon library

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=GetItDone
VITE_APP_URL=http://localhost:8080
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── lib/            # Utilities and API
├── hooks/          # Custom React hooks
└── main.tsx        # App entry point
```

## 🚀 Deployment

This frontend is deployed on Vercel at [getitdone.amjad.biz](https://getitdone.amjad.biz)

For production deployment:
1. Set environment variables in Vercel
2. Connect GitHub repository
3. Deploy automatically on push

## 📄 License

MIT
