// ============================================================
//   SAFFRON & SPICE  –  restaurant(j) (1).js
//   Simple Beginner JavaScript  |  2 Features:
//   1. 🛒 Cart
//   2. 🎁 Combo Offers
// ============================================================


// --------------------------------------------------
// STEP 1: Our cart list (starts empty)
// --------------------------------------------------
var cart = [];


// --------------------------------------------------
// STEP 2: Run everything when the page is ready
// --------------------------------------------------
window.onload = function () {
  setupAddButtons();
  setupTabButtons();
  setupReviewForm();
  setupComboSection();
};


// --------------------------------------------------
// STEP 3: ADD BUTTONS  – clicking "+ Add" on any dish
// --------------------------------------------------
function setupAddButtons() {
  var buttons = document.querySelectorAll(".add-btn");

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {

      // Find the card this button belongs to
      var card  = btn.closest(".card");
      var name  = card.querySelector(".card-name").innerText;
      var price = parseInt(card.querySelector(".price-tag").innerText.replace(/[^0-9]/g, ""), 10);

      // Add dish to cart
      addToCart(name, price);

      // Show quick green feedback on button
      btn.innerText = "✔ Added!";
      btn.style.background = "#2a6a2a";
      setTimeout(function () {
        btn.innerText = "+ Add";
        btn.style.background = "";
      }, 1200);
    });
  });
}


// --------------------------------------------------
// STEP 4: ADD TO CART LOGIC
// --------------------------------------------------
function addToCart(name, price) {
  // Look for the item already in the cart
  var found = false;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart[i].qty++;   // increase count by 1
      found = true;
      break;
    }
  }

  // New item – push it into the array
  if (!found) {
    cart.push({ name: name, price: price, qty: 1 });
  }

  updateCartBadge();
  openCart();
}

// Update the number shown on the cart button
function updateCartBadge() {
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    total += cart[i].qty;
  }
  document.getElementById("cartCount").innerText = total;
}


// --------------------------------------------------
// STEP 5: CART DRAWER  – slides in from the right
// --------------------------------------------------

// Build the cart drawer once
var cartDrawer = document.createElement("div");
cartDrawer.id = "cartDrawer";

cartDrawer.innerHTML =
  "<div style='display:flex;justify-content:space-between;align-items:center;'>" +
    "<h2>🛒 Your Cart</h2>" +
    "<button id='closeCartBtn'>✕</button>" +
  "</div>" +
  "<div id='cartList'></div>" +
  "<div id='cartTotal'></div>" +
  "<button id='orderBtn'>PLACE ORDER</button>";

document.body.appendChild(cartDrawer);

// Close drawer
document.getElementById("closeCartBtn").addEventListener("click", function () {
  cartDrawer.style.right = "-380px";
});

// Open drawer when nav cart button is clicked
document.querySelector(".cart-btn").addEventListener("click", function () {
  openCart();
});

// Place order button
document.getElementById("orderBtn").addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Your cart is empty! Please add some dishes.");
    return;
  }
  cart = [];              // clear cart first
  updateCartBadge();      // reset badge to 0
  showCartItems();        // show empty cart in drawer
  cartDrawer.style.right = "-380px";  // close the drawer
  // Wait for the drawer slide-out transition (300ms) before showing alert
  setTimeout(function () {
    alert("🎉 Order placed! Thank you for dining with Saffron & Spice.");
  }, 350);
});

function openCart() {
  showCartItems();
  cartDrawer.style.right = "0";
}


// --------------------------------------------------
// STEP 6: DRAW ITEMS INSIDE CART
// --------------------------------------------------
function showCartItems() {
  var list = document.getElementById("cartList");
  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = "<p style='color:#8a7a60;text-align:center;margin-top:30px;'>No items yet!<br>Add dishes from the menu.</p>";
    document.getElementById("cartTotal").innerText = "";
    return;
  }

  var total = 0;

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    total += item.price * item.qty;

    var row = document.createElement("div");
    row.style.cssText =
      "display:flex;justify-content:space-between;align-items:center;" +
      "border-bottom:1px solid rgba(201,148,58,0.12);padding-bottom:8px;";

    row.innerHTML =
      "<div style='flex:1;'>" +
        "<div style='font-size:13px;'>" + item.name + "</div>" +
        "<div style='font-size:11px;color:#8a7a60;'>₹" + item.price + " × " + item.qty + "</div>" +
      "</div>" +
      "<div style='display:flex;align-items:center;gap:6px;'>" +
        "<button onclick='changeQty(" + i + ",-1)' style='background:rgba(201,148,58,0.2);border:none;color:#c9943a;width:22px;height:22px;cursor:pointer;border-radius:50%;'>−</button>" +
        "<span style='min-width:18px;text-align:center;'>" + item.qty + "</span>" +
        "<button onclick='changeQty(" + i + ",1)'  style='background:rgba(201,148,58,0.2);border:none;color:#c9943a;width:22px;height:22px;cursor:pointer;border-radius:50%;'>+</button>" +
        "<span style='min-width:52px;text-align:right;'>₹" + (item.price * item.qty) + "</span>" +
      "</div>";

    list.appendChild(row);
  }

  document.getElementById("cartTotal").innerText = "Total: ₹" + total;
}

// Called when +/- buttons inside cart are clicked
function changeQty(index, change) {
  cart[index].qty += change;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);   // remove item
  }
  updateCartBadge();
  showCartItems();
}


// --------------------------------------------------
// STEP 7: TAB BUTTONS  – filter menu by category
// --------------------------------------------------
function setupTabButtons() {
  var tabs = document.querySelectorAll(".tab-btn");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {

      // Mark only this tab as active
      tabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");

      var label = tab.innerText.trim().toLowerCase();

      // Map each tab label to the data-category used in HTML
      var map = {
        "all items":    null,
        "starters":     "starter",
        "main course":  "main",
        "sweet dishes": "sweet",
        "desserts":     "dessert",
        "drinks":       "drink"
      };
      var target = map[label];

      // Show / hide cards
      document.querySelectorAll(".card").forEach(function (card) {
        card.style.display = (target === null || card.dataset.category === target) ? "" : "none";
      });

      // Show / hide section headings
      document.querySelectorAll(".sub-heading").forEach(function (h) {
        h.style.display = (target === null || h.dataset.category === target) ? "" : "none";
      });
    });
  });
}


// --------------------------------------------------
// STEP 8: REVIEW FORM  – star rating + submit
// --------------------------------------------------
var pickedStars = 0;

function setupReviewForm() {
  var starLabels = [
    document.getElementById("s1"),
    document.getElementById("s2"),
    document.getElementById("s3"),
    document.getElementById("s4"),
    document.getElementById("s5")
  ];

  starLabels.forEach(function (star, i) {
    star.style.cursor   = "pointer";
    star.style.fontSize = "26px";
    star.style.color    = "#7a5920";

    star.addEventListener("click", function () {
      pickedStars = i + 1;
      starLabels.forEach(function (s, j) {
        s.style.color = j < pickedStars ? "#c9943a" : "#7a5920";
      });
    });
  });

  // Submit button
  var submitBtn = document.querySelector(".submit-btn");
  if (!submitBtn) return;

  submitBtn.addEventListener("click", function () {
    var name = document.getElementById("rName").value.trim();
    var dish = document.getElementById("rDish").value.trim();
    var text = document.getElementById("rText").value.trim();

    if (!name || !dish || !text || pickedStars === 0) {
      alert("Please fill all fields and pick a star rating!");
      return;
    }

    // Build star string e.g. ★★★★☆
    var stars = "";
    for (var i = 0; i < 5; i++) { stars += i < pickedStars ? "★" : "☆"; }

    // Add new review card to the grid
    var card = document.createElement("div");
    card.className = "review-card";
    card.innerHTML =
      "<div class='r-stars' style='color:#c9943a;'>" + stars + "</div>" +
      "<p class='r-text'>" + text + " (Dish: " + dish + ")</p>" +
      "<div class='r-name'>— " + name + "</div>";

    document.getElementById("reviewsGrid").appendChild(card);

    // Reset form
    document.getElementById("rName").value = "";
    document.getElementById("rDish").value = "";
    document.getElementById("rText").value = "";
    pickedStars = 0;
    starLabels.forEach(function (s) { s.style.color = "#7a5920"; });

    alert("Thanks for your review, " + name + "! 🌟");
  });
}


// --------------------------------------------------
// STEP 9: COMBO OFFERS SECTION
// --------------------------------------------------
function setupComboSection() {

  var combos = [
    {
      emoji: "🍝",
      name:  "Italian Feast for 2",
      items: ["Bruschetta al Pomodoro", "Spaghetti Carbonara", "Tiramisu", "2× Virgin Mojito"],
      original: 1350,
      offer:    999
    },
    {
      emoji: "🍛",
      name:  "Indian Royal Thali",
      items: ["Tandoori Chicken", "Biryani Royale", "Dal Makhani", "Gulab Jamun", "Mango Lassi"],
      original: 1620,
      offer:    1199
    },
    {
      emoji: "🥟",
      name:  "Chinese Dragon Box",
      items: ["Spring Rolls", "Dim Sum Basket", "Kung Pao Chicken", "Cold Coffee"],
      original: 1100,
      offer:    799
    },
    {
      emoji: "🍮",
      name:  "Sweet Tooth Platter",
      items: ["Belgian Waffles", "Chocolate Lava Cake", "Panna Cotta", "Rose Falooda"],
      original: 880,
      offer:    649
    }
  ];

  // Create the section and place it before the reviews
  var section = document.createElement("div");
  section.id = "comboSection";
  section.innerHTML =
    "<h2>🎁 Combo Offers</h2>" +
    "<p>Best value bundles for a complete dining experience</p>" +
    "<div id='comboGrid'></div>";

  var reviews = document.getElementById("reviews");
  reviews.parentNode.insertBefore(section, reviews);

  var grid = document.getElementById("comboGrid");

  // Draw each combo card
  combos.forEach(function (combo) {
    var saving    = combo.original - combo.offer;
    var itemsHtml = combo.items.map(function (it) { return "• " + it; }).join("<br>");

    var card = document.createElement("div");
    card.className = "combo-card";

    card.innerHTML =
      "<div class='combo-emoji'>" + combo.emoji + "</div>" +
      "<div class='combo-name'>" + combo.name + "</div>" +
      "<div class='combo-items'>" + itemsHtml + "</div>" +
      "<div class='combo-pricing'>" +
        "<span class='combo-original'>₹" + combo.original + "</span>" +
        "<span class='combo-offer'>₹" + combo.offer + "</span>" +
        "<span class='combo-save'>Save ₹" + saving + "</span>" +
      "</div>" +
      "<button class='combo-btn'>ADD COMBO TO CART</button>";

    // Add combo to cart
    card.querySelector(".combo-btn").addEventListener("click", function (e) {
      addToCart(combo.name + " (Combo)", combo.offer);
      e.target.innerText = "✔ Added!";
      e.target.style.background = "#2a6a2a";
      e.target.style.color = "#fff";
      setTimeout(function () {
        e.target.innerText = "ADD COMBO TO CART";
        e.target.style.background = "";
        e.target.style.color = "";
      }, 1400);
    });

    grid.appendChild(card);
  });
}

// ============================================================
//  END OF FILE
// ============================================================
