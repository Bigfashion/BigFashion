# Save the provided shop HTML content to a file for download
shop_html = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Shop - Big Fashion</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    header {
      background-color: #333;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .shop-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    .product {
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      overflow: hidden;
      text-align: center;
    }
    .product img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .product h3 {
      margin: 10px 0 5px;
    }
    .product p {
      margin: 0 0 10px;
      color: #555;
    }
    .buy-btn {
      display: inline-block;
      margin: 10px;
      padding: 10px 20px;
      background-color: #d63384;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <header>
    <h1>Shop - Big Fashion</h1>
    <p>Explore our African and Classic Suits Collection</p>
  </header>

  <div class="shop-container">
    <div class="product">
      <img src="https://via.placeholder.com/300x200?text=African+Dress" alt="African Dress"/>
      <h3>African Kitenge Dress</h3>
      <p>KES 3,500</p>
      <a href="https://wa.me/254793776963?text=I'm%20interested%20in%20the%20African%20Kitenge%20Dress" class="buy-btn">Buy on WhatsApp</a>
    </div>
    <div class="product">
      <img src="https://via.placeholder.com/300x200?text=Men+Suit" alt="Classic Suit"/>
      <h3>Men's Classic Navy Suit</h3>
      <p>KES 7,500</p>
      <a href="https://wa.me/254793776963?text=I'm%20interested%20in%20the%20Navy%20Suit" class="buy-btn">Buy on WhatsApp</a>
    </div>
    <div class="product">
      <img src="https://via.placeholder.com/300x200?text=African+Shirt" alt="African Shirt"/>
      <h3>African Print Shirt</h3>
      <p>KES 2,000</p>
      <a href="https://wa.me/254793776963?text=I'm%20interested%20in%20the%20African%20Shirt" class="buy-btn">Buy on WhatsApp</a>
    </div>
    <div class="product">
      <img src="https://via.placeholder.com/300x200?text=Women+Suit" alt="Women's Suit"/>
      <h3>Women's Classic Suit</h3>
      <p>KES 6,800</p>
      <a href="https://wa.me/254793776963?text=I'm%20interested%20in%20the%20Women's%20Suit" class="buy-btn">Buy on WhatsApp</a>
    </div>
  </div>
</body>
</html>
"""

# Write to file
shop_file_path = Path("/mnt/data/shop.html")
shop_file_path.write_text(shop_html)

shop_file_path.name
