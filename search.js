const inputSearch = document.getElementById("inputSearch");
const resualtsBox = document.querySelector(".resualts");

const availableKeywords = [
    // القائمة السابقة (العناصر الأصلية)
    { name: "العريش", link: "arish.html" },
    { name: "شارع البحر", link: "arish.html" },
    { name: "شاطئ العريش", link: "arish-beach.html" },
    { name: "كورنيش العريش", link: "corniche.html" },
    { name: "وسط المدينة العريش", link: "city-center.html" },
    { name: "المساعيد", link: "masaed.html" },
    { name: "الفواخرية", link: "fawakhria.html" },
    { name: "الريسة", link: "raysa.html" },
    { name: "الضاحية", link: "dahia.html" },
    { name: "حي الصفا", link: "safa.html" },
    { name: "جامعة العريش", link: "arish-university.html" },
    { name: "جامعة سيناء", link: "sinai-university.html" },
    { name: "متحف آثار سيناء", link: "museum.html" },
    { name: "بئر العبد", link: "bir-al-abed.html" },
    { name: "بحيرة البردويل", link: "bardawil.html" },
    { name: "محمية الزرانيق", link: "zaranik.html" },
    { name: "الشيخ زويد", link: "sheikh-zuwayid.html" },
    { name: "رفح المصرية", link: "rafah.html" },
    { name: "قبائل سيناء", link: "tribes.html" },
    { name: "اللصيمة السيناوي", link: "lasima.html" },

    // --- إضافة 10 عناصر عربية جديدة ---
    { name: "رأس سدر", link: "ras-sedr.html" },
    { name: "نخل التاريخية", link: "nakhl.html" },
    { name: "وادي الاسترخاء", link: "wadi.html" },
    { name: "صناعات يدوية سيناوية", link: "crafts.html" },
    { name: "أفضل فنادق العريش", link: "hotels.html" },
    { name: "مطاعم أسماك العريش", link: "restaurants.html" },
    { name: "موسم صيد السمان", link: "hunting.html" },
    { name: "التخييم في سيناء", link: "camping.html" },
    { name: "أخبار شمال سيناء اليوم", link: "news.html" },
    { name: "تاريخ سيناء القديم", link: "history.html" },

    // --- إضافة 40 عنصراً إنجليزية جديدة ---
    { name: "Arish City Guide", link: "arish.html" },
    { name: "North Sinai Map", link: "map.html" },
    { name: "Visit Sinai", link: "visit.html" },
    { name: "Best Beaches in Sinai", link: "beaches.html" },
    { name: "Sinai Bedouin Culture", link: "culture.html" },
    { name: "Handmade Products", link: "shop.html" },
    { name: "Tourism in North Sinai", link: "tourism.html" },
    { name: "Arish Weather", link: "weather.html" },
    { name: "Sinai Mountains", link: "mountains.html" },
    { name: "Traditional Food", link: "food.html" },
    { name: "Bardawil Fishing Tour", link: "fishing.html" },
    { name: "Zaranik Bird Watching", link: "birds.html" },
    { name: "Ancient Pelusium Ruins", link: "history.html" },
    { name: "Sinai University Admission", link: "education.html" },
    { name: "Hotels in Arish", link: "accommodation.html" },
    { name: "Safe Travel Tips", link: "tips.html" },
    { name: "Bedouin Coffee", link: "coffee.html" },
    { name: "Olive Oil Sinai", link: "products.html" },
    { name: "Desert Safaris", link: "safari.html" },
    { name: "Historical Forts", link: "forts.html" },
    { name: "Sinai Guide Contact", link: "contact.html" },
    { name: "About Sinai Guide", link: "about.html" },
    { name: "Local Events", link: "events.html" },
    { name: "Medical Services Arish", link: "health.html" },
    { name: "Public Transport Sinai", link: "transport.html" },
    { name: "Dahia District", link: "districts.html" },
    { name: "Masaed Park", link: "nature.html" },
    { name: "Sinai Archaeological Museum", link: "museum.html" },
    { name: "Seafood Restaurants", link: "dining.html" },
    { name: "Arish Port News", link: "port.html" },
    { name: "Sinai Sports Club", link: "sports.html" },
    { name: "Women Crafts", link: "society.html" },
    { name: "Nature Reserves", link: "nature.html" },
    { name: "North Sinai Governor", link: "government.html" },
    { name: "Investment in Sinai", link: "economy.html" },
    { name: "Traditional Embroidered Dresses", link: "fashion.html" },
    { name: "Palm Tree Groves", link: "agriculture.html" },
    { name: "Sinai Heritage Center", link: "heritage.html" },
    { name: "Archaeology Sites", link: "sites.html" },
    { name: "Bir al-Abed Markets", link: "shopping.html" }
];
inputSearch.addEventListener("input", function () {

    let input = inputSearch.value.trim();
    let result = [];

    if (input.length > 0) {
        result = availableKeywords.filter((item) => {
            return item.name.toLowerCase().includes(input.toLowerCase());
        });
        display(result, input);
    } else {
        resualtsBox.style.display = "none";
        resualtsBox.innerHTML = "";
    }
});

function display(result, inputValue) {
    resualtsBox.style.display = "block";
    if (result.length === 0) {
        resualtsBox.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; padding: 15px; color: white; gap: 10px; font-size: 13px;">
                <i class="fa-solid fa-circle-exclamation" style="color: #ffffff;"></i>
                <span>Search not found for "${inputValue}"</span>
            </div>`;
        return;
    }
    const htmlContent = result.map((item) => {
        const regex = new RegExp(`(${inputValue})`, "gi");
        const highlightedName = item.name.replace(regex, `<span class="highlight">$1</span>`);

        return `<li><a href="${item.link}">${highlightedName}</a></li>`;
    }).join('');

    resualtsBox.innerHTML = `<ul>${htmlContent}</ul>`;
}

document.addEventListener("click", function (e) {
    if (!resualtsBox.contains(e.target) && e.target !== inputSearch) {
        resualtsBox.style.display = "none";
    }
});