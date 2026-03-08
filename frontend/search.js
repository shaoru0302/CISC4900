const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            const keyword = searchInput.value.trim();
            if (!keyword) return;
            window.location.href = `search-result.html?q=${encodeURIComponent(keyword)}`;
        }
    });
}