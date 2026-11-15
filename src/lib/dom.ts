"use client";

/** Next keeps previous routes in the DOM but hidden; only count what is rendered. */
export const isRendered = (el: Element) => el.getClientRects().length > 0;

export const visibleMain = () =>
  Array.from(document.querySelectorAll<HTMLElement>("main")).find(isRendered) ?? null;
