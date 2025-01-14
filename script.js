document.addEventListener('DOMContentLoaded', function() {
    // --- Phần Giỏ Hàng ---
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; // Load giỏ hàng từ localStorage hoặc khởi tạo mảng rỗng
    let totalPrice = 0; // Biến lưu tổng tiền
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    const categoryButtons = document.querySelectorAll('.category-button');
  
    // Cập nhật tổng tiền và giỏ hàng khi load trang
    updateCartDisplay();
    updateCartDisplayOrder();
  
    function updateCartDisplayOrder() {
        const cartPage = document.getElementById('services-page');
        if (cartPage) {
            const cartItemsList = document.querySelector('#order-section .cart-items');
            const totalPriceElement = document.querySelector('#order-section .total-price');
            if (cartItems.length === 0) {
                cartItemsList.innerHTML = '<li>Không có sản phẩm nào trong giỏ hàng</li>';
                totalPriceElement.textContent = 0;
            } else {
                cartItemsList.innerHTML = '';
                let totalCartPrice = 0;
  
                //Tạo object để lưu số lượng sản phẩm
                const productCounts = {};
                cartItems.forEach((item, index) => {
                    if (productCounts[item.name]) {
                        productCounts[item.name].quantity++;
                        productCounts[item.name].price += item.price;
                         productCounts[item.name].indices.push(index);
                    } else {
                        productCounts[item.name] = {
                            quantity: 1,
                            price: item.price,
                            indices: [index] // Store the indices of items with the same name
                        }
                    }
                });
  
                for (const productName in productCounts) {
                    const item = productCounts[productName];
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `${productName} - Số lượng: ${item.quantity} - Giá: ${item.price.toLocaleString('vi-VN')} VNĐ <button class="remove-item-btn" data-product-name="${productName}">Xóa</button>`;
                    cartItemsList.appendChild(listItem);
                    totalCartPrice += item.price;
                }
                totalPriceElement.textContent = totalCartPrice.toLocaleString('vi-VN');
            }
        }
  
        // Add event listeners to remove buttons in the updated cart
      const removeButtons = document.querySelectorAll('.remove-item-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function(){
                const productName = this.getAttribute('data-product-name');
                removeCartItem(productName);
            })
        });
    }
  
  
    // Clear Cart functionality
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            cartItems = []; // Clear the cart
            localStorage.removeItem('cartItems'); // Remove cart from local storage
            updateCartDisplay(); // Update the display
            updateCartDisplayOrder();
        });
    }
  
    function removeCartItem(productName){
            const productCounts = {};
            cartItems.forEach((item, index) => {
               if (productCounts[item.name]) {
                   productCounts[item.name].indices.push(index);
               } else {
                    productCounts[item.name] = {
                       indices: [index]
                     }
               }
           });
            const indicesToRemove = productCounts[productName].indices;
            if(indicesToRemove && indicesToRemove.length > 0){
                   cartItems = cartItems.filter((_,index) => !indicesToRemove.includes(index));
                   localStorage.setItem('cartItems', JSON.stringify(cartItems));
                   updateCartDisplay();
                  updateCartDisplayOrder();
           }
    }
  
  
    // --- Phần Bộ Lọc Dịch Vụ ---
    categoryButtons.forEach(button => {
       button.addEventListener('click', function(){
           categoryButtons.forEach(btn => btn.classList.remove('active'));
           this.classList.add('active');
  
            const selectedCategory = this.getAttribute('data-category');
              const serviceItems = document.querySelectorAll('.service-item');
                  serviceItems.forEach(item => {
                     const itemCategory = item.querySelector('h3').textContent;
                     if(selectedCategory === '' || itemCategory.toLowerCase().includes(selectedCategory.toLowerCase())){
                       item.style.display = 'block';
                    }else {
                      item.style.display = 'none';
                    }
                })
           })
    });
      // --- Modal Functionality For Services ---
      const modal = document.getElementById('service-modal');
      const modalContent = document.querySelector('.modal-content');
      const closeBtn = document.querySelector('.close-button');
      const viewDetailButtons = document.querySelectorAll('.view-detail-btn');
  
      viewDetailButtons.forEach(button => {
          button.addEventListener('click', function () {
              const serviceItem = this.closest('.service-item');
              const serviceName = serviceItem.querySelector('h3').textContent;
              const servicePrice = serviceItem.querySelector('.price').textContent;
              const serviceDescription = serviceItem.querySelector('.description').textContent;
              const currentQuantity = getServiceQuantity(serviceName);
              // Hardcoded for demo purposes. Replace with your logic to fetch or determine the service image.
              const serviceImage = 'placeholder-image.jpg';
  
  
              modalContent.innerHTML = `
                  <h3>${serviceName}</h3>
                  <p class="price">${servicePrice}</p>
                  <p class="description">${serviceDescription}</p>
                  <div class="quantity-control">
                      <button class="quantity-btn minus-btn">-</button>
                      <input type="number" value="${currentQuantity}" min="0" class="quantity-input">
                      <button class="quantity-btn plus-btn">+</button>
                  </div>
              `;
  
              // --- Phần tăng giảm số lượng sản phẩm in modal---
             const quantityControls = modalContent.querySelectorAll('.quantity-control');
               quantityControls.forEach(control => {
                   const minusBtn = control.querySelector('.minus-btn');
                  const plusBtn = control.querySelector('.plus-btn');
                  const quantityInput = control.querySelector('.quantity-input');
  
                  minusBtn.addEventListener('click', function() {
                    let currentValue = parseInt(quantityInput.value);
                      if (currentValue > 0) {
                        quantityInput.value = currentValue - 1;
                        }
                     });
  
                    plusBtn.addEventListener('click', function() {
                      let currentValue = parseInt(quantityInput.value);
                     quantityInput.value = currentValue + 1;
                     });
                });
  
               modal.style.display = 'block';
                });
            });
  
        closeBtn.addEventListener('click', function () {
           modal.style.display = 'none';
       });
  
       window.addEventListener('click', function(event){
          if(event.target == modal) {
            modal.style.display = 'none';
          }
      })
      // Get all + and - buttons
      const serviceItems = document.querySelectorAll('.service-item');
        serviceItems.forEach(item =>{
        const plusButton = item.querySelector('.plus-btn');
           const minusButton = item.querySelector('.minus-btn');
              const serviceName = item.querySelector('h3').textContent;
              const servicePrice = parseInt(item.closest('.service-item').getAttribute('data-price'));
  
              if(plusButton){
                  plusButton.addEventListener('click', function(){
                      const currentQuantity = getServiceQuantity(serviceName);
                           updateCart(serviceName, servicePrice, currentQuantity + 1);
                  })
              }
              if(minusButton){
                  minusButton.addEventListener('click', function(){
                      const currentQuantity = getServiceQuantity(serviceName);
                          if (currentQuantity > 0) {
                              updateCart(serviceName, servicePrice, currentQuantity - 1);
                         }
                  })
              }
      });
  
    function updateCart(serviceName, servicePrice, quantity){
             // Remove all instances of the service from the cart
                  cartItems = cartItems.filter(item => item.name !== serviceName);
              //Add new instances based on quantity selected
                   for (let i = 0; i < quantity; i++) {
                     cartItems.push({
                         name: serviceName,
                          price: servicePrice,
                      });
                   }
              updateCartDisplay();
              localStorage.setItem('cartItems', JSON.stringify(cartItems));
              updateCartDisplayOrder();
    }
  
    function getServiceQuantity(serviceName) {
           let count = 0;
            cartItems.forEach(item => {
              if(item.name === serviceName){
                   count++;
               }
            })
              return count;
      }
  
  
      function updateCartDisplay() {
        totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('total-price').textContent = totalPrice.toLocaleString('vi-VN');
    }
      // --- Copy cart functionality ---
      const copyCartBtn = document.querySelector('.copy-cart-btn');
      if (copyCartBtn) {
            copyCartBtn.addEventListener('click', function() {
                const cartText = generateCartText();
                copyToClipboard(cartText);
                alert('Đã copy giỏ hàng!');
             });
          }
  
      function generateCartText() {
              let cartText = 'Giỏ hàng:\n';
              const productCounts = {};
                cartItems.forEach((item) => {
                   if (productCounts[item.name]) {
                       productCounts[item.name].quantity++;
                       productCounts[item.name].price += item.price;
                    } else {
                        productCounts[item.name] = {
                           quantity: 1,
                           price: item.price
                        }
                    }
               });
               for (const productName in productCounts) {
                    const item = productCounts[productName];
                    cartText += `- ${productName} - Số lượng: ${item.quantity} - Giá: ${item.price.toLocaleString('vi-VN')} VNĐ\n`;
                }
               cartText += `Tổng tiền: ${totalPrice.toLocaleString('vi-VN')} VNĐ`;
              return cartText;
      }
  
      function copyToClipboard(text) {
              navigator.clipboard.writeText(text).catch(err => {
                 console.error('Không thể copy: ', err);
              });
          }
  });