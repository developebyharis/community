"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <AppSidebar />
          <Header />
          <main className="pt-10 md:pt-12 lg:pt-12">{children}</main>
          <Toaster richColors closeButton />
        </SidebarProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
