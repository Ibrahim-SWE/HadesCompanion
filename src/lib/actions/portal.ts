export function portal(
  node: HTMLElement,
  target: HTMLElement | string = "body",
) {
  const targetEl =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : target;

  if (!targetEl) return {};

  targetEl.appendChild(node);

  return {
    destroy() {
      node.remove();
    },
  };
}
