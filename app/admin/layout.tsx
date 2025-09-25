import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Paras Digital',
  description: 'Admin dashboard for managing blog comments and content',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b fixed top-0 left-0 right-0 z-50 bg-background">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your blog content</p>
            </div>
            <nav className="flex gap-4">
              <a 
                href="/admin/comments" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Comments
              </a>
              <a 
                href="/" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Back to Site
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="pt-20">{children}</main>
    </div>
  );
}
