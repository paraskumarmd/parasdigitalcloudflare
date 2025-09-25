# Paras Digital - AI & Digital Marketing Portfolio

A modern, responsive portfolio website showcasing AI consulting and digital marketing expertise. Built with Next.js 13, TypeScript, and Tailwind CSS.

![Paras Digital Portfolio](https://img.shields.io/badge/Next.js-13.5.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

- **Modern Design**: Clean, professional portfolio with smooth animations
- **Responsive Layout**: Mobile-first design that works on all devices
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Contact Form**: Integrated contact form with Supabase backend and email notifications
- **Blog System**: Content management with Notion integration
- **Portfolio Showcase**: Dynamic portfolio section with filtering capabilities
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Performance**: Optimized with Next.js 13 App Router and modern React patterns

## 🛠️ Tech Stack

### Frontend
- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Notion API** - Content management system
- **Nodemailer** - Email service integration

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
parasdigtital/
├── app/                    # Next.js 13 App Router
│   ├── about/             # About page
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── contact/           # Contact page
│   ├── portfolio/         # Portfolio page
│   ├── services/          # Services page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── layout/           # Header, Footer, Navigation
│   ├── sections/         # Page sections
│   ├── ui/               # UI components (Radix-based)
│   └── theme-provider.tsx # Theme context
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
└── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Email service (Gmail, Outlook, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/parasdigtital.git
   cd parasdigtital
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
       Update `.env.local` with your credentials:
    ```env
    # Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    
    # Notion API Configuration
    NOTION_API_KEY=your_notion_integration_token
    NOTION_DATABASE_ID=your_notion_database_id
    
    # Email Configuration
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=465
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_app_password
    EMAIL_TO=paraskumar.desh@gmail.com
    
    # Database Table Name
    CONTACT_TABLE_NAME=contact_submissions
    ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL script from `supabase-setup.sql`
   - Update your environment variables with project credentials

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📧 Contact Form Setup

The contact form integrates with Supabase for data storage and sends email notifications. See [CONTACT_FORM_SETUP.md](./CONTACT_FORM_SETUP.md) for detailed setup instructions.

## 🔄 Content Revalidation

Your website automatically caches content for performance. To refresh content after updates:

### Environment Variable
Add to your `.env.local` and Cloudflare Pages:
```env
REVALIDATE_SECRET=your_super_secret_key_here
```

### Manual Revalidation
After updating Notion content, run:
```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your_super_secret_key_here","path":"/blog"}'
```

**Note**: Replace `your-domain.com` with your actual Cloudflare Pages domain.

### Key Features
- Form validation (client and server-side)
- Database storage in Supabase
- Email notifications via SMTP
- Error handling and user feedback
- Security with input validation

## 🎨 Customization

### Styling
- **Colors**: Update `tailwind.config.ts` for brand colors
- **Typography**: Modify font settings in `app/layout.tsx`
- **Components**: Customize UI components in `components/ui/`

### Content
- **Pages**: Edit content in respective page files under `app/`
- **Sections**: Modify section components in `components/sections/`
- **Blog**: Update blog content through Notion integration

### Theme
- **Dark/Light Mode**: Customize theme colors in `globals.css`
- **Animations**: Adjust Framer Motion animations in section components

## 📱 Pages & Sections

- **Home**: Hero section with animated elements
- **About**: Professional background and expertise
- **Services**: AI consulting and digital marketing offerings
- **Portfolio**: Project showcase with filtering
- **Blog**: Articles and insights
- **Contact**: Contact form with validation

## 🚀 Deployment

### Cloudflare Pages (Recommended - Free)
1. **Create Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Connect Repository**: Go to Pages → Create project → Connect GitHub
3. **Configure Build Settings**:
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Build output directory: `.next`
4. **Set Environment Variables**: Add all variables from `.env.local`
5. **Deploy**: Click "Save and Deploy"
6. **Custom Domain**: Add your domain in Cloudflare dashboard

**Benefits**: 100% free, global CDN, automatic HTTPS, Git integration

### Vercel (Alternative)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
1. Build the project: `npm run build`
2. Start production server: `npm start`
3. Set environment variables on your hosting platform

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📊 Performance

- **Lighthouse Score**: Optimized for Core Web Vitals
- **Image Optimization**: Next.js Image component with optimization
- **Code Splitting**: Automatic route-based code splitting
- **SEO**: Meta tags, structured data, and Open Graph
- **Cloudflare CDN**: Global content delivery for fast loading worldwide

## 🔒 Security

- Input validation and sanitization
- Environment variable protection
- Supabase Row Level Security (RLS)
- Rate limiting considerations for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: paraskumar.desh@gmail.com
- **Portfolio**: [parasdigital.com](https://parasdigital.com)
- **LinkedIn**: [Your LinkedIn Profile]

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ by Paras Digital**
