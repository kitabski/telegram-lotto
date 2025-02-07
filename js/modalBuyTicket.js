import { loadTicket } from "./ticketRenderer.js";

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("ticket-modal");
    const openBtn = document.getElementById("buy-ticket");
    const closeBtn = document.getElementById("close-modal");
    const ticketContainer = document.getElementById("ticket-container");
    
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            modal.style.display = "flex";
            loadTicket("012", "ticket-container"); // Загружает билет с ID "ticket1"
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }
});

