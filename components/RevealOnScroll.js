"use client";

import { useEffect } from "react";

export default function RevealOnScroll() {
  useEffect(() => {
    const revealItems = document.querySelectorAll(".reveal");
    const hero = document.querySelector(".hero");
    let rafId = 0;
    let currentProgress = 0;
    let targetProgress = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach((item) => observer.observe(item));

    const clamp01 = (value) => Math.max(0, Math.min(1, value));
    const easeInOutCubic = (value) =>
      value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;

    const getHeroProgress = () => {
      if (!hero) {
        return 0;
      }
      const rect = hero.getBoundingClientRect();
      const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
      return clamp01(-rect.top / travel);
    };

    const applyProgress = (progress) => {
      const eased = easeInOutCubic(progress);
      document.body.style.setProperty("--hero-progress", progress.toString());
      document.body.style.setProperty("--hero-eased-progress", eased.toString());
    };

    const tick = () => {
      const delta = targetProgress - currentProgress;
      currentProgress += delta * 0.115;
      currentProgress = clamp01(currentProgress);
      applyProgress(currentProgress);

      if (Math.abs(delta) > 0.0008) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        currentProgress = targetProgress;
        applyProgress(currentProgress);
        rafId = 0;
      }
    };

    const onScrollOrResize = () => {
      targetProgress = getHeroProgress();
      if (!rafId) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    targetProgress = getHeroProgress();
    currentProgress = targetProgress;
    applyProgress(currentProgress);

    return () => {
      revealItems.forEach((item) => observer.unobserve(item));
      observer.disconnect();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return null;
}
