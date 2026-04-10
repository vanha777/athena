"use client";

import { useState } from "react";

const PROJECTS = [
  {
    name: "Westbury Residences",
    suburb: "Thornbury",
    status: "Coming Soon" as const,
    type: "Multi-Dwelling",
    description: "Four considered townhomes in one of Melbourne's most sought-after northside pockets.",
    beds: "3-4",
    price: "From $1.1M",
  },
  {
    name: "Seaview Place",
    suburb: "Frankston South",
    status: "Now Selling" as const,
    type: "Subdivision",
    description: "Three premium lots with bay glimpses, minutes from the beach and village shops.",
    beds: "N/A",
    price: "From $680K",
  },
  {
    name: "Elm & Co",
    suburb: "Northcote",
    status: "Completed" as const,
    type: "Knockdown Rebuild",
    description: "A bold dual-occ build that replaced a tired weatherboard with two modern family homes.",
    beds: "4",
    price: "Sold",
  },
];

const STATUS_STYLES = {
  "Now Selling": "bg-muted-olive text-white",
  "Coming Soon": "bg-warm-stone text-charcoal",
  Completed: "bg-slate text-white",
};

function Logo() {
  return (
    <svg
      width="180"
      height="32"
      viewBox="0 0 500 80"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-auto"
    >
      <g transform="translate(30, 10)">
        <path d="M0 60 L30 0" fill="none" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M30 0 L60 60" fill="none" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="10" y1="42" x2="78" y2="42" stroke="#B8A89A" strokeWidth="1.8" strokeLinecap="round" />
        <text x="86" y="52" fontFamily="var(--font-geist-sans), Helvetica, Arial, sans-serif" fontSize="36" fontWeight="300" fill="#1A1A1A" letterSpacing="1">
          athen.studio
        </text>
      </g>
    </svg>
  );
}

function LogoWhite() {
  return (
    <svg
      width="180"
      height="32"
      viewBox="0 0 500 80"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-auto"
    >
      <g transform="translate(30, 10)">
        <path d="M0 60 L30 0" fill="none" stroke="#F8F6F3" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M30 0 L60 60" fill="none" stroke="#F8F6F3" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="10" y1="42" x2="78" y2="42" stroke="#B8A89A" strokeWidth="1.8" strokeLinecap="round" />
        <text x="86" y="52" fontFamily="var(--font-geist-sans), Helvetica, Arial, sans-serif" fontSize="36" fontWeight="300" fill="#F8F6F3" letterSpacing="1">
          athen.studio
        </text>
      </g>
    </svg>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-off-white/90 backdrop-blur-sm border-b border-warm-stone/20">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <a href="#" aria-label="athen.studio home">
          <Logo />
        </a>
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm tracking-wide font-light text-charcoal">
          <a href="#projects" className="hover:text-warm-stone transition-colors">Projects</a>
          <a href="#about" className="hover:text-warm-stone transition-colors">About</a>
          <a href="#contact" className="hover:text-warm-stone transition-colors">Contact</a>
          <a href="/calculator" className="hover:text-warm-stone transition-colors">Calculator</a>
        </div>
        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-charcoal"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" strokeLinecap="round" />
                <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
                <line x1="4" y1="17" x2="20" y2="17" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-warm-stone/20 bg-off-white px-6 py-6 flex flex-col gap-4 text-sm tracking-wide font-light">
          <a href="#projects" onClick={() => setOpen(false)} className="py-2">Projects</a>
          <a href="#about" onClick={() => setOpen(false)} className="py-2">About</a>
          <a href="#contact" onClick={() => setOpen(false)} className="py-2">Contact</a>
          <a href="/calculator" onClick={() => setOpen(false)} className="py-2">Calculator</a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-end bg-charcoal overflow-hidden">
      {/* Architectural pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="80" stroke="#F8F6F3" strokeWidth="0.5" />
              <line x1="0" y1="0" x2="80" y2="0" stroke="#F8F6F3" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Warm stone accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-warm-stone" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-16 pt-32 md:pb-24">
        <p className="text-warm-stone text-sm tracking-[0.3em] uppercase mb-6 font-light">Melbourne Property Development</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-off-white leading-[1.1] tracking-tight max-w-3xl">
          Homes people actually
          <br />
          <span className="text-warm-stone">want to live in.</span>
        </h1>
        <p className="mt-8 text-lg md:text-xl font-light text-off-white/70 max-w-xl leading-relaxed">
          We're a design-led developer building considered homes across Melbourne.
          No jargon, no gimmicks — just thoughtful design and honest builds.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <a
            href="#projects"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-warm-stone text-charcoal text-sm tracking-wide font-normal hover:bg-warm-stone/90 transition-colors"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-off-white/30 text-off-white text-sm tracking-wide font-light hover:border-warm-stone hover:text-warm-stone transition-colors"
          >
            Register Interest
          </a>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="py-20 md:py-28 bg-off-white">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-warm-stone text-sm tracking-[0.3em] uppercase mb-3 font-light">Our Work</p>
        <h2 className="text-3xl md:text-4xl font-extralight text-charcoal tracking-tight mb-4">
          Current Projects
        </h2>
        <p className="text-slate font-light max-w-lg mb-14">
          Each project starts with a question: would we want to live here? If the answer's yes, we build it.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {PROJECTS.map((project) => (
            <div
              key={project.name}
              className="group bg-white border border-warm-stone/15 hover:border-warm-stone/40 transition-all duration-300"
            >
              {/* Placeholder image area */}
              <div className="aspect-[4/3] bg-charcoal/[0.03] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="60" height="60" viewBox="0 0 60 60" className="text-warm-stone/30">
                    <path d="M0 60 L30 0 L60 60" fill="none" stroke="currentColor" strokeWidth="1" />
                    <line x1="10" y1="42" x2="50" y2="42" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>
                <span
                  className={`absolute top-4 left-4 text-xs tracking-wide px-3 py-1.5 ${STATUS_STYLES[project.status]}`}
                >
                  {project.status}
                </span>
              </div>
              <div className="p-6">
                <p className="text-xs text-muted-olive tracking-wider uppercase mb-1">{project.suburb}</p>
                <h3 className="text-xl font-light text-charcoal tracking-tight mb-2">
                  {project.name}
                </h3>
                <p className="text-sm text-slate font-light leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-warm-stone/10">
                  <span className="text-sm font-light text-charcoal">{project.price}</span>
                  <span className="text-xs text-muted-olive">{project.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-charcoal">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-warm-stone text-sm tracking-[0.3em] uppercase mb-3 font-light">Who We Are</p>
            <h2 className="text-3xl md:text-4xl font-extralight text-off-white tracking-tight mb-6">
              A breath of fresh air
              <br />
              in a stale industry.
            </h2>
            <div className="space-y-4 text-off-white/70 font-light leading-relaxed">
              <p>
                We started athen.studio because we were tired of the same cookie-cutter
                developments popping up everywhere. The ones where the render looks nothing
                like the final build and "quality finishes" means laminate everything.
              </p>
              <p>
                We're a small team that actually cares about what we put out into the world.
                Every project gets our full attention — from site selection to the final coat
                of paint. We work with architects who share our standards, and we build homes
                we'd happily move into ourselves.
              </p>
              <p>
                Based in Melbourne. Design-obsessed. Quietly getting on with it.
              </p>
            </div>
          </div>
          <div className="space-y-8">
            {[
              { label: "Design-Led", desc: "Architecture first, spreadsheet second. Every home is designed to be lived in, not just sold." },
              { label: "Transparent", desc: "Real pricing, honest timelines, no surprises. We share the numbers because we've got nothing to hide." },
              { label: "Considered", desc: "We don't build everything everywhere. We pick the right sites and do them properly." },
            ].map((item) => (
              <div key={item.label} className="border-l-2 border-warm-stone pl-6">
                <h3 className="text-lg font-light text-off-white mb-1">{item.label}</h3>
                <p className="text-sm text-off-white/60 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-off-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-warm-stone text-sm tracking-[0.3em] uppercase mb-3 font-light">Get in Touch</p>
            <h2 className="text-3xl md:text-4xl font-extralight text-charcoal tracking-tight mb-6">
              Interested? Let's chat.
            </h2>
            <p className="text-slate font-light leading-relaxed mb-8 max-w-md">
              Whether you're a buyer, investor, or agent — we'd love to hear from you.
              Drop us a line and we'll get back to you within 24 hours.
            </p>
            <div className="space-y-3 text-sm text-slate font-light">
              <p>Melbourne, Australia</p>
              <p>hello@athen.studio</p>
            </div>
          </div>
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div>
              <label htmlFor="name" className="block text-xs tracking-wider uppercase text-muted-olive mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 bg-white border border-warm-stone/20 text-charcoal text-sm font-light focus:outline-none focus:border-warm-stone transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs tracking-wider uppercase text-muted-olive mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-white border border-warm-stone/20 text-charcoal text-sm font-light focus:outline-none focus:border-warm-stone transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs tracking-wider uppercase text-muted-olive mb-2">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-3 bg-white border border-warm-stone/20 text-charcoal text-sm font-light focus:outline-none focus:border-warm-stone transition-colors"
                placeholder="Optional"
              />
            </div>
            <div>
              <label htmlFor="interest" className="block text-xs tracking-wider uppercase text-muted-olive mb-2">Interested In</label>
              <select
                id="interest"
                name="interest"
                className="w-full px-4 py-3 bg-white border border-warm-stone/20 text-charcoal text-sm font-light focus:outline-none focus:border-warm-stone transition-colors appearance-none"
              >
                <option value="">Select a project</option>
                {PROJECTS.filter((p) => p.status !== "Completed").map((p) => (
                  <option key={p.name} value={p.name}>{p.name} — {p.suburb}</option>
                ))}
                <option value="general">General enquiry</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-xs tracking-wider uppercase text-muted-olive mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full px-4 py-3 bg-white border border-warm-stone/20 text-charcoal text-sm font-light focus:outline-none focus:border-warm-stone transition-colors resize-none"
                placeholder="Tell us what you're looking for..."
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-3.5 bg-charcoal text-off-white text-sm tracking-wide font-light hover:bg-charcoal/90 transition-colors"
            >
              Send Enquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-charcoal border-t border-warm-stone/10 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <LogoWhite />
          <div className="flex gap-8 text-xs text-off-white/40 font-light tracking-wide">
            <a href="#projects" className="hover:text-warm-stone transition-colors">Projects</a>
            <a href="#about" className="hover:text-warm-stone transition-colors">About</a>
            <a href="#contact" className="hover:text-warm-stone transition-colors">Contact</a>
            <a href="/calculator" className="hover:text-warm-stone transition-colors">Calculator</a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-off-white/5 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-xs text-off-white/30 font-light">
            &copy; 2026 Athena Irons Holding Pty Ltd. All rights reserved.
          </p>
          <p className="text-xs text-off-white/30 font-light">
            Melbourne, Australia
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
