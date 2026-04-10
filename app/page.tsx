"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PROJECTS = [
  {
    name: "The Glass Retreat",
    location: "Residential • Norway",
    image: "/images/portfolio_glass_retreat.jpg",
    size: "grid-md-8",
    description: "A minimalist villa overlooking a serene forest at twilight.",
  },
  {
    name: "Monolith Kitchen",
    location: "Interior • London",
    image: "/images/portfolio_monolith_kitchen.jpg",
    size: "grid-md-4",
    description: "Sleek dark cabinetry and warm pendant lighting.",
  },
  {
    name: "Concrete Garden",
    location: "Creative Office • Berlin",
    image: "/images/portfolio_concrete_garden.jpg",
    size: "grid-md-5",
    description: "Brutalist architecture softened with climbing vines.",
  },
  {
    name: "Azure Sanctuary",
    location: "Hospitality • Ibiza",
    image: "/images/portfolio_azure_sanctuary.jpg",
    size: "grid-md-7",
    description: "Outdoor infinity pool reflecting a modern beach house.",
  },
];

function ArrowForward() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

function NorthEast() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M7 7h10v10"/>
    </svg>
  );
}

function NavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-8 py-6 max-w-screen-2xl mx-auto">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-foreground">
          athen.studio
        </Link>
        <div className="hidden md:flex gap-10">
          <Link href="#portfolio" className="text-primary border-b-2 border-primary pb-1 font-medium transition-colors duration-300">Portfolio</Link>
          <Link href="#calculator" className="text-on-surface-variant hover:text-primary transition-colors duration-300">Feasibility</Link>
          <Link href="#philosophy" className="text-on-surface-variant hover:text-primary transition-colors duration-300">Philosophy</Link>
          <Link href="#contact" className="text-on-surface-variant hover:text-primary transition-colors duration-300">Contact</Link>
        </div>
        <Link href="/calculator" className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-medium scale-95 hover:scale-100 transition-transform hidden sm:block">
          Launch App
        </Link>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-48 pb-24 px-8 max-w-screen-2xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-7">
          <h1 className="text-6xl md:text-[5rem] lg:text-[7rem] leading-[0.9] font-extrabold tracking-tight text-foreground mb-8">
            We build the <span className="text-primary">spaces</span> you actually want to wake up in.
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed mb-12">
            Athen is an architectural studio for the rest of us. No ego, no jargon—just wildly thoughtful design for the places where real life happens.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/calculator" className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all">
              Run feasibility
              <ArrowForward />
            </Link>
            <Link href="#portfolio" className="text-secondary font-bold px-8 py-4 border-b-2 border-transparent hover:border-secondary transition-all">
              View latest work
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="rounded-[2.5rem] overflow-hidden aspect-[4/5] relative">
            <Image 
              src="/images/hero.jpg" 
              alt="Architectural detail" 
              fill 
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-8 -left-8 bg-secondary-container p-8 rounded-xl max-w-[240px] hidden md:block">
            <span className="text-secondary font-bold text-lg leading-tight block">&quot;Finally, a studio that gets humans.&quot;</span>
            <span className="text-on-secondary-container text-sm mt-2 block">— Architectural Digest (kinda)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Philosophy() {
  return (
    <section id="philosophy" className="py-32 bg-surface-container-low">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2 order-2 md:order-1 relative h-[600px] w-full">
            <Image 
              src="/images/philosophy.jpg" 
              alt="Bright office space" 
              fill 
              className="rounded-[2rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 object-cover"
            />
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="inline-block px-4 py-1 rounded-full border border-outline-variant text-on-surface-variant text-xs font-bold tracking-widest uppercase mb-6">Philosophy</div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">A breath of fresh air in a stale industry.</h2>
            <div className="space-y-6 text-lg text-on-surface-variant">
              <p>Most architects design for magazines. We design for the person who likes to read magazines with a coffee on a Saturday morning.</p>
              <p>We believe great design shouldn&apos;t be a luxury—it should be a fundamental requirement for living a good life. Our approach is direct, collaborative, and entirely devoid of pretense.</p>
            </div>
            <div className="mt-10 flex gap-12">
              <div>
                <div className="text-primary text-4xl font-extrabold mb-1">14+</div>
                <div className="text-sm font-bold text-foreground uppercase tracking-wider">Years Active</div>
              </div>
              <div>
                <div className="text-secondary text-4xl font-extrabold mb-1">200+</div>
                <div className="text-sm font-bold text-foreground uppercase tracking-wider">Spaces Built</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  return (
    <section id="portfolio" className="py-32 px-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-extrabold text-foreground mb-4">Latest Work.</h2>
          <p className="text-xl text-on-surface-variant">Selected projects that prove aesthetics and utility aren&apos;t enemies.</p>
        </div>
        <Link href="#" className="group flex items-center gap-4 text-primary font-bold text-lg">
          View Archive 
          <span className="w-12 h-px bg-primary group-hover:w-16 transition-all"></span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {PROJECTS.map((project, idx) => (
          <div 
            key={idx} 
            className={`${idx === 0 ? "md:col-span-8" : idx === 1 ? "md:col-span-4" : idx === 2 ? "md:col-span-5" : "md:col-span-7"} bg-surface-container-lowest rounded-xl overflow-hidden transition-transform hover:scale-[1.01]`}
          >
            <div className={`relative overflow-hidden ${idx === 0 ? "aspect-[16/9]" : idx === 1 ? "aspect-square" : idx === 2 ? "aspect-[4/3]" : "aspect-[21/9]"}`}>
              <Image 
                src={project.image} 
                alt={project.name} 
                fill 
                className="object-cover"
              />
            </div>
            <div className="p-10 flex justify-between items-start">
              <div>
                <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-2 block">{project.location}</span>
                <h3 className="text-3xl font-bold text-foreground">{project.name}</h3>
              </div>
              <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors">
                <NorthEast />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CalculatorTeaser() {
  return (
    <section id="calculator" className="py-24 px-8 max-w-screen-2xl mx-auto">
       <div className="bg-surface-container-low rounded-[3rem] p-12 md:p-24 border border-outline-variant/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">Feasibility Tool</div>
            <h2 className="text-5xl font-extrabold text-foreground leading-[1.1] mb-8">
              Analyze your next development in seconds.
            </h2>
            <p className="text-xl text-on-surface-variant leading-relaxed mb-10">
              Stop guessing and start building with data. Our custom-built calculator handles Victorian stamp duty, construction costs, and profit margins—so you can focus on the design.
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/calculator" className="bg-primary text-on-primary px-8 py-5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20">
                Launch Full Calculator
                <ArrowForward />
              </Link>
            </div>
          </div>
          <div className="bg-background p-8 rounded-[2rem] shadow-2xl border border-outline-variant/30">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                <span className="text-on-surface-variant font-medium">Purchase Price</span>
                <span className="text-foreground font-bold">$900,000</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                <span className="text-on-surface-variant font-medium">Stamp Duty (VIC)</span>
                <span className="text-foreground font-bold">$49,070</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                <span className="text-on-surface-variant font-medium">Construction Cost</span>
                <span className="text-foreground font-bold text-primary">$1,200,000</span>
              </div>
              <div className="bg-primary-container/20 p-6 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Target Margin</div>
                  <div className="text-3xl font-extrabold text-primary">24.2%</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary text-on-primary flex items-center justify-center">
                  <ArrowForward />
                </div>
              </div>
            </div>
          </div>
        </div>
       </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-32 px-8 max-w-screen-2xl mx-auto">
      <div className="bg-primary rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-on-primary mb-8 tracking-tight">Ready to build something human?</h2>
            <p className="text-xl text-primary-container leading-relaxed mb-10">
              Tell us a bit about your project. No pressure, no boring sales pitch—just a friendly chat about what you&apos;re dreaming up.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center text-on-primary group-hover:bg-primary-container transition-all">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div>
                  <h4 className="text-on-primary font-bold">Talk to us</h4>
                  <p className="text-primary-container/80">hello@athen.studio</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center text-on-primary group-hover:bg-primary-container transition-all">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h4 className="text-on-primary font-bold">Visit us</h4>
                  <p className="text-primary-container/80">142 Studio Street, East London</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-background p-10 rounded-[2rem] shadow-2xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant ml-1">Your Name</label>
                  <input className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl p-4 text-foreground placeholder:text-on-surface-variant/50" placeholder="Human Being" type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant ml-1">Email Address</label>
                  <input className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl p-4 text-foreground placeholder:text-on-surface-variant/50" placeholder="human@example.com" type="email"/>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant ml-1">What are we building?</label>
                <textarea className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl p-4 text-foreground placeholder:text-on-surface-variant/50" placeholder="Tell us the vibe..." rows={4}></textarea>
              </div>
              <button className="w-full bg-primary text-on-primary font-bold py-5 rounded-xl hover:scale-[0.98] transition-transform shadow-lg shadow-primary/20" type="submit">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full rounded-t-[2rem] mt-20 bg-surface-container-low">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-12 py-20 max-w-screen-2xl mx-auto">
        <div>
          <span className="text-xl font-bold text-foreground block mb-4">athen.studio</span>
          <p className="leading-relaxed text-sm text-on-surface-variant max-w-xs">
            Architectural design for humans. We make spaces feel like home, even before you move in.
          </p>
        </div>
        <div className="flex flex-col md:items-end gap-8">
          <div className="flex gap-8">
            <Link href="#" className="text-on-surface-variant hover:text-secondary transition-all text-sm opacity-80 hover:opacity-100">Instagram</Link>
            <Link href="#" className="text-on-surface-variant hover:text-secondary transition-all text-sm opacity-80 hover:opacity-100">LinkedIn</Link>
            <Link href="#" className="text-on-surface-variant hover:text-secondary transition-all text-sm opacity-80 hover:opacity-100">Contact</Link>
          </div>
          <p className="leading-relaxed text-sm text-on-surface-variant opacity-80">
            © 2026 Athen Studio. Built for humans.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <NavBar />
      <Hero />
      <Philosophy />
      <Portfolio />
      <CalculatorTeaser />
      <Contact />
      <Footer />
    </div>
  );
}
