import "../styles/index.css";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch.jsx";
import { useShoppingCart } from "../context/ShoppingCartContext.js";
import addCartIcon from "../images/addCart.png";

const Home = () => {
  const { data: products, loading, error } = useFetch('http://localhost:8080/products');
  const [displayedProducts, setDisplaProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [shuffledProducts, setShuffledProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortButtonText, setSortButtonText] = useState("Price (Low to High)");
  const { addToCart, updateQuantity, cartItems } = useShoppingCart();
  const [quantities, setQuantities] = useState({});

  // Shuffle products every render
  useEffect(() => {
    if (products) {
      const shuffled = shuffleArray(products);
      setShuffledProducts(shuffled);
    }
  }, [products]);
  setDisplaProducts(shuffledProducts);
  
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const sortProducts = () => {
    let sortedProducts = [...products]; // Using the original products for sorting

    // Sort by price
    sortedProducts = sortedProducts.sort((a, b) => {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    });

    // Filter by category if selectedCategory is set
    if (selectedCategory) {
      sortedProducts = sortedProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    setShuffledProducts(sortedProducts);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortButtonText(
      sortOrder === "asc" ? "Price (High to Low)" : "Price (Low to High)"
    );
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleQuantityChange = (product, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [product.id]: quantity,
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    const existingItemIndex = cartItems.findIndex((item) => item.id === product.id);
  
    if (existingItemIndex !== -1) {
      // Item is already in the cart, update the quantity
      updateQuantity(product.id, cartItems[existingItemIndex].quantity + quantity);
    } else {
      // Item is not in the cart, add it with the specified quantity
      addToCart({ ...product, quantity });
    }
  
    // Reset quantity back to 1
    setQuantities((prevQuantities) => ({ ...prevQuantities, [product.id]: 1 }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <div className="productList">
        <div className="listedProduct">
          {shuffledProducts.map((product, index) => (
            // Card for Product
            <div className="item" key={product.id}>
              <div className="productTitle">
                <h3 className="h3Title">{product.title}</h3>
              </div>

              <div className="productImage">
                <img
                  src={product.image}
                  alt={product.title}
                  className="image"
                />
              </div>

              <p className="productPrice">${product.price}</p>
              <div className="productDetails">
                <div className="productActions">
                  <label>
                    Qty:
                    <input
                      className="qtyInput"
                      type="number"
                      min="1"
                      value={quantities[product.id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(
                          product,
                          parseInt(e.target.value, 10)
                        )
                      }
                    />
                  </label>
                  <div className="addCartBtn">
                    <button
                      className="addCartBtn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <img
                        src={addCartIcon}
                        alt="Add to Cart"
                        className="addCartIcon"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Home;
