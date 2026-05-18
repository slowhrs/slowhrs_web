"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SizePicker from "@/components/SizePicker";
import type { Drop, Size } from "@/lib/data/drops";
import { getStockStatus } from "@/lib/data/drops";

type CheckoutSessionResult =
  | { url: string }
  | { error: string; message?: string };

let stripeConnectionWarmed = false;
function warmStripeConnection() {
  if (stripeConnectionWarmed) return;
  if (typeof window === "undefined") return;
  stripeConnectionWarmed = true;

  for (const href of [
    "https://checkout.stripe.com/",
    "https://js.stripe.com/",
    "https://api.stripe.com/",
  ]) {
    try {
      void fetch(href, {
        method: "GET",
        mode: "no-cors",
        credentials: "omit",
        cache: "no-store",
        keepalive: true,
      });
    } catch {
      // best-effort TLS warmup; ignore failures
    }
  }
}

export default function DropTile({ drop }: { drop: Drop; index?: number }) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isTouchDevice] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(hover: none)").matches : false
  );
  const cardRef = useRef<HTMLElement>(null);
  const sessionCacheRef = useRef<Map<string, Promise<CheckoutSessionResult>>>(new Map());
  const status = getStockStatus(drop);
  const allSoldOut = status === "gone";
  const shouldShowSizePicker = isExpanded || isTouchDevice;

  useEffect(() => {
    sessionCacheRef.current.clear();
  }, [drop.id]);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (isTouchDevice || allSoldOut) return;

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${y * -4}deg`);
    card.style.setProperty("--tilt-y", `${x * 4}deg`);
  };

  const resetTilt = () => {
    setIsExpanded(false);
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  };

  const requestCheckoutSession = useCallback(
    (size: Size) => {
      const key = `${drop.id}:${size}`;
      const cache = sessionCacheRef.current;
      const existing = cache.get(key);
      if (existing) return existing;

      const body = new FormData();
      body.set("product_id", drop.id);
      body.set("size", size);
      body.set("quantity", "1");

      const promise = fetch("/api/checkout", {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
        cache: "no-store",
        credentials: "same-origin",
        keepalive: true,
      })
        .then(async (res) => {
          const data = (await res.json().catch(() => null)) as CheckoutSessionResult | null;
          if (!data) {
            return { error: "checkout_failed", message: "checkout failed" } satisfies CheckoutSessionResult;
          }
          return data;
        })
        .catch(() => {
          cache.delete(key);
          return { error: "network", message: "network error" } satisfies CheckoutSessionResult;
        });

      cache.set(key, promise);
      return promise;
    },
    [drop.id]
  );

  const prefetchSession = useCallback(() => {
    warmStripeConnection();
    if (!selectedSize || allSoldOut || !drop.stripe_price_id) return;
    void requestCheckoutSession(selectedSize);
  }, [selectedSize, allSoldOut, drop.stripe_price_id, requestCheckoutSession]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!selectedSize) return;
    event.preventDefault();
    setIsCheckingOut(true);
    setCheckoutError(null);
    warmStripeConnection();

    const result = await requestCheckoutSession(selectedSize);
    if ("url" in result && result.url) {
      window.location.assign(result.url);
      return;
    }

    sessionCacheRef.current.delete(`${drop.id}:${selectedSize}`);
    setIsCheckingOut(false);
    const errorMessage =
      "message" in result && typeof result.message === "string" ? result.message : "checkout failed";
    setCheckoutError(errorMessage);

    const form = event.currentTarget;
    if (form && typeof form.submit === "function") {
      form.submit();
    }
  };

  return (
    <article
      ref={cardRef}
      className={`drop-tile group ${allSoldOut ? "drop-tile-sold-out" : ""}`}
      onMouseEnter={() => {
        setIsExpanded(true);
        warmStripeConnection();
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      onClick={isTouchDevice && !allSoldOut ? () => setIsExpanded((value) => !value) : undefined}
    >
      <div className="drop-media relative aspect-[4/5] overflow-hidden">
        <div className="drop-gif-stage absolute inset-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={drop.gif}
            alt={`${drop.title} animated product view`}
            className="h-full w-full object-contain scale-[1.2] transition-transform duration-700 group-hover:scale-[1.32]"
          />
        </div>

        {allSoldOut && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/15">
            <Image
              src="/assets/widgets/gone.png"
              alt="sold out"
              width={140}
              height={70}
              className="pixel w-1/4 max-w-[120px] h-auto -rotate-12 opacity-85 drop-shadow-[0_0_12px_rgba(230,0,22,0.55)]"
            />
          </div>
        )}

        {!allSoldOut && status === "low" && (
          <div className="animate-pulse-scarcity absolute right-3 top-3 z-10 bg-red px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-bg">
            {drop.badge}
          </div>
        )}
      </div>

      <div className="flex min-h-[260px] flex-col gap-3 p-4 md:p-5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-red">
            {drop.category}
          </p>
          <p className="font-mono text-[12px] text-ink">${drop.price}</p>
        </div>

        <div>
          <h3 className="font-serif text-[1.8rem] italic lowercase leading-none text-ink">
            {drop.title.toLowerCase()}
          </h3>
          <p className="mt-3 line-clamp-2 font-serif text-sm italic leading-relaxed text-ink-dim">
            {drop.description}
          </p>
        </div>

        {!allSoldOut && (
          <div
            className={`overflow-hidden transition-all duration-400 ease-out ${
              shouldShowSizePicker ? "mt-2 max-h-32 opacity-100" : "mt-0 max-h-0 opacity-0"
            }`}
          >
            <SizePicker
              drop={drop}
              selectedSize={selectedSize}
              onSelect={(size) => {
                setSelectedSize(size);
                if (size) {
                  warmStripeConnection();
                  void requestCheckoutSession(size);
                }
              }}
            />
          </div>
        )}

        <div className="mt-auto">
          {!allSoldOut ? (
            drop.stripe_price_id ? (
              selectedSize ? (
                <form
                  action="/api/checkout"
                  method="POST"
                  onClick={(event) => event.stopPropagation()}
                  onSubmit={handleSubmit}
                  className="space-y-2"
                >
                  <input type="hidden" name="product_id" value={drop.id} />
                  <input type="hidden" name="size" value={selectedSize} />
                  <input type="hidden" name="quantity" value="1" />
                  <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-ink-dim">
                    {selectedSize} selected // ships from the room
                  </p>
                  <button
                    type="submit"
                    disabled={isCheckingOut}
                    onMouseEnter={prefetchSession}
                    onFocus={prefetchSession}
                    onTouchStart={prefetchSession}
                    className="checkout-portal brand-action relative flex w-full items-center justify-between overflow-hidden border border-red bg-red/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-red transition-all duration-300 ease-out hover:translate-x-1 hover:bg-red hover:text-bg disabled:pointer-events-none disabled:opacity-90"
                    aria-live="polite"
                    aria-busy={isCheckingOut}
                  >
                    <span className="flex items-center gap-2">
                      {isCheckingOut && (
                        <span
                          className="inline-block h-[10px] w-[10px] animate-spin rounded-full border border-current border-t-transparent"
                          aria-hidden="true"
                        />
                      )}
                      <span>
                        {isCheckingOut ? "opening secure checkout" : `secure ${selectedSize}`}
                      </span>
                    </span>
                    <span aria-hidden="true">{isCheckingOut ? "···" : "→"}</span>
                  </button>
                  {checkoutError && (
                    <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-red">
                      {checkoutError} — retrying...
                    </p>
                  )}
                </form>
              ) : (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsExpanded(true);
                  }}
                  onMouseEnter={warmStripeConnection}
                  className="w-full border border-border-2 py-3 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint transition-all duration-300 ease-out hover:border-red hover:text-red"
                >
                  select size
                </button>
              )
            ) : selectedSize ? (
              <Link
                href={`/#inquiry?subject=order&product=${encodeURIComponent(drop.id)}&size=${selectedSize}`}
                className="brand-action block w-full border border-red py-3 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-red transition-all duration-300 ease-out hover:translate-x-1 hover:bg-red hover:text-bg"
              >
                message to order {selectedSize} →
              </Link>
            ) : (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsExpanded(true);
                }}
                className="w-full border border-border-2 py-3 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint transition-all duration-300 ease-out hover:border-red hover:text-red"
              >
                select size
              </button>
            )
          ) : (
            <p className="border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
              sold out. archive only.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
