const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const waFloat = document.querySelector(".wa-float");
const budgetFilter = document.getElementById("budgetFilter");
const durationFilter = document.getElementById("durationFilter");
const levelFilter = document.getElementById("levelFilter");
const tripGrid = document.getElementById("tripGrid");
const tripEmpty = document.getElementById("tripEmpty");
const bookingForm = document.getElementById("bookingForm");
const tripInput = document.getElementById("tripInput");
const testimonialText = document.getElementById("testimonialText");
const testimonialName = document.getElementById("testimonialName");
const prevTesti = document.getElementById("prevTesti");
const nextTesti = document.getElementById("nextTesti");
const trips = window.BSD_TRIPS || [];

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("show"));
  });
}

if (waFloat) {
  let lastScrollY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      const hasPassedOffset = currentScrollY > 90;

      if (isScrollingDown && hasPassedOffset) {
        waFloat.classList.add("wa-float--hidden");
      } else {
        waFloat.classList.remove("wa-float--hidden");
      }

      lastScrollY = currentScrollY;
    },
    { passive: true }
  );
}

const formatDate = (dateText) => {
  const date = new Date(dateText);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const renderTripOptions = () => {
  if (!tripInput) return;
  tripInput.innerHTML = '<option value="">Pilih trip</option>';
  trips.forEach((trip) => {
    tripInput.insertAdjacentHTML(
      "beforeend",
      `<option value="${trip.name}">${trip.name}</option>`
    );
  });
};

const renderTrips = () => {
  if (!tripGrid) return;
  tripGrid.innerHTML = trips
    .map(
      (trip) => `
      <article class="trip-card" data-budget="${trip.budget}" data-duration="${trip.duration}" data-level="${trip.level}">
        <h3>${trip.name}</h3>
        <p>${trip.description}</p>
        <span>${trip.priceLabel}</span>
        <a href="${trip.detailPage}" class="trip-link">Lihat Detail</a>
      </article>
    `
    )
    .join("");
};


const applyTripFilters = () => {
  const tripCards = document.querySelectorAll(".trip-card");
  if (!budgetFilter || !durationFilter || !levelFilter || !tripCards.length) {
    return;
  }

  let visibleCount = 0;

  tripCards.forEach((card) => {
    const budgetMatch = budgetFilter.value === "all" || card.dataset.budget === budgetFilter.value;
    const durationMatch =
      durationFilter.value === "all" || card.dataset.duration === durationFilter.value;
    const levelMatch = levelFilter.value === "all" || card.dataset.level === levelFilter.value;
    const isVisible = budgetMatch && durationMatch && levelMatch;

    card.style.display = isVisible ? "block" : "none";
    if (isVisible) visibleCount += 1;
  });

  if (tripEmpty) {
    tripEmpty.hidden = visibleCount !== 0;
  }
};

[budgetFilter, durationFilter, levelFilter].forEach((filterEl) => {
  if (filterEl) {
    filterEl.addEventListener("change", applyTripFilters);
  }
});

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("nameInput")?.value.trim();
    const trip = document.getElementById("tripInput")?.value;
    const date = document.getElementById("dateInput")?.value;
    const pax = document.getElementById("paxInput")?.value;

    if (!name || !trip || !date || !pax) {
      return;
    }

    const messageText = [
      "Halo BSD Explorer, saya mau booking open trip.",
      `Nama: ${name}`,
      `Trip: ${trip}`,
      `Tanggal: ${date}`,
      `Peserta: ${pax} orang`,
    ].join("\n");

    const message = encodeURIComponent(messageText);
    window.open(`https://wa.me/6285715577098?text=${message}`, "_blank", "noopener,noreferrer");
  });
}

const testimonials = [
  {
    text: '"Tripnya tertata, guide ramah, dan dokumentasi bagus banget. Pasti ikut lagi!"',
    name: "- Rani, Jakarta",
  },
  {
    text: '"Baru pertama ikut open trip, tapi feel-nya aman dan seru banget dari awal sampai akhir."',
    name: "- Dimas, Tangerang",
  },
  {
    text: '"Itinerary jelas, tepat waktu, dan spot sunrise-nya dapet semua. Recommended!"',
    name: "- Nabila, Bekasi",
  },
];

let testiIndex = 0;

const renderTestimonial = () => {
  if (!testimonialText || !testimonialName) return;
  testimonialText.textContent = testimonials[testiIndex].text;
  testimonialName.textContent = testimonials[testiIndex].name;
};

if (prevTesti && nextTesti) {
  prevTesti.addEventListener("click", () => {
    testiIndex = (testiIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial();
  });

  nextTesti.addEventListener("click", () => {
    testiIndex = (testiIndex + 1) % testimonials.length;
    renderTestimonial();
  });
}

renderTrips();
renderTripOptions();
applyTripFilters();
renderTestimonial();
