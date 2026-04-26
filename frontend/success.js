document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");

    if (!orderId){
        console.error("No orderId found in URL");
        return;
    } 
        
    try {
        const res = await fetch(`/api/orders/${orderId}/pay`, {
            method: "POST"
        });

        const data = await res.json();
        console.log("Payment updated:", data);

        localStorage.removeItem("beautynest_cart");
    } catch (error) {
        console.error("Failed to update payment status:", error);
    }
});