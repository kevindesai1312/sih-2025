import { useI18n } from "@/lib/i18n";
import { Globe, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { usePatientAuth } from "@/lib/patient-auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 font-extrabold tracking-tight"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            className="text-primary"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2m4.9 7.1l-5.66 5.66a1 1 0 0 1-1.41 0l-2.12-2.12a1 1 0 1 1 1.41-1.41l1.41 1.41l4.95-4.95a1 1 0 1 1 1.41 1.41"
            />
          </svg>
          <span className="text-xl">{t("appName")}</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="hover:text-primary transition-colors">
            {t("nav_features")}
          </a>
          <a
            href="#architecture"
            className="hover:text-primary transition-colors"
          >
            {t("nav_architecture")}
          </a>
          <a href="/awareness" className="hover:text-primary transition-colors">
            Awareness
          </a>
          <a href="/doctor/auth" className="hover:text-primary transition-colors">
            Doctor Portal
          </a>
          <a href="#about" className="hover:text-primary transition-colors">
            About
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <AuthButtons />
          <Button variant="default" asChild>
            <a href="#symptom">{t("cta_assess")}</a>
          </Button>
          <button
            className="md:hidden p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t">
          <div className="container py-3 space-y-3">
            <a
              href="#features"
              className="block"
              onClick={() => setOpen(false)}
            >
              {t("nav_features")}
            </a>
            <a
              href="#architecture"
              className="block"
              onClick={() => setOpen(false)}
            >
              {t("nav_architecture")}
            </a>
            <a
              href="/awareness"
              className="block"
              onClick={() => setOpen(false)}
            >
              Awareness
            </a>
            <a
              href="/doctor/auth"
              className="block"
              onClick={() => setOpen(false)}
            >
              Doctor Portal
            </a>
            <a href="#about" className="block" onClick={() => setOpen(false)}>
              About
            </a>
            <a href="/auth" className="block" onClick={() => setOpen(false)}>
              Login / Sign up
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function AuthButtons() {
  const { patient, logout } = usePatientAuth();
  if (patient) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground hidden sm:inline">
          Hi, {patient.name}
        </span>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    );
  }
  return (
    <Button asChild variant="outline">
      <a href="/auth">Login / Sign up</a>
    </Button>
  );
}

function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={lang} onValueChange={(v) => setLang(v as any)}>
        <SelectTrigger className="w-[120px] h-9">
          <SelectValue placeholder="EN" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="pa">ਪੰਜਾਬੀ</SelectItem>
          <SelectItem value="hi">हिंदी</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t bg-white/60 dark:bg-background/80">
      <div className="container py-8 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-primary"
              aria-hidden
            >
              <path
                fill="currentColor"
                d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2m4.9 7.1l-5.66 5.66a1 1 0 0 1-1.41 0l-2.12-2.12a1 1 0 1 1 1.41-1.41l1.41 1.41l4.95-4.95a1 1 0 1 1 1.41 1.41"
              />
            </svg>
            {t("appName")}
          </div>
          <p className="mt-3 text-muted-foreground max-w-sm">{t("tagline")}</p>
        </div>
        <div className="space-y-2">
          <div className="font-semibold">{t("features_title")}</div>
          <a href="#features" className="block">
            {t("f1_title")}
          </a>
          <a href="#features" className="block">
            {t("f2_title")}
          </a>
          <a href="#features" className="block">
            {t("f3_title")}
          </a>
          <a href="#features" className="block">
            {t("f4_title")}
          </a>
        </div>
        <div className="space-y-2">
          <div className="font-semibold">Resources</div>
          <a href="#architecture" className="block">
            {t("architecture_title")}
          </a>
          <a href="#about" className="block">
            About Us
          </a>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("appName")} · Made for rural healthcare
      </div>
    </footer>
  );
}
