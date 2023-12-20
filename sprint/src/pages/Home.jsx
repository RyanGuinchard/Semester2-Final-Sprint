import "../styles/index.css";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch.jsx";
import { useShoppingCart } from "../context/ShoppingCartContext.js";
import addCartIcon from "../images/addCart.png";
import { Link } from 'react-router-dom';
import ProductDetails from "../components/ProductDetails.jsx";

const Home = () => {
  const { data: products, loading, error } = useFetch('http://localhost:8080/products');
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [shuffledProducts, setShuffledProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortButtonText, setSortButtonText] = useState("Price (Low to High)");
  const { addToCart, updateQuantity, cartItems } = useShoppingCart();
  const [quantities, setQuantities] = useState({});
  const [showAddedToCartAlert, setShowAddedToCartAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [prodDetails, setProdDetails] = useState(false); 
  const chimeSound = new Audio('/AddtoCart.mp3');
  const categories = [
    'Clothing',
    'Food-and-Drink',
    'Merchandise',
    'Seasonal'
  ];

// Shuffle products every render
useEffect(() => {
  if (products) {
    const shuffled = shuffleArray(products);
    setShuffledProducts(shuffled);
    setDisplayedProducts(shuffled);      
  }
}, [products]);

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
    let sortedProducts = [...displayedProducts];
  
    // Sort by price
    sortedProducts = displayedProducts.sort((a, b) => {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    });
    
  
    
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");

    // Update sort button text based on sorting order
    const buttonText =
      sortOrder === "asc" ? "Price: Low to High" : "Price: High to Low";
    setSortButtonText(buttonText);
    setDisplayedProducts(sortedProducts);
    };


  
  const handleCategoryToggle = (category) => {
    let updatedCategories = [];
  
    // If the category is already selected, remove it
    if (selectedCategory && selectedCategory.includes(category)) {
      updatedCategories = selectedCategory.filter((selected) => selected !== category);
    } else {
      // If the category isn't selected, add it to the list
      updatedCategories = selectedCategory ? [...selectedCategory, category] : [category];
    }

    // Update the selected categories
    setSelectedCategory(updatedCategories);
  
    // Filter the products based on the selected categories
    let filteredProducts = shuffledProducts.filter((product) => {
      return updatedCategories.includes(product.category);
    });
  
    // If no categories are selected, show all products
    if (updatedCategories.length === 0) {
      filteredProducts = shuffledProducts;
    }


    // if category is null
    if (category === null) {
      setSelectedCategory([]);
      setDisplayedProducts(shuffledProducts);
      return;
    }
  
    // Update displayed products
    setDisplayedProducts(filteredProducts);
  };

  // Function to handle selecting a product
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setProdDetails(true); // Update state to show product details
  };

  // Function to close the modal
  const handleCloseProdDetails = () => {
    prodDetails(false); // Corrected state variable name
    setSelectedProduct(null);
  };

  const handleQuantityChange = (product, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [product.id]: quantity,
    }));
  };
  

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1; // Fetch the quantity for the product
    addToCart(product, quantity);

    
    chimeSound.play();
  
    // Hide the alert after 3 seconds
    setTimeout(() => {
      setShowAddedToCartAlert(false);
    }, 3000);
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
      {showAddedToCartAlert && (
        <div className="addedToCartAlert">
          Added to cart!
        </div>
      )}

<div className = "categories">
  {/* <h2>Categories:</h2> */}
  <div className = "category"> 
    {categories.map((category, index) => (
    <p key={index}>
      <button
      key={index}
      className=  {selectedCategory && selectedCategory.includes(category) ? "categoryBar categoryBarSelect" : "categoryBar"}
      onClick={() => handleCategoryToggle(category)}
      >
        {category}
      </button>
    </p>
    ))}

<button
  className="showAllBtn"
  onClick={() => {
    setDisplayedProducts(shuffledProducts);
    handleCategoryToggle(null);
  }}
>
  Show All
</button>

    <h2 className = "sortBy">Sort By: </h2>
      <button 
      className = "sortBtn" 
      onClick={sortProducts}>
        {sortButtonText}
        </button>


</div>
</div>

      <div className="productList">
        <div className="listedProduct">
          {displayedProducts.map((product, index) => (

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
                <button onClick={() => handleProductSelect(product)}>View Details</button>
              </div>
    
{/* Modal for displaying product details */}
{selectedProduct && prodDetails && (
  <div className="Shadow">
    {loading && <p>Loading...</p>}
    {error && <p>Error: {error}</p>}
    {selectedProduct && prodDetails && (
      <div className="DetailsFrame" key={selectedProduct.id}>
        <div className="TitleFrame">
          <h3 className="TitleText" id="title">{selectedProduct.title}</h3>
        </div>
        <div className="ImagePortrait">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.title}
            className="image"
          />
        </div>
        <div className="DescriptionFrame">
          <p id="Desc">{selectedProduct.description}</p>
        </div>
        <p className="productPrice">${selectedProduct.price}</p>
      </div>
    )}
    {products && (
      <div className="ProductList">
        <h4>Other Products:</h4>
        <ul>
          {products.map((product) => (
            <li key={product.id} onClick={() => handleProductSelect(product)}>
              {product.title}
            </li>
          ))}
        </ul>
      </div>
    )}
    <span className="close" onClick={handleCloseProdDetails}>&times;</span>
    {selectedProduct && <ProductDetails product={selectedProduct} />}
  </div>
)}

              <p className="productPrice">${product.price}</p>
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
                        className="icon"
                        id = "addCartIcon"
                      />
                    </button>
                </div>
              </div>
            </div>
          ))}
          </div>
          </div>
          </>
  )}
  export default Home;
