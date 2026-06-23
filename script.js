document.documentElement.classList.add("animations-enabled");

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const shareButton = document.querySelector("#share-button");
const shareStatus = document.querySelector("#share-status");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  siteNav?.classList.toggle("is-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle?.setAttribute("aria-expanded", "false");
    siteNav?.classList.remove("is-open");
  });
});

document.addEventListener("click", (event) => {
  if (!siteNav?.classList.contains("is-open")) return;
  if (siteNav.contains(event.target) || navToggle?.contains(event.target)) return;
  navToggle?.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );

  revealItems.forEach((item) => observer.observe(item));
  window.setTimeout(() => {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }, 1200);
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const eventTime = new Date("2026-06-30T14:00:00+08:00").getTime();
const eventEndTime = new Date("2026-06-30T16:00:00+08:00").getTime();
const countdown = document.querySelector("#countdown");
const countdownMessage = document.querySelector("#countdown-message");

const updateCountdown = () => {
  const now = Date.now();
  const remaining = eventTime - now;

  if (now >= eventEndTime) {
    countdown.hidden = true;
    countdownMessage.textContent = "謝謝你與我們一起，在詩裡練習溫柔地告別。";
    return;
  }

  if (remaining <= 0) {
    countdown.hidden = true;
    countdownMessage.textContent = "活動正在進行中，歡迎來到閱讀沙龍。";
    return;
  }

  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);

  countdown.hidden = false;
  countdown.querySelector("[data-days]").textContent = String(days);
  countdown.querySelector("[data-hours]").textContent = String(hours).padStart(2, "0");
  countdown.querySelector("[data-minutes]").textContent = String(minutes).padStart(2, "0");
};

updateCountdown();
setInterval(updateCountdown, 60_000);

shareButton?.addEventListener("click", async () => {
  const shareData = {
    title: "一封不寄出的情書｜普希金朗讀與俄羅斯文化體驗",
    text: "2026 年 6 月 30 日 14:00–16:00，本校圖書館多功能教室，免費參加。",
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      shareStatus.textContent = "分享視窗已開啟。";
    } else {
      await navigator.clipboard.writeText(window.location.href);
      shareStatus.textContent = "活動網址已複製。";
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      shareStatus.textContent = "無法自動分享，請從瀏覽器網址列複製網址。";
    }
  }
});
