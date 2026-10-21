import { PROTECT_IDS, VERIFY_IDS } from "../../data/products";

// Menu items call this. It tells the showcase / protect list which item to open,
// then scrolls to the right section. No router needed.
export function goToProduct(id) {
  window.dispatchEvent(new CustomEvent("product:select", { detail: id }));
  const target = PROTECT_IDS.includes(id) ? "protect" : VERIFY_IDS.includes(id) ? "product" : id;
  document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
}