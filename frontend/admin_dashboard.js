    async function loadAdminPage() {
      try {
        const meRes = await fetch("/api/me");
        const meData = await meRes.json();

        if (!meData.loggedIn || meData.role !== "admin") {
          window.location.href = "/";
          return;
        }

        document.getElementById("welcomeText").innerText =
          "Welcome " + meData.displayName;

        const summaryRes = await fetch("/api/admin/summary");
        const summaryData = await summaryRes.json();

        document.getElementById("totalProducts").textContent = summaryData.totalProducts;
        document.getElementById("totalOrders").textContent = summaryData.totalOrders;
        document.getElementById("pendingOrders").textContent = summaryData.pendingOrders;
        document.getElementById("lowStockProducts").textContent = summaryData.lowStockProducts;
      } catch (error) {
        console.error("Failed to load admin dashboard:", error);
        window.location.href = "/";
      }
    }

    loadAdminPage();
