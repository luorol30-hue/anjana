"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { content } from "@/config/content";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setIsMounted(true);
    // Initialize audio with the track from the Content Config
    const audio = new Audio(content.audio.url); 
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    const startAudio = () => {
        if (audioRef.current && !isPlaying) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.log("Audio start blocked", err));
            
            // Clean up all possible triggers
            ["click", "touchstart", "scroll", "keydown"].forEach(e => 
                window.removeEventListener(e, startAudio)
            );
        }
    };

    // Listen for any form of interaction
    ["click", "touchstart", "scroll", "keydown"].forEach(e => 
        window.addEventListener(e, startAudio)
    );

    return () => {
      ["click", "touchstart", "scroll", "keydown"].forEach(e => 
        window.removeEventListener(e, startAudio)
      );
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isPlaying]);

  const toggleMusic = () => {
    // Hidden toggle logic if needed for programmatically unmuting
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch(err => console.error(err));
      setIsPlaying(true);
    }
  };

  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);

  if (!isMounted) return null;

  return (
    <main ref={containerRef} className="relative mesh-gradient text-champagne selection:bg-gold selection:text-forest overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gold origin-left z-[60]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-forest/50 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -right-[5%] w-[60%] h-[60%] bg-gold/10 rounded-full blur-[100px]" 
        />
      </div>

      {/* No Mute Button - Transparent Interaction Layer Only */}
      <div 
        className="fixed inset-0 pointer-events-none z-[100]" 
        onClick={toggleMusic}
      />

      {/* Hero Section - Continuous Flow with Layering */}
      <section className="flex flex-col items-center justify-center relative px-6 py-12 md:py-24 text-center">
        <motion.div
           style={{ y: heroY }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 w-full max-w-[280px] md:max-w-lg group"
        >
          <div className="absolute inset-0 bg-gold/10 blur-[80px] rounded-full scale-105 -z-10" />
          <Image
            src="/images/anjana.jpeg"
            alt="Anjanaa's digital letter"
            width={800}
            height={1000}
            priority
            className="w-full h-auto object-contain rounded-[1rem] md:rounded-[2rem] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)] transition-all duration-[2s] group-hover:scale-[1.01]"
          />
        </motion.div>

        <div className="mt-12 md:mt-24 space-y-3 md:space-y-6 max-w-4xl px-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl md:text-[10rem] font-extralight tracking-tighter leading-[0.9] text-gold"
          >
             {content.hero.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 2 }}
            className="text-[10px] md:text-lg font-light tracking-[0.6em] text-champagne/40 italic uppercase"
          >
            {content.hero.subtext}
          </motion.p>
        </div>
      </section>

      {/* Deep Message - Continuous Gap */}
      <section className="flex items-center justify-center px-6 py-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <div className="w-10 h-[1px] bg-gold/30 mx-auto" />
          <p className="font-light text-2xl md:text-7xl md:leading-[1.1] text-champagne/80 font-serif italic text-balance px-4">
            &ldquo;{content.message.paragraph}&rdquo;
          </p>
        </motion.div>
      </section>

      {/* Staggered Text - Continuous flow with Gold Borders */}
      <section className="flex flex-col items-center justify-center px-6 relative py-4">
        <div className="max-w-6xl w-full mx-auto space-y-10 md:space-y-64">
          {content.staggered.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -15 : 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "text-2xl md:text-[9rem] font-serif font-extralight tracking-tighter flex items-center leading-tight",
                i % 2 === 1 ? "justify-end text-right pr-4 border-r-2 border-gold/20" : "justify-start pl-4 border-l-2 border-gold/20"
              )}
            >
              <span className="max-w-[200px] md:max-w-4xl text-champagne/70">{text}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pause Section */}
      <section className="h-[60vh] flex items-center justify-center relative bg-white/5 mx-8 md:mx-20 rounded-[3.5rem] border border-white/40">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 4 }}
          className="text-center"
        >
          <p className="text-xl md:text-3xl font-light tracking-[1em] uppercase opacity-20 select-none">
            {content.pause.text}
          </p>
        </motion.div>
      </section>

      {/* Final Interaction - Luxurious & Seamless */}
      <section className="flex flex-col items-center justify-center px-6 text-center space-y-8 md:space-y-32 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl space-y-4"
        >
          <div className="w-8 h-[1px] bg-gold/40 mx-auto" />
          <h2 className="font-serif text-3xl md:text-[10rem] font-extralight leading-tight tracking-tighter text-gold">
            {content.final.text}
          </h2>
        </motion.div>

        <InteractionButton />
      </section>

      {/* Footer */}
      <footer className="py-32 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 4 }}
          className="space-y-4"
        >
          <div className="w-12 h-[1px] bg-gold/20 mx-auto" />
          <p className="text-[10px] font-medium tracking-[2em] text-champagne/20 uppercase pl-[2em]">
            Digital Memory Collector
          </p>
        </motion.div>
      </footer>
    </main>
  );
}

function InteractionButton() {
  const [isClicked, setIsClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    setIsClicked(true);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center gap-16">
      <motion.button
        whileHover={{ scale: 1.05, y: -5, boxShadow: "0 25px 50px -12px rgba(45, 62, 53, 0.15)" }}
        whileTap={{ scale: 0.98 }}
        onClick={handleButtonClick}
        className={cn(
          "px-24 py-10 rounded-full font-bold tracking-[0.5em] transition-all duration-700 uppercase text-[10px] relative overflow-hidden",
          isClicked 
            ? "bg-gold text-forest shadow-2xl scale-110" 
            : "bg-white/5 text-champagne border border-white/10 hover:bg-gold hover:text-forest"
        )}
      >
        <span className="relative z-10">{content.interaction.button}</span>
        {!isClicked && (
          <motion.div 
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12" 
          />
        )}
      </motion.button>

      {/* Premium Pop-up Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-forest/20 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[320px] md:max-w-lg glass p-6 py-10 md:p-16 rounded-[2rem] md:rounded-[4rem] text-center space-y-6 md:space-y-10 shadow-[0_40px_80px_-20px_rgba(26,36,30,0.5)] border-2 border-white/60 overflow-hidden"
            >
              {/* Vibrant Glow Backgrounds */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-sage/50 to-transparent -z-10" />
              
              <div className="relative w-full max-w-[200px] md:max-w-[260px] aspect-[4/5] mx-auto rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border-2 border-white/20 scale-105 -mt-20 mb-6 transition-transform duration-700 hover:scale-[1.1]">
                 <Image
                    src="/images/anjana.jpeg"
                    alt="Anjanaa's picture"
                    fill
                    className="object-cover"
                />
              </div>

              <div className="space-y-3 md:space-y-5">
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.8em] text-champagne/40 font-bold pr-[-1em]">A digital note for you</p>
                <h3 className="text-2xl md:text-6xl font-serif italic text-gold leading-tight drop-shadow-[0_2px_15px_rgba(212,175,55,0.3)]">
                  {content.interaction.thankYou}
                </h3>
              </div>
              
              <div className="w-12 h-[1px] bg-gold/20 mx-auto" />
              
              <p className="text-champagne/70 font-light text-sm md:text-lg leading-relaxed max-w-[200px] md:max-w-xs mx-auto text-pretty">
                I hope you keep being exactly as you are. Seriously.
              </p>

              <button 
                onClick={() => setShowModal(false)}
                className="text-[10px] uppercase tracking-[0.4em] font-bold text-champagne/40 hover:text-gold transition-all duration-300 pt-4 block mx-auto"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isClicked && !showModal && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-serif italic text-gold/60 font-light"
        >
          {content.interaction.thankYou}
        </motion.p>
      )}
    </div>
  );
}
