
// Пример данных товаров
const products = [
  { id: 1, name: 'Шаурма сырная', price: 100 },
  { id: 2, name: 'Шаурма острая', price: 150 },
  { id: 3, name: 'Гиро', price: 200 },
  { id: 4, name: 'Шаурма в тарелке', price: 250 },
  { id: 5, name: 'Кебаб с курицей', price: 300 },
  { id: 6, name: 'Кебаб с говядиной', price: 350 },
  { id: 7, name: 'Наташка 1ч', price: 300 },
  { id: 8, name: 'Кола Ванильная', price: 350 },
  { id: 9, name: 'Лимпопо Апельсин', price: 300 },
  { id: 10, name: 'Витаминофф', price: 350 }
];

// Создание карточек товаров
function createProductCards() {
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-name">${product.name}</div>
      <div class="product-price">Цена: ${product.price} руб.</div>
      <div id="quantity-${product.id}" class="quantity-controls">
        <button class="quantity-button" data-action="decrement" data-id="${product.id}">-</button>
        <span class="quantity-value" data-id="${product.id}">0</span>
        <button class="quantity-button" data-action="increment" data-id="${product.id}">+</button>
      </div>
      <button class="add-to-cart-button" data-id="${product.id}">Добавить</button>
    `;
    document.querySelector('.product-grid').appendChild(card);

    // Управление количеством товаров
    const quantityButtons = card.querySelectorAll('.quantity-button');
    quantityButtons.forEach(button => {
      button.addEventListener('click', function() {
        const productId = button.dataset.id;
        const action = button.dataset.action;
        const quantitySpan = card.querySelector(`.quantity-value[data-id="${productId}"]`);
        let quantity = parseInt(quantitySpan.textContent, 10);

        if (action === 'increment') {
          quantity++;
        } else if (action === 'decrement') {
          quantity--;
          if (quantity < 0) {
            quantity = 0;
          }
        }

        quantitySpan.textContent = quantity;

        if (quantity === 0) {
          card.querySelector('.quantity-controls').style.display = 'none';
          card.querySelector('.add-to-cart-button').style.display = 'block';
        } else {
          card.querySelector('.quantity-controls').style.display = 'flex';
          card.querySelector('.add-to-cart-button').style.display = 'none';
        }
      });
    });

    // Добавление товара в корзину
    card.querySelector('.add-to-cart-button').addEventListener('click', function() {
      const productId = this.dataset.id;
      const quantitySpan = card.querySelector(`.quantity-value[data-id="${productId}"]`);
      quantitySpan.textContent = 1;
      card.querySelector('.quantity-controls').style.display = 'flex';
      card.querySelector('.add-to-cart-button').style.display = 'none';
    });
  });
}

// Отображение содержимого корзины
function displayCart() {
  const cartOverlay = document.getElementById('cartOverlay');
  cartOverlay.style.display = 'flex';

  const cartItemsElement = document.getElementById('cartItems');
  cartItemsElement.innerHTML = '';

  let totalPrice = 0;

  products.forEach(product => {
    const quantitySpan = document.querySelector(`.quantity-value[data-id="${product.id}"]`);
    const quantity = parseInt(quantitySpan.textContent, 10);
    if (quantity > 0) {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-details">
          ${product.name} x ${quantity}
        </div>
        <div class="cart-item-quantity">
          ${product.price * quantity} руб.
        </div>
      `;
      cartItemsElement.appendChild(cartItem);
      totalPrice += product.price * quantity;
    }
  });

  // Отображение итоговой суммы
  const totalElement = document.createElement('div');
  totalElement.innerHTML = `Итого: ${totalPrice} руб.`;
  cartItemsElement.appendChild(totalElement);

  // Обработчик события для кнопки "Оформить заказ"
  document.getElementById('checkoutButton').addEventListener('click', function() {
    const cartData = {
      totalPrice: totalPrice,
      items: []
    };

    products.forEach(product => {
      const quantitySpan = document.querySelector(`.quantity-value[data-id="${product.id}"]`);
      const quantity = parseInt(quantitySpan.textContent, 10);
      if (quantity > 0) {
        cartData.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity
        });
      }
    });

    // Отправка данных в Telegram бота
    window.Telegram.WebApp.sendData(JSON.stringify(cartData));
    console.log(cartData);

    // Закрытие окна корзины
    cartOverlay.style.display = 'none';
  });
}
// Закрытие окна корзины при клике на оверлей
document.getElementById('cartOverlay').addEventListener('click', function(e) {
  if (e.target === this) {
    this.style.display = 'none';
  }
});

// Обработчик события для кнопки "Корзина"
document.getElementById('cartButton').addEventListener('click', function() {
  displayCart();
});

// Вызов функции для создания карточек товаров
createProductCards();
