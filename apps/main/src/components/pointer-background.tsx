"use client";

import * as React from "react";
import type { OGLRenderingContext, Renderer as OglRenderer } from "ogl";

export type PointerBackgroundVariant = "light-rays" | "galaxy";

const vertexShader = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const lightRaysFragmentShader = `
precision highp float;
uniform float uTime;
uniform float uTheme;
uniform vec2 uResolution;
uniform vec2 uPointer;
varying vec2 vUv;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float beam(vec2 uv, vec2 source, float seed, float speed) {
  vec2 delta = uv - source;
  float dist = length(delta);
  float angle = atan(delta.y, delta.x);
  float spread = 3.35;
  float center = -1.5708 + (seed - 0.5) * 0.92 * spread + sin(uTime * speed + seed * 8.0) * 0.008;
  float width = 0.058 + hash(seed * 11.0) * 0.078;
  float ray = smoothstep(width, 0.0, abs(angle - center));
  float lengthFade = smoothstep(4.6, 0.02, dist);
  float topOriginFade = smoothstep(0.15, 1.04, uv.y);
  float lowerReach = smoothstep(-0.28, 1.05, 1.0 - uv.y);
  return ray * lengthFade * mix(0.68, 1.0, topOriginFade) * lowerReach;
}

void main() {
  vec2 uv = vUv;
  vec2 pointer = (uPointer - 0.5) * vec2(0.22, 0.08);
  vec2 source = vec2(0.5, 1.26) + pointer;
  float glow = 0.0;
  for (int i = 0; i < 5; i++) {
    float seed = float(i) / 4.0;
    glow += beam(uv, source, seed, 3.0 + seed * 0.12) * (0.70 + seed * 0.12);
  }
  float horizon = smoothstep(1.45, 0.05, length((uv - source) * vec2(0.82, 1.0)));
  float topWash = smoothstep(0.42, 1.08, uv.y) * smoothstep(0.96, 0.0, abs(uv.x - 0.5));
  float verticalWash = smoothstep(1.12, 0.06, length((uv - vec2(0.5, 0.82)) * vec2(0.72, 1.12)));
  vec3 rayColor = mix(vec3(0.10, 0.12, 0.17), vec3(1.0, 1.0, 1.0), uTheme);
  vec3 hazeColor = mix(vec3(0.38, 0.44, 0.55), vec3(0.66, 0.70, 0.80), uTheme);
  vec3 color = rayColor * glow * 1.80 + hazeColor * horizon * 0.48 + hazeColor * topWash * 0.34 + rayColor * verticalWash * 0.16;
  float alpha = clamp(glow * mix(0.68, 0.96, uTheme) + horizon * mix(0.24, 0.34, uTheme) + topWash * mix(0.16, 0.22, uTheme) + verticalWash * mix(0.08, 0.12, uTheme), 0.0, mix(0.76, 0.94, uTheme));
  gl_FragColor = vec4(color, alpha);
}
`;

const galaxyFragmentShader = `
precision highp float;
uniform float uTime;
uniform float uTheme;
uniform vec2 uResolution;
uniform vec2 uPointer;
varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

mat2 rotate2d(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

vec3 starLayer(vec2 uv, float scale, float layerSeed) {
  vec2 grid = uv * scale;
  vec2 id = floor(grid);
  vec2 gv = fract(grid) - 0.5;
  vec3 col = vec3(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 cell = id + offset;
      float seed = hash21(cell + layerSeed);
      vec2 starPos = offset + vec2(hash21(cell + 2.7), hash21(cell + 6.2)) - 0.5;
      float dist = length(gv - starPos);
      float size = mix(0.012, 0.048, pow(seed, 7.0));
      float core = smoothstep(size, 0.0, dist);
      float flare = smoothstep(size * 4.8, 0.0, dist) * 0.48;
      float twinkle = mix(0.95, 1.05, hash21(cell + floor(uTime * 0.5 + layerSeed * 3.0)));
      col += (core + flare) * twinkle;
    }
  }
  return col;
}

void main() {
  vec2 uv = vUv - 0.5;
  uv.x *= uResolution.x / max(uResolution.y, 1.0);
  vec2 pointer = (uPointer - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  vec2 pointerDelta = uv - pointer;
  float repulsion = smoothstep(0.32, 0.0, length(pointerDelta)) * 0.5;
  uv += normalize(pointerDelta + 0.0001) * repulsion * 0.028;
  vec2 parallax = (uPointer - 0.5) * vec2(0.10, -0.07);
  uv += parallax;
  uv = rotate2d(uTime * 0.025) * uv;

  vec3 stars = vec3(0.0);
  stars += starLayer(uv + uTime * 0.0008, 34.0, 1.0) * 1.08;
  stars += starLayer(uv * 1.18 - uTime * 0.0011, 58.0, 4.0) * 0.78;
  stars += starLayer(uv * 1.52 + vec2(0.8, -0.2), 92.0, 8.0) * 0.44;

  float nebula = smoothstep(0.9, 0.0, length((uv - vec2(-0.22, 0.14)) * vec2(1.1, 0.75)));
  vec3 starColor = mix(vec3(0.10, 0.12, 0.16), vec3(1.0, 0.99, 0.92), uTheme);
  vec3 hazeColor = mix(vec3(0.32, 0.38, 0.48), vec3(0.10, 0.11, 0.18), uTheme);
  vec3 color = starColor * stars * mix(1.0, 1.28, uTheme) + hazeColor * nebula * 0.44;
  float alpha = clamp(length(stars) * mix(0.74, 1.72, uTheme) + nebula * mix(0.12, 0.22, uTheme), 0.0, mix(0.62, 0.90, uTheme));
  gl_FragColor = vec4(color, alpha);
}
`;

function readThemeTone() {
  if (typeof document === "undefined") return 0;
  return document.documentElement.classList.contains("dark") ? 1 : 0;
}

function useThemeTone() {
  const [themeTone, setThemeTone] = React.useState(readThemeTone);

  React.useEffect(() => {
    const root = document.documentElement;
    const update = () => setThemeTone(readThemeTone());
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    update();
    return () => observer.disconnect();
  }, []);

  return themeTone;
}

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function usePointerVariables(ref: React.RefObject<HTMLDivElement | null>) {
  const frameRef = React.useRef<number | null>(null);
  const targetRef = React.useRef({ x: 50, y: 50 });
  const renderedRef = React.useRef({ x: 50, y: 50 });
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const writePointerVariables = (x: number, y: number) => {
      const offsetX = x - 50;
      const offsetY = y - 50;
      const distance = Math.min(1, Math.hypot(offsetX, offsetY) / 70);
      const intensity = 0.44 + distance * 0.18;

      element.style.setProperty("--bobob-pointer-x", `${x}%`);
      element.style.setProperty("--bobob-pointer-y", `${y}%`);
      element.style.setProperty("--bobob-horizon-x", `${50 + offsetX * 0.18}%`);
      element.style.setProperty("--bobob-horizon-y", `${34 + offsetY * 0.08}%`);
      element.style.setProperty("--bobob-grid-x", `${offsetX * -0.24}px`);
      element.style.setProperty("--bobob-grid-y", `${offsetY * -0.2}px`);
      element.style.setProperty("--bobob-parallax-x", `${offsetX * -0.07}px`);
      element.style.setProperty("--bobob-parallax-y", `${offsetY * -0.06}px`);
      element.style.setProperty("--bobob-depth-x", `${offsetX * -0.34}px`);
      element.style.setProperty("--bobob-depth-y", `${offsetY * -0.3}px`);
      element.style.setProperty("--bobob-flow-x", `${offsetX * -0.48}px`);
      element.style.setProperty("--bobob-flow-y", `${offsetY * -0.36}px`);
      element.style.setProperty("--bobob-sweep-x", `${offsetX * 0.12}px`);
      element.style.setProperty("--bobob-sweep-y", `${offsetY * 0.1}px`);
      element.style.setProperty("--bobob-ray-rotation", `${offsetX * 0.018}deg`);
      element.style.setProperty("--bobob-background-opacity", String(intensity));
      element.style.setProperty("--bobob-ray-opacity", String(0.24 + distance * 0.22));
      element.style.setProperty("--bobob-line-opacity", String(0.28 + distance * 0.14));
    };

    const animatePointer = () => {
      const target = targetRef.current;
      const rendered = renderedRef.current;
      const nextX = rendered.x + (target.x - rendered.x) * 0.18;
      const nextY = rendered.y + (target.y - rendered.y) * 0.18;

      renderedRef.current = { x: nextX, y: nextY };
      writePointerVariables(nextX, nextY);

      const xDone = Math.abs(target.x - nextX) < 0.04;
      const yDone = Math.abs(target.y - nextY) < 0.04;
      if (xDone && yDone) {
        renderedRef.current = target;
        writePointerVariables(target.x, target.y);
        frameRef.current = null;
        return;
      }

      frameRef.current = requestAnimationFrame(animatePointer);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      targetRef.current = {
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      };

      if (!frameRef.current) {
        frameRef.current = requestAnimationFrame(animatePointer);
      }
    };

    writePointerVariables(50, 50);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [reducedMotion, ref]);
}

function ReactBitsShaderBackground({ variant }: { variant: PointerBackgroundVariant }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const themeTone = useThemeTone();
  const themeToneRef = React.useRef(themeTone);

  React.useEffect(() => {
    themeToneRef.current = themeTone;
  }, [themeTone]);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let animationFrame: number | null = null;
    let disposed = false;
    let renderer: OglRenderer | null = null;
    let gl: OGLRenderingContext | null = null;
    let cleanupPointer: (() => void) | null = null;
    const targetPointer = { x: 0.5, y: 0.5 };
    const smoothPointer = { x: 0.5, y: 0.5 };

    const init = async () => {
      const { Mesh, Program, Renderer, Triangle } = await import("ogl");
      if (disposed || !element.isConnected) return;

      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        alpha: true,
        premultipliedAlpha: false,
      });
      gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.canvas.className = "bobob-reactbits-canvas";
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      element.appendChild(gl.canvas);

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: variant === "light-rays" ? lightRaysFragmentShader : galaxyFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uTheme: { value: themeToneRef.current },
          uResolution: { value: [1, 1] },
          uPointer: { value: [0.5, 0.5] },
        },
      });
      const mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        if (!renderer || !gl) return;
        const width = Math.max(1, element.clientWidth);
        const height = Math.max(1, element.clientHeight);
        renderer.setSize(width, height);
        program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
      };

      const onPointerMove = (event: PointerEvent) => {
        if (reducedMotion) return;
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        targetPointer.x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        targetPointer.y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      };

      const render = (time: number) => {
        if (!renderer) return;
        smoothPointer.x += (targetPointer.x - smoothPointer.x) * 0.06;
        smoothPointer.y += (targetPointer.y - smoothPointer.y) * 0.06;
        program.uniforms.uTime.value = reducedMotion ? 0 : time * 0.001;
        program.uniforms.uTheme.value = themeToneRef.current;
        program.uniforms.uPointer.value = [smoothPointer.x, smoothPointer.y];
        renderer.render({ scene: mesh });
        if (!reducedMotion) animationFrame = requestAnimationFrame(render);
      };

      resize();
      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      cleanupPointer = () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointerMove);
      };
      animationFrame = requestAnimationFrame(render);
    };

    init().catch(() => {
      renderer = null;
      gl = null;
    });

    return () => {
      disposed = true;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      cleanupPointer?.();
      if (gl) {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        gl.canvas.remove();
      }
    };
  }, [reducedMotion, variant]);

  return <div ref={ref} className="absolute inset-0" />;
}

export function PointerBackground({ variant = "galaxy" }: { variant?: PointerBackgroundVariant }) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  usePointerVariables(hostRef);

  return (
    <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" data-reactbits-background={variant}>
      <div className={`bobob-pointer-background bobob-reactbits-background bobob-reactbits-${variant}`}>
        <ReactBitsShaderBackground variant={variant} />
      </div>
    </div>
  );
}
