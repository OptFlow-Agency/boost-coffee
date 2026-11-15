"use client";

/**
 * A one-shot signal: the preloader resolves it when the wipe has started,
 * and the hero waits on it before revealing. Later client navigations find it
 * already resolved, so subpages animate straight away.
 */
let resolveIntro: () => void = () => {};
let done = false;
export const introReady: Promise<void> =
  typeof window === "undefined"
    ? Promise.resolve()
    : new Promise<void>((r) => {
        resolveIntro = () => {
          done = true;
          r();
        };
      });

export const finishIntro = () => {
  if (!done) resolveIntro();
};
export const introDone = () => done;
