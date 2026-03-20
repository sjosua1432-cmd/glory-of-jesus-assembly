import {
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Cross,
  ExternalLink,
  Heart,
  Instagram,
  MapPin,
  Menu,
  Moon,
  Phone,
  Quote,
  Sparkles,
  Sun,
  Users,
  X,
  Youtube,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { Category } from "../backend";
import { useSubmitPrayerRequest } from "../hooks/useQueries";

// ── Utility: Intersection Observer fade-in ──────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(
      ".fade-in-up, .fade-in-left, .fade-in-right",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.12 },
    );
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);
}

// ── Category map ─────────────────────────────────────────────────────────────
const CATEGORY_OPTIONS: { label: string; value: Category }[] = [
  { label: "Healing", value: { __kind__: "healing", healing: null } },
  { label: "Family Peace", value: { __kind__: "family", family: null } },
  {
    label: "Financial Breakthrough",
    value: { __kind__: "finances", finances: null },
  },
  { label: "Guidance", value: { __kind__: "guidance", guidance: null } },
  { label: "Salvation", value: { __kind__: "salvation", salvation: null } },
  { label: "Wisdom", value: { __kind__: "wisdom", wisdom: null } },
  { label: "Faith", value: { __kind__: "faith", faith: null } },
];

// ── Scroll Progress Bar ───────────────────────────────────────────────────────
function ProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrolled = document.documentElement.scrollTop;
      const max =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress(max > 0 ? (scrolled / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 h-1 z-[2001] transition-all duration-100"
      style={{
        width: `${progress}%`,
        background:
          "linear-gradient(90deg, var(--gold-dark), var(--gold-light))",
      }}
    />
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({
  theme,
  toggleTheme,
}: { theme: string; toggleTheme: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#pastor", label: "Pastor" },
    { href: "#ministries", label: "Ministries" },
    { href: "#testimonies", label: "Testimonies" },
    { href: "#prayer", label: "Prayer" },
    { href: "#events", label: "Events" },
    { href: "#location", label: "Visit" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${
        scrolled ? "py-3" : "py-4"
      }`}
      style={{
        background:
          theme === "light" ? "rgba(255,255,255,0.85)" : "rgba(10,15,22,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#home"
          className="flex items-center gap-3 no-underline"
          data-ocid="nav.link"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--gold-dark), var(--gold-light))",
            }}
          >
            <Cross className="w-5 h-5" style={{ color: "#111" }} />
          </div>
          <span
            className="font-bold text-sm uppercase tracking-widest"
            style={{ color: "var(--gold)" }}
          >
            Glory of Jesus
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold transition-colors hover:text-primary"
              style={{ textDecoration: "none", color: "inherit" }}
              data-ocid="nav.link"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/admin"
            className="text-sm font-semibold transition-colors hover:text-primary"
            style={{ textDecoration: "none", color: "inherit" }}
            data-ocid="nav.link"
          >
            Admin
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all hover:shadow-gold"
            style={{
              background:
                "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
              color: "#111",
            }}
            data-ocid="nav.toggle"
          >
            {theme === "dark" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-ocid="nav.toggle"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-6 pb-4 flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold py-2"
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/admin"
              className="text-sm font-semibold py-2"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.link"
            >
              Admin
            </a>
            <button
              type="button"
              onClick={() => {
                toggleTheme();
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold w-fit"
              style={{
                background:
                  "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
                color: "#111",
              }}
              data-ocid="nav.toggle"
            >
              {theme === "dark" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              {theme === "dark" ? "Dark" : "Light"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center text-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(10,15,22,0.55), rgba(10,15,22,0.85)), url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 px-6 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm font-semibold tracking-[0.4em] mb-4"
          style={{ color: "var(--gold-light)" }}
        >
          COIMBATORE, TAMIL NADU
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-serif text-white leading-tight mb-6"
          style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
        >
          Experience Divine
          <br />
          Transformation
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <a
            href="#prayer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm transition-all hover:-translate-y-1 hover:shadow-gold"
            style={{
              background:
                "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
              color: "#111",
            }}
            data-ocid="hero.primary_button"
          >
            Request Prayer
          </a>
          <a
            href="https://youtube.com/@gloryofjesusassembly"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm transition-all hover:-translate-y-1"
            style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}
            data-ocid="hero.secondary_button"
          >
            <Youtube className="w-4 h-4" /> Watch Live
          </a>
        </motion.div>
      </div>
      <a
        href="#pastor"
        aria-label="Scroll to Pastor section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        style={{ color: "var(--gold)" }}
      >
        <span className="sr-only">Scroll down</span>
        <ChevronDown className="w-6 h-6" />
      </a>
    </section>
  );
}

// ── Pastor Section ────────────────────────────────────────────────────────────
function PastorSection() {
  return (
    <section id="pastor" className="py-20 px-6 md:px-[5%]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 items-center">
        {/* Image column */}
        <div className="fade-in-left relative">
          <div
            className="w-full rounded-3xl overflow-hidden"
            style={{
              aspectRatio: "4/5",
              border: "4px solid var(--glass-border)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=800&auto=format&fit=crop"
              alt="Pastor Ravi leading the congregation"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="absolute -bottom-5 -right-5 px-5 py-4 rounded-2xl text-center shadow-glass"
            style={{ background: "var(--gold)", color: "#000" }}
          >
            <div className="text-2xl font-bold">15+</div>
            <div className="text-xs font-semibold">Years Ministry</div>
          </div>
        </div>

        {/* Text column */}
        <div className="md:col-span-2 fade-in-right">
          <h2
            className="font-serif mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--gold)" }}
          >
            Pastor Ravi
          </h2>
          <p
            className="mb-8 leading-relaxed"
            style={{ fontSize: "1.1rem", color: "var(--muted-foreground)" }}
          >
            With a deep passion for spiritual growth and community welfare,
            Pastor Ravi has been leading Glory of Jesus Assembly since its
            inception. His teachings focus on the practical application of
            Biblical truths in modern life.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-panel rounded-2xl p-6">
              <BookOpen
                className="w-8 h-8 mb-3"
                style={{ color: "var(--gold)" }}
              />
              <h4 className="font-bold text-lg">Scriptural Truth</h4>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                Grounded in the Word of God
              </p>
            </div>
            <div className="glass-panel rounded-2xl p-6">
              <Heart
                className="w-8 h-8 mb-3"
                style={{ color: "var(--gold)" }}
              />
              <h4 className="font-bold text-lg">Compassion</h4>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                Serving the community with love
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── NEW: Ministries Section ───────────────────────────────────────────────────
const MINISTRIES = [
  {
    icon: Zap,
    title: "Youth Hub (GJA)",
    description:
      "A vibrant space for teens and young adults to grow in faith, build meaningful connections, and discover God's purpose for their generation.",
    link: "https://www.instagram.com/gja_youthhub?igsh=MWR3bml5ZjB4dGNsYQ==",
    linkLabel: "Follow on Instagram",
    badge: "Active",
  },
  {
    icon: Heart,
    title: "Women's Fellowship",
    description:
      "Every Thursday evening at 6 PM, women gather for prayer, deep Bible study, and mutual encouragement — a sisterhood rooted in the Word.",
    link: null,
    linkLabel: null,
    badge: "Thu · 6 PM",
  },
  {
    icon: BookOpen,
    title: "Sunday School",
    description:
      "Biblical education crafted for children during the Sunday Service at 8:30 AM. Nurturing young hearts with scripture, stories, and love.",
    link: null,
    linkLabel: null,
    badge: "Sun · 8:30 AM",
  },
];

function MinistriesSection() {
  return (
    <section
      id="ministries"
      className="py-20 px-6 md:px-[5%]"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, oklch(var(--card) / 0.5) 50%, transparent 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 fade-in-up">
          <p
            className="text-sm font-bold tracking-[0.3em] uppercase mb-3"
            style={{ color: "var(--gold)" }}
          >
            Serve & Grow
          </p>
          <h2
            className="font-serif mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Our Ministries
          </h2>
          <p
            className="max-w-xl mx-auto"
            style={{ color: "var(--muted-foreground)" }}
          >
            Every believer has a place to belong. Find your community within
            Glory of Jesus Assembly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {MINISTRIES.map((ministry, i) => {
            const Icon = ministry.icon;
            return (
              <motion.div
                key={ministry.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="glass-panel rounded-2xl p-8 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden"
                data-ocid={`ministries.item.${i + 1}`}
              >
                {/* Subtle decorative arc */}
                <div
                  className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
                  style={{
                    background:
                      "radial-gradient(circle, var(--gold-light), transparent)",
                  }}
                />

                <div className="flex items-start justify-between">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--gold-dark), var(--gold-light))",
                    }}
                  >
                    <Icon className="w-7 h-7" style={{ color: "#111" }} />
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      background: "var(--glass)",
                      border: "1px solid var(--gold)",
                      color: "var(--gold)",
                    }}
                  >
                    {ministry.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold mb-2">
                    {ministry.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {ministry.description}
                  </p>
                </div>

                {ministry.link && (
                  <a
                    href={ministry.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                    style={{ color: "var(--gold)" }}
                    data-ocid="ministries.link"
                  >
                    {ministry.linkLabel}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Testimonies ───────────────────────────────────────────────────────────────
const TESTIMONIES = [
  {
    quote:
      "Since joining the GJA family, my spiritual life has taken a complete turn. The teachings on scriptural truth helped me find peace during my hardest financial season.",
    name: "Brother Samuel",
    role: "Member since 2021",
  },
  {
    quote:
      "The prayer team at Glory of Jesus Assembly stood by me when I was struggling with chronic health issues. Today, I am completely healed by His grace!",
    name: "Sister Priya",
    role: "Healing Testimony",
  },
  {
    quote:
      "The Youth Hub has been a safe haven for my children. They are growing in Christ while making meaningful friendships. Truly a blessed community.",
    name: "David & Family",
    role: "Congregation Member",
  },
];

function TestimoniesSection() {
  return (
    <section id="testimonies" className="py-20 px-6 md:px-[5%]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 fade-in-up">
          <p
            className="text-sm font-bold tracking-[0.3em] uppercase mb-3"
            style={{ color: "var(--gold)" }}
          >
            Voices of Faith
          </p>
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Life Transformations
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIES.map((t, i) => (
            <div
              key={t.name}
              className="glass-panel rounded-2xl p-8 flex flex-col justify-between relative fade-in-up transition-all duration-300 hover:-translate-y-2"
              style={{ transitionDelay: `${i * 100}ms` }}
              data-ocid={`testimonies.item.${i + 1}`}
            >
              <Quote
                className="absolute top-4 right-5 w-8 h-8"
                style={{ color: "var(--gold)", opacity: 0.2 }}
              />
              <p
                className="italic mb-6 leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <h4 className="font-bold" style={{ color: "var(--gold)" }}>
                  {t.name}
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── NEW: Scripture Section ────────────────────────────────────────────────────
function ScriptureSection() {
  return (
    <section
      id="scripture"
      className="py-24 px-6 md:px-[5%] relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(var(--card) / 0.8) 0%, oklch(var(--background)) 100%)",
      }}
    >
      {/* Decorative cross watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <Cross
          className="w-[32rem] h-[32rem] opacity-[0.03]"
          style={{ color: "var(--gold)" }}
        />
      </div>

      {/* Gold top border accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--gold), transparent)",
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
          data-ocid="scripture.section"
        >
          {/* Decorative opening quote */}
          <div className="flex justify-center mb-8">
            <Sparkles className="w-10 h-10" style={{ color: "var(--gold)" }} />
          </div>

          {/* Large decorative quote marks */}
          <div
            className="font-serif leading-none mb-2 select-none"
            style={{
              fontSize: "8rem",
              color: "var(--gold)",
              opacity: 0.25,
              lineHeight: 0.6,
            }}
          >
            &ldquo;
          </div>

          <blockquote
            className="font-serif leading-relaxed mb-6"
            style={{
              fontSize: "clamp(1.3rem, 2.8vw, 2rem)",
              color: "var(--gold-light)",
              fontStyle: "italic",
              textShadow: "0 0 40px oklch(0.75 0.15 80 / 0.2)",
            }}
          >
            For I know the plans I have for you, declares the Lord, plans to
            prosper you and not to harm you, plans to give you hope and a
            future.
          </blockquote>

          <div
            className="font-serif leading-none mb-8 select-none text-right"
            style={{
              fontSize: "8rem",
              color: "var(--gold)",
              opacity: 0.25,
              lineHeight: 0.6,
            }}
          >
            &rdquo;
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div
              className="h-px flex-1 max-w-[120px]"
              style={{
                background: "linear-gradient(90deg, transparent, var(--gold))",
              }}
            />
            <Cross className="w-4 h-4" style={{ color: "var(--gold)" }} />
            <div
              className="h-px flex-1 max-w-[120px]"
              style={{
                background: "linear-gradient(90deg, var(--gold), transparent)",
              }}
            />
          </div>

          <cite
            className="font-bold tracking-[0.2em] uppercase not-italic text-sm"
            style={{ color: "var(--gold)" }}
          >
            Jeremiah 29:11
          </cite>
        </motion.div>
      </div>

      {/* Gold bottom border accent */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--gold), transparent)",
        }}
      />
    </section>
  );
}

// ── Prayer Request Form ───────────────────────────────────────────────────────
function PrayerSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const mutation = useSubmitPrayerRequest();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const cat = CATEGORY_OPTIONS.find((c) => c.label === category);
      if (!cat) return;
      try {
        await mutation.mutateAsync({
          name,
          phone,
          category: cat.value,
          message,
        });
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setName("");
          setPhone("");
          setCategory("");
          setMessage("");
        }, 5000);
      } catch (_e) {
        // error shown via mutation.isError
      }
    },
    [name, phone, category, message, mutation],
  );

  return (
    <section
      id="prayer"
      className="py-20 px-6 md:px-[5%]"
      style={{ background: "oklch(var(--card))" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 fade-in-up">
          <h2
            className="font-serif mb-3"
            style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)" }}
          >
            Prayer Request
          </h2>
          <p className="italic" style={{ color: "var(--muted-foreground)" }}>
            &ldquo;For where two or three are gathered in my name, there am I
            among them.&rdquo;
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-8 md:p-10 fade-in-up">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-10"
                data-ocid="prayer.success_state"
              >
                <CheckCircle
                  className="w-16 h-16 mx-auto mb-4"
                  style={{ color: "var(--gold)" }}
                />
                <h3 className="font-serif text-2xl mb-2">Request Received</h3>
                <p style={{ color: "var(--muted-foreground)" }}>
                  Pastor Ravi and our team are praying for you.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                data-ocid="prayer.modal"
              >
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="prayer-name"
                      className="text-xs font-semibold"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Your Name
                    </label>
                    <input
                      id="prayer-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="E.g. Samuel Raj"
                      className="px-4 py-3 rounded-xl outline-none text-sm transition-colors"
                      style={{
                        background: "var(--glass)",
                        border: "1px solid var(--glass-border)",
                        color: "inherit",
                      }}
                      data-ocid="prayer.input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="prayer-phone"
                      className="text-xs font-semibold"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Phone Number
                    </label>
                    <input
                      id="prayer-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 99423 86487"
                      className="px-4 py-3 rounded-xl outline-none text-sm transition-colors"
                      style={{
                        background: "var(--glass)",
                        border: "1px solid var(--glass-border)",
                        color: "inherit",
                      }}
                      data-ocid="prayer.input"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 mb-4">
                  <label
                    htmlFor="prayer-category"
                    className="text-xs font-semibold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Category
                  </label>
                  <select
                    id="prayer-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="px-4 py-3 rounded-xl outline-none text-sm"
                    style={{
                      background: "oklch(var(--background))",
                      border: "1px solid var(--glass-border)",
                      color: "inherit",
                    }}
                    data-ocid="prayer.select"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.label} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 mb-6">
                  <label
                    htmlFor="prayer-message"
                    className="text-xs font-semibold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    How can we pray for you?
                  </label>
                  <textarea
                    id="prayer-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    placeholder="Share your prayer need…"
                    className="px-4 py-3 rounded-xl outline-none text-sm resize-none"
                    style={{
                      background: "var(--glass)",
                      border: "1px solid var(--glass-border)",
                      color: "inherit",
                    }}
                    data-ocid="prayer.textarea"
                  />
                </div>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full py-4 rounded-full font-bold text-sm transition-all hover:-translate-y-1 hover:shadow-gold disabled:opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
                    color: "#111",
                  }}
                  data-ocid="prayer.submit_button"
                >
                  {mutation.isPending ? "Submitting…" : "Submit Request"}
                </button>
                {mutation.isError && (
                  <p
                    className="mt-3 text-sm text-center"
                    style={{ color: "oklch(var(--destructive))" }}
                    data-ocid="prayer.error_state"
                  >
                    Something went wrong. Please try again.
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ── NEW: Events Section ───────────────────────────────────────────────────────
const EVENTS = [
  {
    type: "recurring",
    day: "Every Sunday",
    title: "Morning Worship Service",
    time: "8:30 AM",
    description: "Join us for Spirit-filled praise, worship, and the Word.",
    icon: Calendar,
  },
  {
    type: "recurring",
    day: "1st of Every Month",
    title: "Promise Service",
    time: "5:30 AM",
    description: "A powerful early-morning service anchored in God's promises.",
    icon: Clock,
  },
  {
    type: "recurring",
    day: "Every Thursday",
    title: "Women's Prayer Meeting",
    time: "6:00 PM",
    description: "Women gathering together in prayer, study, and fellowship.",
    icon: Heart,
  },
  {
    type: "special",
    day: "Quarterly",
    title: "Fasting & Prayer Day",
    time: "All Day",
    description:
      "Corporate fasting and intercession for the church and community.",
    icon: Sparkles,
  },
  {
    type: "special",
    day: "December 25",
    title: "Christmas Celebration Service",
    time: "Morning",
    description:
      "Celebrate the birth of our Saviour with the whole GJA family.",
    icon: Zap,
  },
];

function EventsSection() {
  return (
    <section
      id="events"
      className="py-20 px-6 md:px-[5%]"
      style={{ background: "oklch(var(--card) / 0.4)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 fade-in-up">
          <p
            className="text-sm font-bold tracking-[0.3em] uppercase mb-3"
            style={{ color: "var(--gold)" }}
          >
            Mark Your Calendar
          </p>
          <h2
            className="font-serif mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Upcoming Events
          </h2>
          <p
            className="max-w-xl mx-auto"
            style={{ color: "var(--muted-foreground)" }}
          >
            Come as you are. Leave changed. Every gathering is an opportunity to
            encounter the living God.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{
              background:
                "linear-gradient(180deg, transparent, var(--gold), var(--gold), transparent)",
              opacity: 0.4,
            }}
          />

          <div className="flex flex-col gap-10">
            {EVENTS.map((event, i) => {
              const Icon = event.icon;
              const isRight = i % 2 === 0;
              return (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, x: isRight ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex items-center gap-6 md:gap-10 ${
                    isRight
                      ? "md:flex-row pl-14 md:pl-0"
                      : "md:flex-row-reverse pl-14 md:pl-0"
                  }`}
                  data-ocid={`events.item.${i + 1}`}
                >
                  {/* Gold dot on timeline */}
                  <div
                    className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 z-10 shadow-[0_0_12px_var(--gold)]"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
                      border: "2px solid var(--gold-dark)",
                    }}
                  />

                  {/* Spacer for opposite side on desktop */}
                  <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />

                  {/* Card */}
                  <div className="glass-panel rounded-2xl p-6 md:w-[calc(50%-2.5rem)] w-full group transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                        style={{
                          background:
                            event.type === "special"
                              ? "linear-gradient(135deg, var(--gold-dark), var(--gold-light))"
                              : "var(--glass)",
                          border:
                            event.type === "special"
                              ? "none"
                              : "1px solid var(--glass-border)",
                        }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{
                            color:
                              event.type === "special" ? "#111" : "var(--gold)",
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{ color: "var(--gold)" }}
                          >
                            {event.day}
                          </span>
                          {event.type === "special" && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{
                                background: "var(--gold)",
                                color: "#111",
                              }}
                            >
                              Special
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif font-bold text-lg leading-tight mb-1">
                          {event.title}
                        </h3>
                        <p
                          className="text-xs mb-2 font-semibold flex items-center gap-1"
                          style={{ color: "var(--gold-light)" }}
                        >
                          <Clock className="w-3 h-3" /> {event.time}
                        </p>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <a
            href="#location"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm transition-all hover:-translate-y-1 hover:shadow-gold"
            style={{
              background:
                "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
              color: "#111",
            }}
            data-ocid="events.primary_button"
          >
            <MapPin className="w-4 h-4" /> Get Directions
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ── Visit Section ─────────────────────────────────────────────────────────────
function VisitSection() {
  return (
    <section id="location" className="py-20 px-6 md:px-[5%]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 items-start">
        <div className="glass-panel rounded-2xl p-8 fade-in-left">
          <h2
            className="font-serif mb-6"
            style={{ fontSize: "1.8rem", color: "var(--gold)" }}
          >
            Visit Us
          </h2>
          <div className="flex gap-3 mb-6">
            <MapPin
              className="w-5 h-5 mt-0.5 shrink-0"
              style={{ color: "var(--gold)" }}
            />
            <p style={{ color: "var(--muted-foreground)" }}>
              85, 10th Street, Kongu Nagar, Ganapathy,
              <br />
              Coimbatore – 641006
            </p>
          </div>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--glass-border)",
              marginBottom: "1.5rem",
            }}
          />
          <h4 className="font-bold mb-4">Service Times</h4>
          <ul
            className="space-y-3"
            style={{ color: "var(--muted-foreground)" }}
          >
            <li>
              <span className="font-semibold text-foreground">
                Sunday Service:
              </span>{" "}
              8:30 AM
            </li>
            <li>
              <span className="font-semibold text-foreground">
                Promise Service:
              </span>{" "}
              1st of Month, 5:30 AM
            </li>
            <li>
              <span className="font-semibold text-foreground">
                Women&apos;s Meeting:
              </span>{" "}
              Thu, 6:00 PM
            </li>
          </ul>
          <a
            href="tel:9942386487"
            className="mt-6 flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: "var(--gold)" }}
            data-ocid="location.link"
          >
            <Phone className="w-4 h-4" /> +91 99423 86487
          </a>
        </div>
        <div
          className="md:col-span-2 fade-in-right"
          style={{
            height: "450px",
            borderRadius: "20px",
            overflow: "hidden",
            border: "2px solid var(--glass-border)",
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.147321016625!2d76.97495911480293!3d11.027581992151242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859ae3c623d57%3A0x6a2c270d19565f12!2sKongu%20Nagar%2C%20Ganapathy%2C%20Coimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Glory of Jesus Assembly location map"
          />
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  return (
    <footer className="py-16 px-6 text-center" style={{ background: "#000" }}>
      <h2 className="font-serif text-2xl mb-2" style={{ color: "var(--gold)" }}>
        Glory of Jesus Assembly
      </h2>
      <p className="mb-6" style={{ color: "#666" }}>
        Transforming Lives, Building Faith in Coimbatore.
      </p>
      <div className="flex gap-6 justify-center mb-8">
        <a
          href="https://www.instagram.com/glory_of_jesus_assembly?igsh=c29na3U4bWF6ZHpr"
          target="_blank"
          rel="noreferrer"
          title="Church Instagram"
          style={{ color: "var(--gold)", fontSize: "1.5rem" }}
          data-ocid="footer.link"
        >
          <Instagram className="w-6 h-6" />
        </a>
        <a
          href="https://www.instagram.com/gja_youthhub?igsh=MWR3bml5ZjB4dGNsYQ=="
          target="_blank"
          rel="noreferrer"
          title="Youth Hub Instagram"
          style={{ color: "var(--gold)", fontSize: "1.5rem" }}
          data-ocid="footer.link"
        >
          <Users className="w-6 h-6" />
        </a>
        <a
          href="https://youtube.com/@gloryofjesusassembly?si=Wy92ZZfm6SHX3cSm"
          target="_blank"
          rel="noreferrer"
          title="YouTube Channel"
          style={{ color: "var(--gold)", fontSize: "1.5rem" }}
          data-ocid="footer.link"
        >
          <Youtube className="w-6 h-6" />
        </a>
      </div>
      <p style={{ color: "#444", fontSize: "0.8rem" }}>
        © {year} GJA Coimbatore. All Rights Reserved.
      </p>
      <p style={{ color: "#333", fontSize: "0.75rem", marginTop: "0.5rem" }}>
        Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--gold)" }}
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}

// ── Floating Action Buttons ───────────────────────────────────────────────────
function FloatingButtons() {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-[1000]">
      <a
        href="tel:9942386487"
        title="Call Us"
        className="w-14 h-14 rounded-full flex items-center justify-center text-black shadow-gold transition-transform hover:scale-110"
        style={{ background: "var(--gold)" }}
        data-ocid="fab.button"
      >
        <span className="sr-only">Call us</span>
        <Phone className="w-5 h-5" />
      </a>
      <a
        href="https://wa.me/919942386487"
        target="_blank"
        rel="noreferrer"
        title="WhatsApp"
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-glass transition-transform hover:scale-110"
        style={{ background: "#25D366" }}
        data-ocid="fab.button"
      >
        <span className="sr-only">Chat on WhatsApp</span>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <title>WhatsApp</title>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useScrollReveal();

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className={theme}>
      <ProgressBar />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <HeroSection />
        <PastorSection />
        <MinistriesSection />
        <TestimoniesSection />
        <ScriptureSection />
        <PrayerSection />
        <EventsSection />
        <VisitSection />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
