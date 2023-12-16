import useFetch from "../hooks/useFetch.jsx";
import "../styles/index.css";
import { useState, useEffect } from "react";
import { useShoppingCart } from '../context/ShoppingCartContext.js';

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const ProductList = () => {
  const { data: products, loading, error } = useFetch('http://localhost:8080/products');
  const { addToCart, updateQuantity, cartItems } = useShoppingCart();

  const [shuffledProducts, setShuffledProducts] = 
  useState([]);
  const [quantities, setQuantities] = useState({});
  const [showMore, setShowMore] = useState([]);
  // useEffect(() => {
  //   if (products) {
  //     const shuffled = shuffleArray(products);
  //     setShuffledProducts(shuffled);
  //     setShowMore(Array(shuffled.length).fill(false));
  //   }
  // }, [products]);
  useEffect(() => {
    if (products) {
      const shuffled = shuffleArray(products);
      console.log('Shuffled products:', shuffled); // Log the shuffled products
      setShuffledProducts(shuffled);
      setShowMore(Array(shuffled.length).fill(false));
    }
  }, [products]);

 const handleToggleDescription = (index) => {
    const updatedShowMore = [...showMore];
    updatedShowMore[index] = !updatedShowMore[index];
    setShowMore(updatedShowMore);
  };
  

  const handleQuantityChange = (product, quantity) => {
    setQuantities((prevQuantities) => ({ ...prevQuantities, [product.id]: quantity }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;

    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      // If item already exists in the cart, update its quantity
      updateQuantity(product.id, existingItem.quantity + quantity);
    } else {
      // If item doesn't exist, add it to the cart with the specified quantity
      addToCart({ ...product, quantity });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!products || products.length === 0) {
    return <p>No products available.</p>;
  }
  
    return (
      <>
      <div className="productListHTML">
      <div className="listedProduct">
        {products.map((product, index) => (
          <div className="item" key={product.id}>
            
  
            <div className="itemDetails">
              <h2 className = "productTitle">{product.title}</h2>


              <div className = "productImage">
            <img src={product.image} alt={product.title} className="image" />
          </div>


              {/* Conditionally render Show More button */}
              {product.description.length > 140 && (
                <button onClick={() => handleToggleDescription(index)}>
                  {showMore[index] ? '' : 'Show More'}
                </button>
              )}

              <p className="productDesc">
                {showMore[index]
                  ? product.description
                  : `${product.description.slice(0, 140)}...`}
              </p>

              <p className = "productPrice"> {product.price}</p>

              <div className="quantityWrapper">
                <label>
                  Qty:
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.id] || 1}
                    onChange={(e) => handleQuantityChange(product, parseInt(e.target.value, 10))}
                  />
                </label>
              </div>
              <button 
              className = "addCartBtn"
              onClick={() => handleAddToCart(product)}>
                Add to Cart
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default ProductList;