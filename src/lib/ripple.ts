/**
 * Attaches a gold ripple effect to the clicked element.
 * The element needs `position: relative` and `overflow: hidden`.
 * Call this inside an onClick handler on any button or anchor.
 */
export function createRipple(e: React.MouseEvent<HTMLElement>) {
  const el   = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x    = e.clientX - rect.left - size / 2;
  const y    = e.clientY - rect.top  - size / 2;

  const ripple = document.createElement("span");
  ripple.style.cssText = `
    position: absolute;
    left: ${x}px;
    top:  ${y}px;
    width:  ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: rgba(200,169,110,0.28);
    transform: scale(0);
    animation: ripple-expand 0.55s ease-out forwards;
    pointer-events: none;
    z-index: 9;
  `;

  // Ensure the host element can contain absolute children
  const computed = window.getComputedStyle(el);
  if (computed.position === "static") el.style.position = "relative";
  if (computed.overflow !== "hidden") el.style.overflow = "hidden";

  el.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
}
