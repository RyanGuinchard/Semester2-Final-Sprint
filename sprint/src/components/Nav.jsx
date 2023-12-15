import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import Cart from "../components/ShoppingCart.jsx";      

const Nav = () => {
  const [isCartVisible, setCartVisible] = useState(false);

  const handleCartButtonClick = () => {
    setCartVisible(!isCartVisible);
  }
  return (
    <>
    <nav>
      <div className="navBar">

          <Link to="/">
            <div className="navBox" id="nav1">
              <h3>Home</h3>
            </div>
          </Link>
          <br />

          <button className="navBox" onClick={handleCartButtonClick}>Cart</button>
          <br />
      </div>
      </nav>
      {isCartVisible && <Cart/>}
      <Outlet />
    </>
  );
};

export default Nav;

 {/* I have the Checkout link ready to uncomment once it is active. 
          Was throwing an error for me bc it was an empty link, 
          Love you all <3 especially you ryan*/}
          {/* <Link to="/checkout">
            <div className="navBox">
              <h3>Checkout</h3>
            </div>
          </Link> */}
          // jsx hates comments lol - malerie

                  {/* <div class="wrap">
                  <div class="search">
                    <input type="text" class="searchTerm" placeholder="Search..." />
                    <button type="submit" class="searchButton">
                      <i class="fa fa-search">
                          <img src = "Images/search_icon_125165.png" id = "searchIcon" /> 
                      </i>
                    </button>
                  </div>
              </div> */}
                        {/* <Link to="/cart">
            <div className="navBox">
              <h3>Cart</h3>
            </div>
          </Link> */}