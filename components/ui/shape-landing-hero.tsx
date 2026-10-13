"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  y?: number;
  gradient?: string;
}

export function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  y = 15,
  gradient = "from-cyan-500/[0.12]",
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96] as const,
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute pointer-events-none", className)}
    >
      <motion.div
        animate={{
          y: [0, y, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.12]",
            "shadow-[0_8px_32px_0_rgba(6,182,212,0.12)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export interface HeroGeometricProps {
  badge?: string;
  title1?: string;
  title2?: string;
  description?: string;
  rotate?: number;
  width?: number;
  height?: number;
  y?: number;
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function HeroGeometric({
  badge = "ScamShield OSS • Open Source Security",
  title1 = "Zero-Log Threat Defense",
  title2 = "Instant Scam Intelligence",
  description = "Detect SMS fraud, phishing URLs, and deceptive screenshots using transparent heuristics and Google Gemma 4 AI explanation.",
  rotate = 12,
  width = 600,
  height = 140,
  y = 15,
  children,
  className,
  containerClassName,
}: HeroGeometricProps) {
  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.3 + i * 0.15,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    }),
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-[#070a11] text-white",
        className
      )}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-blue-500/[0.06] blur-3xl pointer-events-none" />

      {/* Floating Geometric Elegant Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.2}
          width={width}
          height={height}
          rotate={rotate}
          y={y}
          gradient="from-cyan-500/[0.18]"
          className="left-[-10%] md:left-[-5%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.4}
          width={500}
          height={120}
          rotate={-15}
          y={y}
          gradient="from-blue-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[45%] md:top-[50%]"
        />

        <ElegantShape
          delay={0.3}
          width={320}
          height={85}
          rotate={-8}
          y={y}
          gradient="from-emerald-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.5}
          width={220}
          height={65}
          rotate={20}
          y={y}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[8%] md:top-[12%]"
        />

        <ElegantShape
          delay={0.6}
          width={160}
          height={45}
          rotate={-25}
          y={y}
          gradient="from-rose-500/[0.15]"
          className="left-[22%] md:left-[26%] top-[3%] md:top-[6%]"
        />
      </div>

      {/* Main Container Content */}
      <div
        className={cn(
          "relative z-10 container mx-auto px-4 md:px-6 pt-12 pb-16",
          containerClassName
        )}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          {badge && (
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/50 mb-6 backdrop-blur-md shadow-lg shadow-cyan-950/30"
            >
              <Shield className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-200 tracking-wide font-medium">
                {badge}
              </span>
            </motion.div>
          )}

          {/* Heading */}
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-5 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/75">
                {title1}
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400">
                {title2}
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          {description && (
            <motion.div
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-sm sm:text-base md:text-lg text-slate-300/80 mb-8 leading-relaxed font-normal max-w-2xl mx-auto px-4">
                {description}
              </p>
            </motion.div>
          )}

          {/* Optional Children (e.g. Scanners, Controls, Presets) */}
          {children && (
            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="w-full text-left"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>

      {/* Subtle bottom fade transition */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#070a11] to-transparent pointer-events-none" />
    </div>
  );
}

export default HeroGeometric;
