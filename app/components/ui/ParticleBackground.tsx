'use client';

import { motion } from 'framer-motion';
import React from 'react';

const createParticleValue = (seed: number) => {
  const raw = Math.sin(seed * 12.9898) * 43758.5453;
  return raw - Math.floor(raw);
};

const particles = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  size: createParticleValue(i + 1) * 4 + 1,
  x: createParticleValue(i + 11) * 100,
  y: createParticleValue(i + 21) * 100,
  delay: createParticleValue(i + 31) * 5,
  duration: createParticleValue(i + 41) * 10 + 10,
}));

const ParticleBackground: React.FC = () => {
  return (
    <div className="particle-bg">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-purple-900/10" />
    </div>
  );
};

export default ParticleBackground;
