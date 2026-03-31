"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { content } from "@/config/content";
import { Volume2, VolumeX } from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = "",
  y = 24,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Star field ──────────────────────────────────────────────────────────────
function StarField() {
  const [stars] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      dur: Math.random() * 8 + 4,
      delay: Math.random() * 6,
    }))
  );
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-gold/40"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function ConfettiBlast() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: ["#d4af37", "#f7e7ce", "#ff6b8a", "#a3e635", "#60d5ff", "#fbbf24"][
      Math.floor(Math.random() * 6)
    ],
    x: (Math.random() - 0.5) * 120,
    rotate: Math.random() * 720 - 360,
    delay: Math.random() * 0.4,
    size: Math.random() * 10 + 6,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-[500] flex items-center justify-center">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ backgroundColor: p.color, width: p.size, height: p.size * 0.6 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: `${p.x}vw`,
            y: ["0vh", "-20vh", "90vh"],
            opacity: [1, 1, 0],
            rotate: p.rotate,
          }}
          transition={{ duration: 2.5, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Home() {
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsUnmute, setNeedsUnmute] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prankAudioRef = useRef<HTMLAudioElement | null>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const startExperience = () => {
    setHasUnlocked(true);
    if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.volume = 0.35;
        audioRef.current.play().then(() => {
            setIsPlaying(true);
            setIsMuted(false);
        }).catch(err => console.error("Audio play failed:", err));
    }
  };

  useEffect(() => {
    if (!isMounted) return;

    // Main Romantic Music (Requested Pixabay URL)
    let audio: HTMLAudioElement;
    try {
      audio = new Audio("https://cdn.pixabay.com/audio/2025/07/17/audio_ba311fbaa0.mp3");
    } catch {
      return;
    }
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    // Prank Comedy Music
    let prankAudio: HTMLAudioElement;
    try {
      prankAudio = new Audio("https://cdn.pixabay.com/audio/2024/09/26/audio_249ea3656c.mp3");
    } catch {
      return;
    }
    prankAudio.volume = 0.5;
    prankAudioRef.current = prankAudio;

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      prankAudioRef.current?.pause();
      prankAudioRef.current = null;
    };
  }, [isMounted]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMuted || audioRef.current.muted) {
      audioRef.current.muted = false;
      audioRef.current.volume = 0.35;
      setIsMuted(false);
      setNeedsUnmute(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <main className="relative bg-[#0d120f] text-[#f7e7ce] overflow-x-hidden selection:bg-[#d4af37] selection:text-[#0d120f]">
      <AnimatePresence>
        {!hasUnlocked && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0d120f] bg-opacity-95 backdrop-blur-xl"
           >
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={startExperience}
               className="group relative px-12 py-6 rounded-full border border-[#d4af37]/30 bg-white/5 text-[#f7e7ce] transition-all duration-500 overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] hover:shadow-[0_0_80px_rgba(212,175,55,0.25)] hover:border-[#d4af37]/60"
             >
               <motion.div 
                 className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent"
                 animate={{ x: ['-100%', '200%'] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               />
               <div className="relative z-10 flex flex-col items-center gap-3">
                 <p className="text-[10px] tracking-[0.6em] uppercase text-[#d4af37]/60">a surprise from local</p>
                 <span className="text-xl font-serif tracking-widest uppercase">Unlock Experience</span>
               </div>
             </motion.button>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#d4af37] via-[#f7e7ce] to-[#d4af37] origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />

      <StarField />

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/3 -left-1/3 w-full h-full rounded-full blur-[150px]"
          style={{ backgroundColor: "rgba(26,36,30,0.8)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/3 -right-1/3 w-full h-full rounded-full blur-[150px]"
          style={{ backgroundColor: "rgba(212,175,55,0.06)" }}
        />
      </div>

      {/* Music button */}
      <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-3">
        <AnimatePresence>
          {needsUnmute && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-[9px] uppercase tracking-[0.2em] text-[#f7e7ce]/40 whitespace-nowrap pointer-events-none"
            >
              tap to unmute
            </motion.span>
          )}
        </AnimatePresence>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          onClick={toggleMusic}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-[#d4af37]/30 transition-all duration-500 relative"
        >
          {isPlaying && !isMuted && (
            <motion.span
              className="absolute inset-0 rounded-full border border-[#d4af37]/30"
              animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-[#f7e7ce]/40" />
          ) : (
            <Volume2 className={`w-4 h-4 ${isPlaying ? "text-[#d4af37]/80" : "text-[#f7e7ce]/30"}`} />
          )}
        </motion.button>
      </div>

      <HeroSection />
      <ReasonsSection />
      <TimelineSection />
      <ConfessionSection />
      <ProposalSection 
        audioRef={audioRef}
        prankAudioRef={prankAudioRef}
      />
      <Footer />
    </main>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative px-6 py-20 text-center overflow-hidden">
      {/* Giant watermark letter */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-serif font-extralight leading-none tracking-tighter"
          style={{ fontSize: "45vw", color: "rgba(212,175,55,0.025)" }}
        >
          A
        </span>
      </div>

      {/* Photo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <div className="relative w-44 h-44 md:w-64 md:h-64 rounded-full overflow-hidden border border-[#d4af37]/20 shadow-[0_0_100px_-10px_rgba(212,175,55,0.25)]">
          <Image
            src="/images/anjana.jpeg"
            alt="Anjana"
            fill
            sizes="(max-width:768px) 176px, 256px"
            className="object-cover"
            priority
          />
        </div>
        {/* Rings */}
        {[1.2, 1.5, 1.8].map((scale, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-[#d4af37]/10"
            animate={{ scale: [1, scale, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 4, delay: i * 1.2, repeat: Infinity }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 space-y-4 z-10"
      >
        <p className="text-[10px] tracking-[0.5em] uppercase text-[#d4af37]/40">
          a special message for
        </p>
        <h1
          className="font-serif font-extralight tracking-tighter text-[#d4af37] leading-none"
          style={{ fontSize: "clamp(4rem, 15vw, 12rem)" }}
        >
          {content.hero.title}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 2 }}
          className="text-[#f7e7ce]/50 text-sm md:text-lg font-light max-w-sm mx-auto leading-relaxed italic"
        >
          &ldquo;{content.hero.subtitle}&rdquo;
        </motion.p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 2 }}
        className="mt-16 flex flex-col items-center gap-2 z-10"
      >
        <p className="text-[9px] tracking-[0.4em] uppercase text-[#f7e7ce]/20">scroll</p>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[1px] h-10 bg-gradient-to-b from-[#d4af37]/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ─── Reasons ──────────────────────────────────────────────────────────────────
function ReasonsSection() {
  return (
    <section className="px-5 py-24 relative">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-16 space-y-3">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#d4af37]/40">
            documented evidence
          </p>
          <h2
            className="font-serif font-extralight tracking-tight text-[#f7e7ce]/90"
            style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
          >
            Why you&apos;re different.
          </h2>
          <div className="w-16 h-px bg-[#d4af37]/20 mx-auto" />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.reasons.map((r, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-full rounded-2xl p-6 border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm hover:border-[#d4af37]/20 hover:bg-white/[0.06] transition-colors duration-500"
              >
                <div className="text-3xl mb-4">{r.emoji}</div>
                <h3 className="font-serif text-xl text-[#d4af37]/90 mb-2 font-light">
                  {r.title}
                </h3>
                <p className="text-[#f7e7ce]/45 text-sm leading-relaxed font-light">
                  {r.desc}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
function TimelineSection() {
  return (
    <section className="px-5 py-24 relative">
      <div className="max-w-2xl mx-auto">
        <FadeIn className="text-center mb-20 space-y-3">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#d4af37]/40">
            how we got here
          </p>
          <h2
            className="font-serif font-extralight tracking-tight text-[#f7e7ce]/90"
            style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
          >
            The chapters.
          </h2>
          <div className="w-16 h-px bg-[#d4af37]/20 mx-auto" />
        </FadeIn>

        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-[#d4af37]/20 to-transparent" />

          <div className="space-y-14">
            {content.timeline.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="relative">
                  {/* Dot */}
                  <div className="absolute -left-8 top-1.5 w-6 h-6 rounded-full border border-[#d4af37]/30 bg-[#0d120f] flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-[#d4af37]/60"
                    />
                  </div>
                  <p className="text-[10px] tracking-[0.4em] uppercase text-[#d4af37]/40 mb-1">
                    {item.chapter}
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl text-[#f7e7ce]/90 font-light mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#f7e7ce]/45 text-sm leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Confession build-up ──────────────────────────────────────────────────────
function ConfessionSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center relative">
      {/* Warm glow rising */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 4 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(136,19,55,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="space-y-10 max-w-2xl z-10">
        <FadeIn>
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#d4af37]/40">
            okay… I need to say something
          </p>
        </FadeIn>

        {content.confession.map((line, i) => (
          <FadeIn key={i} delay={i * 0.3} y={30}>
            <p
              className="font-serif italic font-light tracking-tight"
              style={{
                fontSize: `clamp(${1.5 + i * 0.4}rem, ${4 + i * 1.5}vw, ${3 + i * 1.5}rem)`,
                color: `rgba(247,231,206,${0.6 + i * 0.2})`,
              }}
            >
              {line}
            </p>
          </FadeIn>
        ))}

        <FadeIn delay={1.2}>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="mt-4"
          >
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#f7e7ce]/20">
              keep scrolling…
            </p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-10 bg-gradient-to-b from-[#d4af37]/20 to-transparent mx-auto mt-3"
            />
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Proposal (THE PRANK) ──────────────────────────────────────────────────────
function ProposalSection({ 
    audioRef, 
    prankAudioRef 
}: { 
    audioRef: React.RefObject<HTMLAudioElement | null>, 
    prankAudioRef: React.RefObject<HTMLAudioElement | null> 
}) {
  const [stage, setStage] = useState<"buildup" | "proposal" | "error" | "gotcha" | "love">("buildup");
  const [noPos, setNoPos] = useState({ top: 0, left: 0, ready: false });
  const [showConfetti, setShowConfetti] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Auto-advance buildup → proposal
  useEffect(() => {
    if (inView && stage === "buildup") {
      const t = setTimeout(() => setStage("proposal"), 1200);
      return () => clearTimeout(t);
    }
  }, [inView, stage]);

  useEffect(() => {
    if (stage !== "proposal") return;
    const t = setTimeout(() => {
      if (noButtonRef.current) {
        const rect = noButtonRef.current.getBoundingClientRect();
        setNoPos({ top: rect.top, left: rect.left, ready: true });
      }
    }, 600);
    return () => clearTimeout(t);
  }, [stage]);

  const escapeNo = () => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const bw = noButtonRef.current?.offsetWidth ?? 110;
    const bh = noButtonRef.current?.offsetHeight ?? 48;
    const pad = 20;
    setNoPos({
      top: Math.random() * (H - bh - pad * 2) + pad,
      left: Math.random() * (W - bw - pad * 2) + pad,
      ready: true,
    });
  };

  const handleYes = () => {
    // Fade out romantic music
    if (audioRef.current) {
      const currentVol = audioRef.current.volume;
      const fadeOut = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.02) {
          audioRef.current.volume -= 0.02;
        } else {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          clearInterval(fadeOut);
        }
      }, 50);
    }

    // Play prank music
    if (prankAudioRef.current) {
      prankAudioRef.current.currentTime = 0;
      prankAudioRef.current.play().catch(() => { });
    }

    setStage("error");
    setTimeout(() => {
      setShowConfetti(true);
      setStage("gotcha");
    }, 3500);
  };

  const roots = {
    buildup: (
      <motion.div
        key="buildup"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl"
        >
          🎁
        </motion.div>
        <p className="text-[#f7e7ce]/30 text-sm tracking-[0.3em] uppercase animate-pulse">Decrypting Surprise...</p>
      </motion.div>
    ),

    proposal: (
      <motion.div
        key="proposal"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-12 max-w-lg z-10 w-full"
      >
        {["❤️", "💕", "💖", "💗", "💝", "🥰"].map((h, i) => (
          <motion.span
            key={i}
            className="fixed pointer-events-none select-none text-3xl"
            style={{
              left: `${10 + i * 14}%`,
              top: `${15 + Math.sin(i * 1.2) * 15}%`,
              zIndex: 10,
            }}
            animate={{
              y: [-25, 25, -25],
              opacity: [0.1, 0.8, 0.1],
              rotate: [-15, 15, -15],
              scale: [0.8, 1.1, 0.8]
            }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.2 }}
          >
            {h}
          </motion.span>
        ))}

        <div className="inline-block px-4 py-1.5 rounded-full border border-pink-500/40 bg-pink-500/10 text-[10px] tracking-[0.6em] uppercase text-pink-300 font-bold animate-pulse">
          FINAL DECISION REQUIRED
        </div>

        <motion.h2
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="font-serif font-extralight tracking-tight text-pink-50 text-shadow-glow"
          style={{ fontSize: "clamp(3.5rem, 12vw, 8rem)", lineHeight: 0.9 }}
        >
          {content.prank.question}
        </motion.h2>

        <div className="flex justify-center items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.1, y: -6, boxShadow: "0 0 30px rgba(236,72,153,0.6)" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleYes}
            className="relative px-12 py-6 rounded-full font-bold tracking-[0.4em] uppercase text-sm text-white overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #ec4899, #f43f5e)",
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                transform: "skewX(-20deg)",
              }}
            />
            <span className="relative z-10">{content.prank.yesLabel}</span>
          </motion.button>

          <div
            className="px-8 py-4 opacity-0 pointer-events-none select-none text-xs"
            aria-hidden
          >
            {content.prank.noLabel}
          </div>
        </div>
      </motion.div>
    ),

    error: (
      <motion.div
        key="error"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="text-left font-mono z-[100] max-w-lg bg-red-950/90 border-2 border-red-500 p-8 rounded-lg shadow-[0_0_100px_rgba(239,68,68,0.5)]"
      >
        <div className="flex items-center gap-3 mb-4 text-red-500">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <h3 className="text-xl font-bold tracking-widest">{content.prank.errorTitle}</h3>
        </div>
        <p className="text-red-200/80 text-sm leading-relaxed mb-6">
          {content.prank.errorMsg}
        </p>
        <div className="space-y-2 text-[10px] text-red-500/50">
          <p>{"> Initializing friendship_override.bat..."}</p>
          <p>{"> Clearing user_denial_v2.dll..."}</p>
          <p>{"> Succesfully injected \"Bestie Forever\" script."}</p>
          <motion.p
            animate={{ opacity: [0, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="text-red-500 font-bold"
          >{"> SYSTEM REBOOTING..."}</motion.p>
        </div>
      </motion.div>
    ),

    gotcha: (
      <motion.div
        key="gotcha"
        initial={{ opacity: 0, scale: 1.5, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="text-center space-y-8 max-w-md z-10 px-4"
      >
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, -15, 15, -15, 15, 0]
          }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="text-8xl mb-4"
        >
          🫠
        </motion.div>
        <h2
          className="font-serif font-extralight tracking-tight text-[#d4af37] leading-none"
          style={{ fontSize: "clamp(3.5rem, 12vw, 8rem)" }}
        >
          {content.prank.reveal}
        </h2>
        <div className="w-24 h-px bg-[#d4af37]/40 mx-auto" />
        <p className="text-[#f7e7ce] text-xl md:text-2xl font-light leading-relaxed">
          {content.prank.subReveal}
        </p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-[#f7e7ce]/60 text-lg font-light leading-relaxed max-w-sm mx-auto"
        >
          {content.prank.friendship}
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          onClick={() => setStage("love")}
          className="text-[12px] uppercase tracking-[0.6em] text-[#d4af37] font-bold border-2 border-[#d4af37]/30 hover:border-[#d4af37] px-12 py-4 rounded-full transition-all duration-300 bg-[#d4af37]/5"
        >
          i fell for it 🤡
        </motion.button>
      </motion.div>
    ),

    love: (
      <motion.div
        key="love"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="text-center space-y-8 max-w-md z-10 px-4"
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl"
        >
          ✨🫶✨
        </motion.div>
        <h2
          className="font-serif font-extralight tracking-tight text-[#f7e7ce]"
          style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
        >
          The Real Talk.
        </h2>
        <div className="w-16 h-px bg-[#d4af37]/20 mx-auto" />
        <p className="text-[#f7e7ce]/70 font-light leading-relaxed text-lg italic">
          "People like you are the reason some of us still believe in genuine connections."
        </p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="font-serif italic text-[#d4af37] text-2xl font-light"
        >
          {content.prank.final}
        </motion.p>
      </motion.div>
    ),
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center relative px-6 py-24 text-center overflow-hidden"
    >
      {/* Romantic glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={stage === "proposal" ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(190,18,60,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Confetti */}
      {showConfetti && <ConfettiBlast />}

      {/* Runaway NO button — fixed, escapes viewport-safely */}
      {stage === "proposal" && (
        <motion.button
          ref={noButtonRef}
          animate={noPos.ready ? { top: noPos.top, left: noPos.left } : {}}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          onMouseEnter={escapeNo}
          onHoverStart={escapeNo}
          onTouchStart={escapeNo}
          onClick={escapeNo}
          className="fixed z-[300] px-8 py-4 rounded-full font-bold tracking-[0.3em] uppercase text-[10px] text-[#f7e7ce]/50 border border-white/10 bg-white/5 backdrop-blur-sm"
          style={
            noPos.ready
              ? { cursor: "not-allowed" }
              : { opacity: 0, pointerEvents: "none" }
          }
          aria-label="No"
        >
          {content.prank.noLabel}
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {roots[stage]}
      </AnimatePresence>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-24 text-center">
      <FadeIn>
        <div className="space-y-4">
          <div className="w-12 h-px bg-[#d4af37]/15 mx-auto" />
          <p className="text-[9px] font-medium tracking-[2em] text-[#f7e7ce]/15 uppercase pl-[2em]">
            made with ♥ just for you
          </p>
        </div>
      </FadeIn>
    </footer>
  );
}
