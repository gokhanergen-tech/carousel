/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} url
 * @property {string} img
 * @property {number} price
 */

class CarouselProducts {
  /**
   * @type {Product[]}
   */
  products;
  currentPosition = 0;
  step = 352;

  handleClickMoving = (direction) => {
    const productsDom = document.getElementById("products");

    let position = this.currentPosition * this.step;
    const movingPosition = productsDom.scrollWidth - productsDom.clientWidth;

    const isEnd = Math.abs(position + -352 * direction) >= movingPosition;
    const isStart = position >= 0;

    if (isEnd && direction === 1) position = -movingPosition * direction;
    else if (isStart && direction === -1) position = 0;
    else {
      const style = window.getComputedStyle(productsDom);
      const matrix = new DOMMatrixReadOnly(style.transform);

      if (direction === -1 && matrix.m41 === -movingPosition) {
        this.currentPosition--;
      }
      this.currentPosition += -direction;
      position = this.currentPosition * this.step;
    }

    productsDom.style.transform = `translateX(${position}px)`;
  };

  render() {
    if (!products) throw new Error("Empty products");
    const wrapperCarousel = document.getElementById("products");
    this.products.forEach((product) => {
      wrapperCarousel.appendChild(this.createProductHtml(product));
    });
    document.getElementById("right_button").addEventListener("click", () => {
      this.handleClickMoving(1);
    });
    document.getElementById("left_button").addEventListener("click", () => {
      this.handleClickMoving(-1);
    });
  }

  /**
   *
   * @param {Product} product
   * @returns
   */
  createProductHtml(product) {
    const productDetail = document.createElement("div");
    productDetail.className = "product_detail";
    const container = document.createElement("article");
    container.className = "container";

    const productImg = new Image();
    productImg.src = product.img;
    productImg.className = "product_image";

    container.appendChild(productImg);

    const productInfoDOM = document.createElement("div");
    const productNameDOM = document.createElement("a");
    const productPrice = document.createElement("strong");

    productNameDOM.textContent = product.name;
    productNameDOM.className = "product_name";
    productInfoDOM.className = "product_info";
    productNameDOM.addEventListener("click", () => {
      window.open(product.url, "__blank");
    });
    productInfoDOM.appendChild(productNameDOM);

    productPrice.textContent = `${product.price} TL`;
    productPrice.className = "product_price";
    productInfoDOM.appendChild(productPrice);

    const likedProducts = JSON.parse(localStorage.getItem("likedProducts"));

    const isLiked = likedProducts?.[product.id];

    const likeButton = document.createElement("button");
    likeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483"><path fill=${
      isLiked ? "blue" : "white"
    } stroke="#555" stroke-width="1.5px" d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z" transform="translate(.756 -1.076)"></path></svg>`;
    likeButton.className = "product_like_button";
    likeButton.addEventListener("click", () => {
      const likedProducts = JSON.parse(localStorage.getItem("likedProducts"));

      const isLiked = likedProducts?.[product.id];
      const path = likeButton.querySelector("path");
      let newState;
      if (isLiked) {
        newState = false;
        path.style.fill = "white";
      } else {
        newState = true;
        path.style.fill = "blue";
      }

      likedProducts[product.id] = newState;

      localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
    });

    container.appendChild(productInfoDOM);
    productDetail.appendChild(likeButton);
    productDetail.appendChild(container);
    return productDetail;
  }
}

class Products {
  #GET_PRODUCTS_URL = `https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/
raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json`;

  #carouselProducts = new CarouselProducts();

  buildHTML = () => {
    const body = document.body;
    body.innerHTML = "";

    const wrapper_carousel = document.createElement("div");
    const products_wrapper = document.createElement("div");
    products_wrapper.className = "products_wrapper";
    const title = document.createElement("h1");
    title.className = "title";
    title.textContent = "You Might Also Like";

    products_wrapper.appendChild(title);

    const products = document.createElement("article");
    products.id = "products";

    products_wrapper.appendChild(products);

    wrapper_carousel.classList.add("carousel_style");

    const left_arrow_svg = document.createElement("button");
    left_arrow_svg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>`;
    left_arrow_svg.id = "left_button";

    const right_arrow_svg = document.createElement("button");
    right_arrow_svg.style.transform = "rotate(180deg)";
    right_arrow_svg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>`;
    right_arrow_svg.id = "right_button";

    wrapper_carousel.appendChild(left_arrow_svg);
    wrapper_carousel.appendChild(products_wrapper);
    wrapper_carousel.appendChild(right_arrow_svg);
    body.appendChild(wrapper_carousel);
  };
  buildCSS = () => {
    const style = document.createElement("style");
    const head = document.head;
    head.appendChild(style);

    const containerCarouselClass = `

    body{
      margin:0;
      font-family: 'Open Sans', sans-serif !important;
      background-color: #faf9f7;
    }

    .carousel_style {
      display: flex;
      align-items:center;
      margin-inline:200px;
    }

    button{
      background:none;
      border:none;
      cursor:pointer;
      margin-inline:1rem;
    }

    .products_wrapper{
       flex-grow:1;
       overflow:hidden;
       padding:2rem;
    }

    #products{
      display:flex;
      gap:1rem;
      transition:transform .5s cubic-bezier(.645,.045,.355,1);
    }

    .title{
      line-height: 43px;
      font-size: 32px;
      color: #29323b;
      font-weight: lighter;
      padding: 1rem 0;
      margin: 0;
    }   

    .product_detail{
       background-color: white;
       position:relative;
       box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }
    .container{width:336px;}

    .container > .product_image{
      width: 100%;
    }

    .container .product_name{
       margin: 0 0 10px;
       color: #302e2b;
       cursor:pointer;
       display: -webkit-box;
       font-size: 1rem;
       margin-top: 0.5rem;

       overflow: hidden;
       text-overflow: ellipsis;
       -webkit-line-clamp: 2;
       -webkit-box-orient: vertical;
       white-space: initial;
       height: 40px;
    }

    .product_info{
     padding: 0 10px;
    }

    .product_price{
     color: #193db0;
     font-size: 18px;
     line-height: 22px;
     height:50px;
     display:block;
    }

    .product_like_button{
      position:absolute;
      top:1rem;
      right:0.5rem;
      margin-inline:0;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 3px 6px 0 rgba(0,0,0,.16);
      padding:0.25rem;
    }

    `;

    style.setAttribute("type", "text/css");

    if (style.styleSheet) {
      style.styleSheet.cssText = containerCarouselClass;
    } else {
      style.appendChild(document.createTextNode(containerCarouselClass));
    }
  };
  handleEvents = () => {};

  fetchProducts = async () => {
    try {
      const headers = new Headers();
      headers.append("Accept", "application/json");
      const response = await fetch(this.#GET_PRODUCTS_URL, {
        headers: headers,
      });
      if (!response.ok)
        throw new Error(`Response error status: ${response.status}`);
      const products = await response.json();
      this.#carouselProducts.products = products;
      this.#carouselProducts.render();
    } catch (err) {
      console.error(err);
    }
  };

  run = async () => {
    this.buildCSS();
    this.buildHTML();
    this.handleEvents();
    this.fetchProducts();
  };
}

const products = new Products();

products.run();
