"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useTransitionNavigate } from "@/components/providers/Transition";

type Props = ComponentProps<typeof Link> & { href: string; onBeforeNavigate?: () => void };

/** A real <a>, enhanced: same-site clicks run the curtain transition. */
export function TransitionLink({ href, onClick, onBeforeNavigate, ...rest }: Props) {
  const navigate = useTransitionNavigate();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (/^(https?:|mailto:|tel:)/.test(href)) return;
    e.preventDefault();
    onBeforeNavigate?.();
    navigate(href);
  };
  return <Link href={href} onClick={handle} {...rest} />;
}
