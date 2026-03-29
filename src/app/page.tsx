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
    // Initialize audio
    audioRef.current = new Audio("https://www.fesliyanstudios.com/download-link.php?id=391"); // Sample soft piano
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Audio playback failed", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);

  if (!isMounted) return null;

  return (
    <main ref={containerRef} className="relative mesh-gradient text-[#2d2d2d] selection:bg-sage selection:text-[#2d2d2d] overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-sage origin-left z-[60]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-sage/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -right-[5%] w-[60%] h-[60%] bg-beige/20 rounded-full blur-[100px]" 
        />
      </div>

      {/* Background Audio Toggle */}
      <button 
        onClick={toggleMusic}
        className="fixed top-8 right-8 z-50 p-4 glass rounded-full hover:scale-110 active:scale-95 transition-all duration-500 group shadow-xl"
        aria-label="Toggle Music"
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-[#2d2d2d] animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-[#2d2d2d]/30" />
        )}
      </button>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-8 py-20">
        <motion.div
           style={{ y: heroY }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm aspect-[3/4] group"
        >
          <div className="absolute inset-0 bg-sage/20 blur-3xl rounded-full scale-105 -z-10" />
          <Image
            src="/images/anjana.jpeg"
            alt="Anjanaa's digital letter"
            fill
            priority
            className="object-cover rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(45,62,53,0.1)] transition-transform duration-[2s] group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent rounded-[3rem]" />
        </motion.div>

        <div className="mt-20 text-center space-y-8 max-w-2xl px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="font-serif text-6xl md:text-9xl font-extralight tracking-tighter leading-none"
          >
            {content.hero.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1.5 }}
            className="text-xl md:text-2xl font-light tracking-[0.3em] text-[#2d2d2d]/40 italic uppercase"
          >
            {content.hero.subtext}
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 3, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-24 bg-gradient-to-b from-[#2d2d2d] to-transparent" />
        </motion.div>
      </section>

      {/* Deep Message Section */}
      <section className="min-h-screen flex items-center justify-center px-8 py-32 relative">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="font-light text-4xl md:text-6xl leading-tight text-[#2d2d2d]/90 font-serif italic text-balance">
            &ldquo;{content.message.paragraph}&rdquo;
          </p>
        </motion.div>
      </section>

      {/* Staggered Text Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-8 relative">
        <div className="max-w-5xl w-full mx-auto space-y-32 md:space-y-48 py-20">
          {content.staggered.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.4, duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "text-5xl md:text-8xl font-serif font-extralight tracking-tighter flex items-center gap-12",
                i % 2 === 1 ? "justify-end text-right" : "justify-start"
              )}
            >
              {i % 2 === 0 && <div className="hidden md:block w-32 h-[1px] bg-gradient-to-r from-blush to-transparent" />}
              <span className="max-w-xl">{text}</span>
              {i % 2 === 1 && <div className="hidden md:block w-32 h-[1px] bg-gradient-to-l from-blush to-transparent" />}
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

      {/* Final Message & Interaction */}
      <section className="min-h-screen flex flex-col items-center justify-center px-8 text-center space-y-24 py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h2 className="font-serif text-5xl md:text-8xl font-light leading-none tracking-tighter">
            {content.final.text}
          </h2>
        </motion.div>

        <InteractionButton />
      </section>
      
      {/* Footer */}
      <footer className="py-24 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 3 }}
        >
          <p className="text-[10px] font-light tracking-[1.5em] text-[#2d2d2d]/20 uppercase">
            A digital letter for Anjanaa
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
            ? "bg-forest text-white shadow-2xl scale-110" 
            : "bg-sage text-forest shadow-lg hover:bg-forest hover:text-white"
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg glass p-8 md:p-16 rounded-[4rem] text-center space-y-8 shadow-[0_50px_100px_-20px_rgba(45,62,53,0.3)] border-2 border-white/50 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-sage/30 to-transparent -z-10" />
              
              <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white/80 scale-110 -mt-10 mb-4 transition-transform duration-700 hover:scale-[1.15]">
                 <Image
                    src="/images/anjana.jpeg"
                    alt="Anjanaa's picture"
                    fill
                    className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.8em] text-forest/50 font-bold">A digital note for you</p>
                <h3 className="text-4xl md:text-5xl font-serif italic text-forest leading-[1.2]">
                  {content.interaction.thankYou}
                </h3>
              </div>
              
              <div className="w-12 h-[1px] bg-sage mx-auto" />
              
              <p className="text-forest/80 font-light text-base leading-relaxed max-w-xs mx-auto text-pretty">
                I hope you keep being exactly as you are. Seriously.
              </p>

              <button 
                onClick={() => setShowModal(false)}
                className="text-[10px] uppercase tracking-[0.4em] font-bold text-forest hover:text-sage transition-colors duration-300 pt-4"
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
          className="text-2xl font-serif italic text-forest/60 font-light"
        >
          {content.interaction.thankYou}
        </motion.p>
      )}
    </div>
  );
}
