import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { scrollToId } from "@/lib/motion";

const navItems = [
  { id: "about", label: "About" },
  { id: "how-it-works", label: "How it works" },
  { id: "for-doctors", label: "For Doctors" },
  { id: "for-hospitals", label: "For Hospitals" },
  { id: "pricing", label: "Pricing" },
];

const LandingNav = () => {
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    setOpen(false);
    requestAnimationFrame(() => setTimeout(() => scrollToId(id, 80), 40));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-black/5 pt-1">
      <div className="page-container">
        <div className="flex h-12 md:h-14 items-center justify-between gap-4 pb-1">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="DrStethos" className="h-8 w-8 rounded-lg object-contain" />
            <span className="font-display text-base font-semibold tracking-tight text-foreground">
              DrStethos
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="hidden sm:inline-flex h-10 rounded-full px-5 text-sm font-semibold bg-primary text-white hover:bg-primary/90"
              onClick={() => go("get-in-touch")}
            >
              Get Started
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-foreground"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="p-0 w-[min(100%,20rem)]">
                <SheetHeader className="px-5 pt-5 pb-4 border-b text-left">
                  <SheetTitle className="flex items-center gap-2 text-base">
                    <img src="/logo.png" alt="" className="h-7 w-7 rounded-lg" />
                    DrStethos
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-3 gap-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => go(item.id)}
                      className="text-left px-3 py-3.5 rounded-xl text-base font-medium hover:bg-secondary"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="px-5 pb-6 pt-2">
                  <Button className="w-full h-11 rounded-full" onClick={() => go("get-in-touch")}>
                    Get Started
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

export default LandingNav;
