import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Savor the authentic taste of home</h2>
        <p>
          Discover Casa Lasa's carefully curated menu of traditional Filipino
          dishes and modern favorites, prepared with premium ingredients and
          generations of culinary passion. From our casa to yours – experience
          the true lasa of exceptional dining.
        </p>
        <button>Explore Menu</button>
      </div>
    </div>
  );
};

export default Header;
