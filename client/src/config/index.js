export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "handcrafted", label: "Handcrafted" },
      { id: "block", label: "Palm Jaggery" },
      { id: "kalkandu", label: "Palm Kalkandu" },
      { id: "powder", label: "Powder" },
      { id: "syrup", label: "Syrup" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "marry-matha", label: "Marry Matha" },
      { id: "organic", label: "Organic" },
      { id: "traditional", label: "Traditional" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

// ✨ UPDATED: Navigation menu (Home, Products, About Us, Contact, Search)
export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "about",
    label: "About Us",
    path: "/shop/about",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/shop/contact",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  handcrafted: "Handcrafted",
  block: "Palm Jaggery",
  kalkandu: "Palm Kalkandu",
  powder: "Powder",
  syrup: "Syrup",
};

export const brandOptionsMap = {
  "marry-matha": "Marry Matha",
  organic: "Organic",
  traditional: "Traditional",
};

export const filterOptions = {
  category: [
    { id: "handcrafted", label: "Handcrafted" },
    { id: "block", label: "Palm Jaggery" },
    { id: "kalkandu", label: "Palm Kalkandu" },
    { id: "powder", label: "Powder" },
    { id: "syrup", label: "Syrup" },
  ],
  brand: [
    { id: "marry-matha", label: "Marry Matha" },
    { id: "organic", label: "Organic" },
    { id: "traditional", label: "Traditional" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
