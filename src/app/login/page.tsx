"use client";

import { useEffect, useRef } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
};

type Rocket = {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
};

const COLORS = ["#ff5252", "#ffd740", "#69f0ae", "#40c4ff", "#e040fb", "#ff6e40", "#ffffff"];

const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    const rockets: Rocket[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const launch = () => {
      rockets.push({
        x: canvas.width * (0.1 + Math.random() * 0.8),
        y: canvas.height,
        vy: -(6 + Math.random() * 4),
        targetY: canvas.height * (0.15 + Math.random() * 0.35),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    };

    const explode = (rocket: Rocket) => {
      const count = 40 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 1 + Math.random() * 4;
        particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: rocket.color,
        });
      }
    };

    const interval = setInterval(launch, 800);
    launch();

    const tick = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        ctx.fillStyle = r.color;
        ctx.fillRect(r.x - 1, r.y, 2, 8);
        if (r.y <= r.targetY) {
          explode(r);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.alpha -= 0.012;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};

const Login: React.FC = () => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      height={"100vh"}
      justifyContent={"center"}
    >
      <Fireworks />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxWidth="800px"
        textAlign="center"
        p={4}
        gap={6}
        zIndex={1}
      >
        <Text fontSize="3xl">
          O MEDS está permanentemente <span style={{ color: "red" }}>descomissionado</span> a partir de 02/07/2026.
          Essa ação é irreversível. Boa sorte a todos que participaram do seu
          uso e desenvolvimento.
        </Text>
        <Text fontSize="lg">
          Parabéns pela sua conquista meu amor! Espero que o MEDS tenha sido
          útil durante sua brilhante passagem em Pratápolis. Te amo!
        </Text>
        <Text fontSize="sm">
          Esperamos que quem quer que tome as atividades futuramente tenha a
          mesma proatividade de criar um sistema para agilizar as milhares de
          receitas emitidas.
        </Text>
      </Box>
    </Box>
  );
};

export default Login;
