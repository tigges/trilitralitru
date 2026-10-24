/**
 * "Show N more" for tile grids. Markup contract:
 *   [data-more-group]            wrapper
 *     [data-more-item].hidden    items beyond the initial count
 *     [data-more-btn]            reveals every item in its group, then hides itself
 *                                (or its [data-more-btn-wrap] row)
 * A deep link (#id) to a hidden item, or into one, reveals its group and opens
 * a fact tile's <details> so the source is visible on arrival.
 */
function reveal(group: Element) {
  group.querySelectorAll("[data-more-item]").forEach((el) => el.classList.remove("hidden"));
  group.querySelectorAll("[data-more-btn]").forEach((btn) =>
    (btn.closest("[data-more-btn-wrap]") ?? btn).classList.add("hidden"));
}

document.querySelectorAll("[data-more-btn]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const group = btn.closest("[data-more-group]");
    if (group) reveal(group);
  });
});

function revealHashTarget() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  const hiddenItem = target.closest("[data-more-item].hidden");
  const group = hiddenItem?.closest("[data-more-group]");
  if (group) reveal(group);
  const details = target.matches("[data-fact-tile]") ? target.querySelector("details") : null;
  if (details) details.open = true;
  if (group) target.scrollIntoView();
}

revealHashTarget();
window.addEventListener("hashchange", revealHashTarget);
