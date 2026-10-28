"use client";

import Image from "next/image";
import { backgroundPageLimits, resolveCategoryBackground, resolveCoverBackground } from "@/lib/menu-backgrounds";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  money,
  paginate,
  type BookPage,
  type MenuData,
  type MenuItem,
} from "@/lib/types";

function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 180"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1">
        <path d="M42 176C66 122 78 70 106 5M65 125C28 119 15 91 15 65c34 4 59 25 50 60ZM78 92C48 82 43 59 47 39c27 11 43 31 31 53ZM92 56C78 33 91 14 109 3c10 22 3 40-17 53ZM59 141c31 2 57-14 69-40-32-7-61 8-69 40ZM74 107c33 3 62-14 73-43-35-5-65 13-73 43ZM88 70c29-2 51-20 57-46-29 0-52 18-57 46Z" />
        <path
          d="m17 68 47 54m-17-80 31 47m31-82L93 52m-31 85 61-32m-45-3 64-34m-52-3 51-36"
          opacity=".5"
        />
      </g>
    </svg>
  );
}
function Photograph({
  src,
  alt,
  priority = false,
  className = "",
  fit = "cover",
}: {
  src?: string;
  alt: string;
  priority?: boolean;
  className?: string;
  fit?: "cover" | "contain";
}) {
  return (
    <div className={`photograph ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={className.includes("category-artwork") ? "(max-width: 760px) 90vw, 520px" : "(max-width: 760px) 90vw, 450px"}
          priority={priority}
          style={{ objectFit: fit }}
        />
      ) : (
        <div className="photo-placeholder">
          <Leaf />
          <span>Freshly made, thoughtfully served.</span>
        </div>
      )}
    </div>
  );
}

function Page({
  page,
  data,
  onItem,
  ghost = false,
  onContact,
}: {
  page: BookPage;
  data: MenuData;
  onItem: (item: MenuItem) => void;
  ghost?: boolean;
  onContact?: () => void;
}) {
  const { cafe, special } = data;
  const cat = page.category;
  const background = cat ? resolveCategoryBackground(cat, page.continuation) : undefined;
  const coverImage = resolveCoverBackground(data.settings);
  return (
    <article
      style={{
        ...(cat?.accent && /^#[\da-f]{6}$/i.test(cat.accent) ? { "--category-accent": cat.accent } : {}),
        "--scene-position": background?.position,
      } as CSSProperties}
      data-page-number={page.number}
      data-category-id={cat?.id}
      data-item-count={cat?.items.length}
      data-background-key={page.kind === "cover" ? "cover" : background?.key}
      data-background-source={page.kind === "cover" ? coverImage : background?.src}
      className={`printed-page ${page.kind === "cover" ? `cover-page ${data.settings.coverImage ? "cover-designed" : "cover-coffee-fallback"}` : page.kind === "info" ? "info-page" : `category-page scene-page theme-${cat?.theme || "coffee"} ${background?.composed ? "scene-composed" : "scene-photographic"} food-${background?.foodSide || "bottom"}`} ${page.continuation ? "continuation" : ""}`}
    >
      {page.kind === "category" && background?.src && (
        <Photograph src={background.src} alt="" priority={!ghost && page.number === 2}
          className={`page-scene ${cat?.theme === "coffee" ? "with-steam" : ""}`} />
      )}
      {page.kind === "cover" ? (
        <>
          {coverImage && (
            <Photograph
              src={coverImage}
              alt=""
              className="cover-art"
              priority
            />
          )}
          
          <div className="cover-top">
            
            <span>COFFEE · KITCHEN · CONVERSATION</span>
            
          </div>
          <div className="brand-lockup">
            {cafe.logo ? (
              <Image
                className="cafe-logo"
                src={cafe.logo}
                alt={cafe.name}
                width={180}
                height={75}
              />
            ) : (
              <div className="cover-name">
                {data.demo ? <>Aurelle<span className="brand-cafe">CAFÉ</span></> : cafe.name}
              </div>
            )}
            <div className="brand-rule" />
            <p>{cafe.tagline}</p>
          </div>
          <div className="cover-invitation">
            <span>Take a seat.</span>
            <span>Stay a little longer.</span>
          </div>
          
          
          {special.enabled &&
          special.item &&
          !(special.item as MenuItem & { hidden?: boolean }).hidden ? (
            <button
              tabIndex={ghost ? -1 : undefined}
              className="special-feature"
              onClick={() => onItem(special.item!)}
            >
              <div className="special-copy">
                <span className="eyebrow">FRESH FROM OUR KITCHEN</span>
                <span className="special-title">Today’s little pleasure</span>
                <span className="special-dish">
                  {special.item.name} <span>↗</span>
                </span>
                <span className="special-note">
                  {special.text || special.item.description}
                </span>
                <span className="special-price">{money(special.item)}</span>
              </div>
            </button>
          ) : (
            <p className="cover-story">{cafe.story}</p>
          )}
          <div className="cover-bottom">
            {data.demo
              ? "DEMONSTRATION MENU · SAMPLE DISHES & PRICES"
              : "MADE WITH CARE. MEANT TO BE SAVOURED."}
          </div>
        </>
      ) : page.kind === "info" ? (
        <>
          <div className="page-topline">
            <span>THE LAST LEAF</span>
            <span>{cafe.name.toUpperCase()}</span>
          </div>
          <Leaf className="info-leaf" />
          <h2>
            A good place
            <br />
            to pause.
          </h2>
          <p className="cafe-story">{cafe.story}</p>
          <div className="info-details">
            <h3>Find your way here</h3>
            <p>{cafe.address || "Ask our team for directions."}</p>
            <h3>Our doors are open</h3>
            {cafe.hours.map((hour, i) => (
              <p className="hours" key={i}>
                <span>{hour.day}</span>
                <span>{hour.time}</span>
              </p>
            ))}
            <ContactLinks data={data} />
          </div>
          <p className="closing-note">Until the next coffee.</p>
        </>
      ) : (
        cat && (
          <div className="page-content">
            <div className="page-topline">
              <span>THE {cafe.name.toUpperCase()} MENU</span>
              <span>
                {String(
                  data.categories.findIndex((c) => c.id === cat.id) + 1,
                ).padStart(2, "0")}{" "}
                / {String(data.categories.length).padStart(2, "0")}
              </span>
            </div>
            <header className="chapter-heading">
              <div className="chapter-kicker">
                {cat.id === "coffee"
                  ? "BREWED WITH INTENTION"
                  : cat.theme === "pizza"
                    ? "STONE BAKED"
                    : cat.theme === "dessert"
                      ? "SAVE A LITTLE ROOM"
                      : "A TASTE OF THE GOOD LIFE"}
                {page.continuation && " · CONTINUED"}
              </div>
              <h2>{cat.title}</h2>
              <span className="handwritten-accent">{cat.theme === "pizza" ? "A slice of happiness." : cat.theme === "coffee" ? "Good days start here." : cat.theme === "breakfast" ? "For the slow mornings." : cat.theme === "dessert" ? "Always room for a little more." : "Stay cool. Sip slowly."}</span>
              <p>{cat.description}</p>
            </header>
            <div className="menu-list">
              {cat.items.map((item) => (
                <button
                  className={`menu-item ${!item.available ? "unavailable" : ""}`}
                  key={item.id}
                  tabIndex={ghost ? -1 : undefined}
                  onClick={() => onItem(item)}
                >
                  <span className="item-top">
                    <span className="item-name">{item.name}</span>
                    <span className="item-dots" />
                    <span className="item-price">{money(item)}</span>
                  </span>
                  <span className="item-description">{item.description}</span>
                  <span className="item-meta">
                    <span
                      className={`diet-mark ${item.dietary?.includes("Vegan") ? "vegan" : ""}`}
                      aria-hidden="true"
                    />
                    {!item.available
                      ? "Taking a little break · unavailable"
                      : item.dietary?.join(" · ") || "Ask us about allergens"}
                    <span className="item-preview">A closer look ↗</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="page-note">
              
              {cat.theme === "coffee"
                ? "Your coffee, your way. Ask us about oat milk."
                : cat.theme === "pizza"
                  ? "A little char is a beautiful thing."
                  : "Made fresh. Please tell us about any allergies."}
            </div>
          </div>
        )
      )}
      <button className="printed-contact" aria-label="Visit & contact" aria-haspopup="dialog" tabIndex={ghost ? -1 : undefined} onClick={onContact}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.3"/></svg>
        <span>Visit & contact</span>
      </button>
      {page.kind !== "cover" && (
        <footer className="page-folio">
          <span>
            {cafe.name.toLowerCase()}
            <i> café & kitchen</i>
          </span>
          <span>{String(page.number).padStart(2, "0")}</span>
        </footer>
      )}
    </article>
  );
}

function ContactLinks({ data }: { data: MenuData }) {
  const c = data.cafe;
  const phone = c.phone.replace(/[^+\d]/g, "");
  const whatsapp = c.whatsapp.replace(/\D/g, "");
  const safeUrl = (s: string) => (/^https:\/\//.test(s) ? s : undefined);
  return (
    <div className="contact-links">
      {phone && <a href={`tel:${phone}`}>Call the café ↗</a>}
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp ↗
        </a>
      )}
      {safeUrl(c.instagram) && (
        <a
          href={safeUrl(c.instagram)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram ↗
        </a>
      )}
      {safeUrl(c.maps) && (
        <a href={safeUrl(c.maps)} target="_blank" rel="noopener noreferrer">
          Find us on Maps ↗
        </a>
      )}
      {data.demo && (
        <p className="demo-contact">
          Demonstration cafe. Sample address and opening hours.
        </p>
      )}
    </div>
  );
}

type Overlay = { kind: "item"; item: MenuItem } | null;
function Preview({
  overlay,
  close,
}: {
  overlay: NonNullable<Overlay>;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current!;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = "";
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="preview-dialog"
      aria-labelledby="preview-title"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const focusable = [
          ...event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], [tabindex="0"]',
          ),
        ];
        const first = focusable[0],
          last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const rect = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          )
            close();
        }
      }}
    >
      <button
        autoFocus
        className="preview-close icon-button"
        aria-label="Close preview"
        onClick={close}
      >
        ×
      </button>
      <>
        <Photograph
          src={overlay.item.image}
          alt={overlay.item.imageAlt || overlay.item.name}
          priority
          className="preview-photo"
        />
        <div className="preview-content">
          <span className="eyebrow">A CLOSER LOOK</span>
          <div className="preview-title-row">
            <h2 id="preview-title">{overlay.item.name}</h2>
            <span>{money(overlay.item)}</span>
          </div>
          <p>{overlay.item.description}</p>
          {overlay.item.ingredients?.length ? (
            <>
              <h3>What goes into it</h3>
              <p>{overlay.item.ingredients.join(" · ")}</p>
            </>
          ) : null}
          <div className="dietary-tags">
            {overlay.item.dietary?.map((d) => (
              <span key={d}>{d}</span>
            ))}
            <span className={!overlay.item.available ? "out-of-stock" : ""}>
              {overlay.item.available
                ? "Freshly available"
                : "Currently unavailable"}
            </span>
          </div>
          <p className="allergy-note">
            Please speak to our team about allergies. Our kitchen handles nuts,
            gluten, dairy and eggs.
          </p>
          {/* Ordering is an explicit future boundary. No cart, payment or order actions ship in v1. */}
        </div>
      </>
    </dialog>
  );
}

function ContactPreview({ data, close }: { data: MenuData; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current!;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog ref={dialog} className="preview-dialog contact-dialog" aria-labelledby="contact-title"
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const r = event.currentTarget.getBoundingClientRect();
        if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close();
      }}>
      <button autoFocus className="preview-close icon-button" aria-label="Close contact details" onClick={close}>Close</button>
      <div className="preview-content">
        <span className="eyebrow">COME BY. STAY A WHILE.</span>
        <h2 id="contact-title">{data.cafe.name}</h2>
        <p>{data.cafe.address || "Ask our team for directions."}</p>
        <h3>Opening hours</h3>
        {data.cafe.hours.map((hour, i) => <p className="hours" key={i}><span>{hour.day}</span><span>{hour.time}</span></p>)}
        <ContactLinks data={data} />
      </div>
    </dialog>
  );
}

const FACETS = 32;
type Turn = {
  from: number;
  to: number;
  direction: 1 | -1;
  progress: number;
  corner: number;
};
export default function MenuBook({ data }: { data: MenuData }) {
  const [pageCapacity, setPageCapacity] = useState(3);
  const pageLimits = useMemo(() => backgroundPageLimits(data.categories), [data.categories]);
  const pages = useMemo(
    () => paginate(data, pageCapacity, pageLimits),
    [data, pageCapacity, pageLimits],
  );
  const [mobile, setMobile] = useState(false);
  const [current, setCurrent] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const facets = useRef<(HTMLDivElement | null)[]>([]);
  const castShadow = useRef<HTMLDivElement>(null);
  const size = useRef({ width: 450, height: 660 });
  const active = useRef<Turn | null>(null);
  const queued = useRef<number | null>(null);
  const frame = useRef(0);
  const reduced = useRef(false);
  const gesture = useRef<{
    x: number;
    y: number;
    start: number;
    direction: 1 | -1;
    dragging: boolean;
    corner: number;
    id: number;
    cornerButton: boolean;
  } | null>(null);
  const suppressCornerClick = useRef(false);
  const [snapshots, setSnapshots] = useState({ front: "", back: "" });
  const step = mobile ? 1 : 2;
  const facetCount = mobile ? 24 : FACETS;

  const last = mobile
    ? pages.length - 1
    : Math.floor((pages.length - 1) / 2) * 2;
  const openItem = (item: MenuItem) => {
    if (!active.current) setOverlay({ kind: "item", item });
  };

  useLayoutEffect(() => {
    const media = matchMedia("(max-width: 760px)");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let initialized = false,
      lastMobile = false,
      lastMotion = false;
    const update = () => {
      // Some browsers notify media listeners during screenshots/full-page capture
      // even when the result has not changed. Do not cancel a live gesture then.
      if (
        initialized &&
        lastMobile === media.matches &&
        lastMotion === motion.matches
      )
        return;
      initialized = true;
      lastMobile = media.matches;
      lastMotion = motion.matches;
      cancelAnimationFrame(frame.current);
      active.current = null;
      queued.current = null;
      gesture.current = null;
      setTurn(null);
      setMobile(media.matches);
      setCurrent((n) => (media.matches ? n : Math.floor(n / 2) * 2));
      reduced.current = motion.matches;
    };
    update();
    media.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      motion.removeEventListener("change", update);
      cancelAnimationFrame(frame.current);
    };
  }, []);
  useLayoutEffect(() => {
    if (!stage.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const rect = entry.contentRect;
      const single = matchMedia("(max-width: 760px)").matches;
      size.current = {
        width: single ? rect.width : rect.width / 2,
        height: rect.height,
      };
      const capacity = rect.height < 620 ? 1 : rect.height < 860 ? 2 : 3;
      if (capacity === pageCapacity) return;
      const anchor = pages[current];
      const nextPages = paginate(data, capacity, pageLimits);
      let next = anchor?.kind === "info" ? nextPages.length - 1 : 0;
      if (anchor?.category) {
        const itemId = anchor.category.items[0]?.id;
        next = nextPages.findIndex(
          (p) =>
            p.category?.id === anchor.category?.id &&
            (!itemId || p.category?.items.some((item) => item.id === itemId)),
        );
        if (next < 0) next = 0;
      }
      cancelAnimationFrame(frame.current);
      active.current = null;
      queued.current = null;
      gesture.current = null;
      setTurn(null);
      setPageCapacity(capacity);
      setCurrent(single ? next : Math.floor(next / 2) * 2);
    });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, [current, data, mobile, pageCapacity, pageLimits, pages]);

  const paint = useCallback(
    (t: Turn) => {
      const { width, height } = size.current;
      const p = t.progress;
      const bend = Math.sin(Math.PI * p);
      const position = t.from + (t.to - t.from) * p;
      const shell = stage.current?.parentElement;
      shell?.style.setProperty("--left-depth", `${2 + position / pages.length * 6}px`);
      shell?.style.setProperty("--right-depth", `${8 - position / pages.length * 6}px`);
      let x = 0,
        z = 0;
      const facetWidth = width / facetCount;
      for (let i = 0; i < facetCount; i++) {
        const u = (i + 0.5) / facetCount;
        // The outer edge initially leads; the remaining sheet catches up and relaxes.
        const angle =
          Math.PI * p +
          bend *
            (0.7 * (u - 0.42) + 0.09 * Math.sin(u * Math.PI * 2 - p * Math.PI));
        const a = t.direction === 1 ? -angle : Math.PI + angle;
        const segment = facets.current[i];
        if (segment) {
          const lift = bend * t.corner * 8 * u * u;
          segment.style.width = `${facetWidth + 0.6}px`;
          segment.style.transform = `translate3d(${x}px,${lift}px,${z}px) rotateY(${a}rad)`;
          segment.style.setProperty(
            "--shade",
            `${Math.min(0.32, Math.abs(Math.sin(angle)) * 0.21 + bend * 0.04)}`,
          );
          segment.style.setProperty(
            "--glint",
            `${Math.max(0, Math.sin(angle + 0.6)) * bend * 0.16}`,
          );
          segment.style.setProperty("--offset", `${-i * facetWidth}px`);
          segment.style.setProperty("--page-width", `${width}px`);
          segment.style.setProperty("--page-height", `${height}px`);
        }
        x += Math.cos(a) * facetWidth;
        z -= Math.sin(a) * facetWidth;
      }
      if (castShadow.current) {
        castShadow.current.style.opacity = `${bend * 0.3}`;
        castShadow.current.style.transform = `translateX(${t.direction * (1 - p) * width * 0.25}px) scaleX(${0.4 + bend * 0.6})`;
      }
    },
    [facetCount, pages.length],
  );
  useLayoutEffect(() => {
    if (turn) paint(turn);
    else {
      const shell = stage.current?.parentElement;
      shell?.style.setProperty("--left-depth", `${2 + current / pages.length * 6}px`);
      shell?.style.setProperty("--right-depth", `${8 - current / pages.length * 6}px`);
    }
  }, [turn, paint, current, pages.length]);

  const finishRef = useRef<(to: number) => void>(() => {});
  const captureSheet = (t: Turn) => {
    const front =
      t.direction === 1 ? t.from + (mobile ? 0 : 1) : t.to + (mobile ? 0 : 1);
    const back = t.direction === 1 ? t.to : t.from;
    // These strings come only from our own React-escaped, inert measurement DOM.
    // Reusing it avoids mounting 64 React/Next Image trees for a single turn.
    setSnapshots({
      front:
        stage.current?.querySelector(`[data-page-index="${front}"]`)
          ?.innerHTML || "",
      back:
        stage.current?.querySelector(`[data-page-index="${back}"]`)
          ?.innerHTML || "",
    });
  };
  const animate = (t: Turn, end: 0 | 1) => {
    cancelAnimationFrame(frame.current);
    const from = t.progress,
      start = performance.now();
    const duration = Math.max(180, 850 * Math.abs(end - from));
    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - start) / duration);
      const eased =
        elapsed < 0.5 ? 4 * elapsed ** 3 : 1 - (-2 * elapsed + 2) ** 3 / 2;
      t.progress = from + (end - from) * eased;
      paint(t);
      if (elapsed < 1) frame.current = requestAnimationFrame(tick);
      else {
        active.current = null;
        setTurn(null);
        setCurrent(end === 1 ? t.to : t.from);
      }
    };
    frame.current = requestAnimationFrame(tick);
  };
  const navigate = (destination: number, corner = 1) => {
    const to = Math.max(0, Math.min(last, destination));
    if (active.current) {
      queued.current = to;
      return;
    }
    if (to === current) return;
    if (reduced.current || !CSS.supports("transform-style", "preserve-3d")) {
      setCurrent(to);
      return;
    }
    const t: Turn = {
      from: current,
      to,
      direction: to > current ? 1 : -1,
      progress: 0,
      corner,
    };
    captureSheet(t);
    active.current = t;
    setTurn(t);
    animate(t, 1);
  };
  // Ref keeps queued destinations fresh without listener churn or a second animation clock.
  useEffect(() => {
    finishRef.current = (destination) => navigate(destination);
    // Start queued work only after React commits the completed page. Starting it
    // in the finishing animation frame can read the previous render's position.
    if (!turn && !active.current && queued.current !== null) {
      const next = queued.current;
      queued.current = null;
      if (next !== current) navigate(next);
    }
  });
  const relativeNavigate = (direction: 1 | -1) =>
    navigate(
      (queued.current ?? active.current?.to ?? current) + direction * step,
    );
  useEffect(() => {
    const keyboard = (e: KeyboardEvent) => {
      if (
        overlay || contactOpen ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName)
      )
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        finishRef.current(
          Math.min(
            last,
            (queued.current ?? active.current?.to ?? current) + step,
          ),
        );
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        finishRef.current(
          Math.max(0, (queued.current ?? active.current?.to ?? current) - step),
        );
      }
    };
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, [current, last, step, overlay, contactOpen]);

  const pointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (
      active.current ||
      e.button !== 0 ||
      (e.target as HTMLElement).closest("button:not(.corner-turn),a")
    )
      return;
    suppressCornerClick.current = false;
    const rect = e.currentTarget.getBoundingClientRect();
    const local = e.clientX - rect.left;
    const direction = (local > rect.width * 0.5 ? 1 : -1) as 1 | -1;
    if (
      !mobile && ((direction === -1 && current === 0) ||
      (direction === 1 && current === last))
    )
      return;
    const corner = (e.clientY - rect.top) / rect.height;
    // Mouse drags begin at physical edges. Touch swipes can start on free page space.
    if (e.pointerType === "mouse" && local > 45 && local < rect.width - 45)
      return;
    gesture.current = {
      x: e.clientX,
      y: e.clientY,
      start: current,
      direction,
      dragging: false,
      corner,
      id: e.pointerId,
      cornerButton: !!(e.target as HTMLElement).closest(".corner-turn"),
    };
  };
  const pointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.x,
      dy = e.clientY - g.y;
    if (!g.dragging) {
      if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx)) {
        gesture.current = null;
        return;
      }
      if (Math.abs(dx) < 10) return;
      if (mobile) g.direction = dx < 0 ? 1 : -1;
      const to = Math.max(0, Math.min(last, g.start + g.direction * step));
      if (to === current || dx * g.direction > 0) {
        gesture.current = null;
        return;
      }
      if (reduced.current || !CSS.supports("transform-style", "preserve-3d")) {
        g.dragging = true;
        return;
      }
      g.dragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      const t: Turn = {
        from: g.start,
        to,
        direction: g.direction,
        progress: 0,
        corner: g.corner,
      };
      captureSheet(t);
      active.current = t;
      setTurn(t);
    }
    if (active.current) {
      active.current.progress = Math.max(
        0,
        Math.min(0.98, (-dx * g.direction) / size.current.width),
      );
      paint(active.current);
    }
  };
  const pointerUp = (
    e: ReactPointerEvent<HTMLDivElement>,
    cancelled = false,
  ) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    if (g.dragging && g.cornerButton) suppressCornerClick.current = true;
    if (g.dragging && active.current)
      animate(
        active.current,
        !cancelled && active.current.progress > 0.22 ? 1 : 0,
      );
    else if (g.dragging && !cancelled && Math.abs(e.clientX - g.x) > 45)
      navigate(g.start + g.direction * step);
    else if (
      !cancelled &&
      !g.cornerButton &&
      Math.abs(e.clientX - g.x) < 8 &&
      g.corner > 0.8
    )
      navigate(g.start + g.direction * step, g.corner);
  };

  const visibleCurrent = turn ? turn.from : current;
  const leftIndex = turn && turn.direction === -1 ? turn.to : visibleCurrent;
  const rightIndex =
    turn && turn.direction === 1
      ? turn.to + (mobile ? 0 : 1)
      : visibleCurrent + (mobile ? 0 : 1);
  const pageAt = (index: number, ghost = false) =>
    pages[index] ? (
      <Page page={pages[index]} data={data} onItem={openItem} ghost={ghost} onContact={() => { if (!active.current) setContactOpen(true); }} />
    ) : (
      <article className="printed-page endpaper">
        <Leaf />
        <p>
          The pleasure
          <br />
          was ours.
        </p>
        <span>{data.cafe.name} café & kitchen</span>
      </article>
    );
  const themeStyle = {
    "--brand": /^#[\da-f]{6}$/i.test(data.settings.accent)
      ? data.settings.accent
      : "#233e32",
    "--paper": /^#[\da-f]{6}$/i.test(data.settings.paper)
      ? data.settings.paper
      : "#faf6ec",
  } as CSSProperties;

  return (
    <main
      className={`menu-experience ${data.settings.typography === "modern" ? "modern-type" : ""}`}
      style={themeStyle}
    >
      <h1 className="sr-only">{data.cafe.name} restaurant menu</h1>
      <div
        className="book-shell"
        style={
          {
            "--left-depth": `${2 + (current / pages.length) * 6}px`,
            "--right-depth": `${8 - (current / pages.length) * 6}px`,
          } as CSSProperties
        }
      >
        <div className="book-cover-base" />
        <div className="paper-block left-block" />
        <div className="paper-block right-block" />
        <div
          id="menu-book"
          tabIndex={0}
          className={`book-stage ${turn ? "turning" : ""}`}
          ref={stage}
          role="region"
          aria-label={`${data.cafe.name} menu book`}
          aria-keyshortcuts="ArrowLeft ArrowRight"
          data-current-page={current}
          data-page-count={pages.length}
          onDragStart={(event) => event.preventDefault()}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={(e) => pointerUp(e)}
          onPointerCancel={(e) => pointerUp(e, true)}
        >
          <div className="measurement-rack" aria-hidden="true" inert>
            {pages.map((page, i) => (
              <div className="measurement-page" data-page-index={i} key={i}>
                <Page page={page} data={data} onItem={() => {}} ghost />
              </div>
            ))}
          </div>
          {mobile ? (
            <div className="leaf-rest single-leaf">
              {pageAt(turn ? turn.to : current)}
            </div>
          ) : (
            <>
              <div className="leaf-rest left-leaf">{pageAt(leftIndex)}</div>
              <div className="leaf-rest right-leaf">{pageAt(rightIndex)}</div>
              <div className="book-gutter" />
            </>
          )}
          {turn && (
            <div
              className={`turn-layer ${mobile ? "mobile-turn" : ""}`}
              style={
                mobile && turn.direction === -1 ? { left: "100%" } : undefined
              }
              aria-hidden="true"
              inert
            >
              <div className="moving-shadow" ref={castShadow} />
              {Array.from({ length: facetCount }, (_, i) => (
                <div
                  className="paper-facet"
                  key={i}
                  ref={(el) => {
                    facets.current[i] = el;
                  }}
                >
                  <div className="facet-face facet-front">
                    <div
                      className="facet-content"
                      dangerouslySetInnerHTML={{ __html: snapshots.front }}
                    />
                    <div className="facet-light" />
                  </div>
                  <div className="facet-face facet-back">
                    <div
                      className="facet-content"
                      dangerouslySetInnerHTML={{ __html: snapshots.back }}
                    />
                    <div className="facet-light" />
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            className="corner-turn corner-next"
            aria-label="Turn to next page"
            tabIndex={0}
            disabled={current >= last && !turn}
            onClick={(event) => {
              if (suppressCornerClick.current) {
                event.preventDefault();
                suppressCornerClick.current = false;
                return;
              }
              relativeNavigate(1);
            }}
          >
            <span>↗</span>
          </button>
          {(current > 0 || turn) && (
            <button
              className="corner-turn corner-prev"
              aria-label="Turn to previous page"
              tabIndex={0}
              onClick={(event) => {
                if (suppressCornerClick.current) {
                  event.preventDefault();
                  suppressCornerClick.current = false;
                  return;
                }
                relativeNavigate(-1);
              }}
            >
              <span>↖</span>
            </button>
          )}
        </div>
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        Page {current + 1}
        {!mobile && current + 1 < pages.length
          ? ` and ${current + 2}`
          : ""} of {pages.length}
      </span>
      {contactOpen && <ContactPreview data={data} close={() => setContactOpen(false)} />}
      {overlay && <Preview overlay={overlay} close={() => setOverlay(null)} />}
    </main>
  );
}
