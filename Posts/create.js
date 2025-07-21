function filterPosts() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const items = document.querySelectorAll("#postList a");

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(input) ? "block" : "none";
  });
}
