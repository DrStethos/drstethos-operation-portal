import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { id: "about", label: "About" },
  { id: "how-it-works", label: "How it works" },
  { id: "paths", label: "Paths" },
  { id: "pricing", label: "Pricing" },
];

const NavBar = () => {
  const [open, setOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 56;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleNavClick = (sectionId: string) => {
    setOpen(false);
    requestAnimationFrame(() => {
      setTimeout(() => scrollToSection(sectionId), 50);
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border/60">
      <div className="page-container">
        <div className="flex items-center justify-between h-14 gap-4">
          <Link to="/" className="flex items-center gap-2.5 group min-w-0">
            <img
              src="/logo.png"
              alt="DrStethos Logo"
              className="w-8 h-8 object-contain rounded-lg group-hover:scale-105 transition-transform flex-shrink-0"
            />
            <span className="font-display text-base font-semibold text-foreground tracking-tight">
              DrStethos
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-[13px] text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="hidden sm:inline-flex h-9 rounded-full bg-primary hover:bg-primary/90 px-5 text-[13px] font-medium shadow-medical"
              size="sm"
              onClick={() => scrollToSection("get-in-touch")}
            >
              Get in touch
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-9 w-9 text-foreground/80 hover:text-primary hover:bg-secondary"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-[min(100%,20rem)] flex-col p-0">
                <SheetHeader className="px-5 pt-5 pb-4 border-b border-border text-left">
                  <SheetTitle className="flex items-center gap-2.5 text-[15px] font-semibold">
                    <img src="/logo.png" alt="" className="w-7 h-7 object-contain rounded-lg" />
                    DrStethos
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-1 flex-col px-3 py-4 gap-0.5">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="text-left px-3 py-3 rounded-lg text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-primary transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className="px-5 pt-3 pb-6 border-t border-border">
                  <Button
                    className="w-full h-10 rounded-full bg-primary hover:bg-primary/90 text-sm font-medium shadow-medical"
                    onClick={() => handleNavClick("get-in-touch")}
                  >
                    Get in touch
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
