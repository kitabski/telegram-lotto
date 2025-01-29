const TON_WALLET_ADDRESS = "UQAb9huKLaDu0DkgzAHIKMVKMx5FJ6PLhKRg4LdYKoP6MFAF"; // Укажите ваш TON-кошелек

function showPaymentInfo(amount) {
    if (!amount || amount <= 0) {
        alert("Введите корректную сумму!");
        return;
    }

    const paymentUrl = `ton://transfer/${TON_WALLET_ADDRESS}?amount=${amount * 1000000000}`; // Конвертация в нанотон

    document.getElementById("payment-info").innerHTML = `
        <p>Переведите <b>${amount} TON</b> на адрес:</p>
        <p><b>${TON_WALLET_ADDRESS}</b></p>
        <a href="${paymentUrl}" target="_blank">Открыть в TON Wallet</a>
    `;
}

document.getElementById("recharge-button").addEventListener("click", () => {
    const amount = parseFloat(prompt("Введите сумму пополнения (TON):"));
    showPaymentInfo(amount);
});
