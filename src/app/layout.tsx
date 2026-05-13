import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Odisea Billing | Domain & Hosting Solutions",
  description: "Secure your digital future with Odisea. Premium hosting, domain registration, and reseller solutions.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

import QueryProvider from "@/components/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Silenciar Window Management API
                if (typeof window !== 'undefined') {
                  window.getScreenDetails = function() {
                    return Promise.reject(new Error('Permission denied by security policy'));
                  };
                  // Silenciar Local Font Access API
                  window.queryLocalFonts = function() {
                    return Promise.resolve([]);
                  };
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <div className="odisea-bg" />
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
