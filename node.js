// Chekni kuryerga yuborish funksiyasi
function showReceipt(paymentMethod) {
    // Chek ma'lumotlarini yig'ish
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const receiptText = `
        <p><strong>${translations[currentLang]['first-name']}:</strong> ${firstNameInput.value}</p>
        <p><strong>${translations[currentLang]['last-name']}:</strong> ${lastNameInput.value}</p>
        <p><strong>${translations[currentLang]['address']}:</strong> ${addressInput.value}</p>
        <p><strong>${translations[currentLang]['phone']}:</strong> ${phoneInput.value}</p>
        <p><strong>${translations[currentLang]['payment-method']}:</strong> ${paymentMethod}</p>
        <hr class="my-2">
        <h3 class="text-sm font-semibold mb-2">${translations[currentLang]['order']}:</h3>
        ${cart.map(item => `
            <div class="flex justify-between mb-1 text-xs">
                <span>${item.title[currentLang]} (x${item.quantity})</span>
                <span>${(item.price * item.quantity).toLocaleString()} UZS</span>
            </div>
        `).join('')}
        <p class="font-semibold mt-2 text-sm">${translations[currentLang]['total']}: ${total.toLocaleString()} UZS</p>
        <p class="text-xs text-gray-500 mt-1">${translations[currentLang]['date']}: ${new Date().toLocaleString('uz')}</p>
    `;
    
    // Mijozga chekni ko'rsatish
    receiptContent.innerHTML = receiptText;
    receiptModal.classList.remove('hidden');
    paymentModal.classList.add('hidden');
    cartModal.classList.add('hidden');

    // Buyurtma ma'lumotlarini kuryerga yuborish
    const orderData = {
        id: Date.now(), // Noyob ID
        receipt: receiptText, // Chek matni
        date: new Date().toLocaleString('uz') // Sana
    };

    // localStorage'ga saqlash
    let courierOrders = JSON.parse(localStorage.getItem('orders')) || [];
    courierOrders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(courierOrders));
    localStorage.setItem('orderUpdate', Date.now().toString()); // Yangilanish belgisi

    // Mijozga xabar
    alert('Buyurtma va chek kuryerga yuborildi!');

    // Savatni tozalash
    resetCartAndForm();
}

// Savatni tozalash funksiyasi
function resetCartAndForm() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    smsCodeInput.value = '';
    smsCodeInput.classList.add('hidden');
    cardNumberInput.value = '';
    cardExpiryInput.value = '';
    cardTypeLabel.textContent = '';
    cardForm.classList.add('hidden');
    confirmPayment.classList.add('hidden');
    updateCart();
}

// To'lov tasdiqlash
confirmPayment.addEventListener('click', () => {
    let paymentMethod = cashPayment.classList.contains('active') ? translations[currentLang]['cash'] : detectCardType(cardNumberInput.value);
    if (paymentMethod === translations[currentLang]['cash'] || (cardNumberInput.value.match(/^\d{16}$/) && cardExpiryInput.value.match(/^\d{2}\/\d{2}$/) && paymentMethod)) {
        showReceipt(paymentMethod);
    } else {
        alert(translations[currentLang]['invalid-card'] || 'To‘lov ma’lumotlari noto‘g‘ri!');
    }
});