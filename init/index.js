const mongoose = require("mongoose");
require("dotenv").config();
const { Schema } = require("mongoose");
const initDB = require("./data");
const Listing = require("../model/listing");
const Reviews = require("../model/review");
const MONGO_LINK = "mongodb://127.0.0.1:27017/foodorbit";
const dbUrl =
  "mongodb+srv://mhdpope:2ohfoCjvY7RkwFTG@cluster0.v1vzqkj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// console.log(dbUrl);
const dbName = "FoodOrbit";
async function main() {
  try {
    await mongoose.connect(dbUrl, {
      dbName: dbName,
    });
    console.log("Connected to MongoDB");
    await seedListings();
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } finally {
    mongoose.connection.close();
  }
}

const filterEnum = ["meal", "drinks", "desert"];

const data = [
  {
    name: "Chiken peri peri",
    description: "Spice Crazy good chicken wings",
    image:
      "https://www.allrecipes.com/thmb/0SFDFGQUAAiJPbx5kDq7bSsiFuE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/7507145PeriPeriChickenChefJohn4x3-6eed97091b5e485592fac34fcb77d501.jpg",
    price: 300,
    type: "meal",
  },
  {
    name: "Margherita Pizza",
    description:
      "Classic Italian pizza topped with tomato, mozzarella, and basil",
    image:
      "https://static.toiimg.com/thumb/56868564.cms?imgsize=1948751&width=800&height=800",
    price: 250,
    type: "meal",
  },
  {
    name: "Beef Burger",
    description:
      "Juicy beef patty served in a sesame seed bun with lettuce, tomato, and cheese",
    image:
      "https://images.immediate.co.uk/production/volatile/sites/2/2015/04/5047.jpg?quality=90&resize=700,466",
    price: 350,
    type: "meal",
  },
  {
    name: "Sushi Platter",
    description: "Assorted sushi rolls served with pickled ginger and wasabi",
    image:
      "https://tasteofseoul.ca/cdn/shop/files/platter6_34589017-ac44-405d-8cfe-c29122819f15.jpg?v=1683318558",
    price: 400,
    type: "meal",
  },
  {
    name: "Chocolate Brownie",
    description:
      "Decadent chocolate brownie served warm with a scoop of vanilla ice cream",
    image:
      "https://www.thereciperebel.com/wp-content/uploads/2022/05/brownie-sundae-TRR-1200-25-of-40.jpg",
    price: 150,
    type: "desert",
  },
  {
    name: "Tacos al Pastor",
    description:
      "Traditional Mexican tacos with marinated pork, pineapple, and cilantro",
    image:
      "https://www.seriouseats.com/thmb/4kbwN13BlZnZ3EywrtG2AzCKuYs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20210712-tacos-al-pastor-melissa-hom-seriouseats-37-f72cdd02c9574bceb1eef1c8a23b76ed.jpg",
    price: 280,
    type: "meal",
  },
  {
    name: "Grilled Salmon",
    description:
      "Freshly grilled salmon fillet served with lemon and dill sauce",
    image:
      "https://www.thecookierookie.com/wp-content/uploads/2023/05/featured-grilled-salmon-recipe.jpg",
    price: 380,
    type: "meal",
  },
  {
    name: "Vegetable Stir-fry",
    description:
      "Colorful assortment of vegetables stir-fried in a savory sauce",
    image:
      "https://www.budgetbytes.com/wp-content/uploads/2022/03/Easy-Vegetable-Stir-Fry-V1.jpg",
    price: 220,
    type: "meal",
  },
  {
    name: "BBQ Ribs",
    description: "Tender pork ribs slow-cooked and glazed with barbecue sauce",
    image:
      "https://www.oliveandmango.com/images/uploads/2020_05_24_easy_no_fail_bbq_ribs_2.jpg",
    price: 420,
    type: "meal",
  },
  {
    name: "Pad Thai",
    description:
      "Thai stir-fried noodles with shrimp, tofu, peanuts, and bean sprouts",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRRHHX19o2f723xAVdTLKlM0lNzPnkUUu2AmcOZZT6Kg&s",
    price: 320,
    type: "meal",
  },
  {
    name: "Caprese Salad",
    description:
      "Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze",
    image:
      "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2019/07/Caprese-Salad-main-1.jpg",
    price: 200,
    type: "meal",
  },
  {
    name: "Chicken Tikka Masala",
    description:
      "Creamy tomato-based curry with grilled chicken, served with rice",
    image:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/06/chicken-tikka-masala.jpg",
    price: 380,
    type: "meal",
  },
  {
    name: "Greek Gyro",
    description:
      "Grilled lamb or chicken wrapped in pita bread with tzatziki sauce and vegetables",
    image:
      "https://www.recipetineats.com/wp-content/uploads/2015/06/Greek-Chicken-Gyros_original-pics__8.jpg",
    price: 300,
    type: "meal",
  },
  // Drinks
  {
    name: "Coke",
    description: "Refreshing carbonated cola drink",
    image:
      "https://spicecravings.com/wp-content/uploads/2022/06/Masala-Coke-1.jpg",
    price: 50,
    type: "drinks",
  },
  {
    name: "Fanta",
    description: "Fruity carbonated orange drink",
    image: "https://www.kroger.com/product/images/large/top/0007800011340",
    price: 50,
    type: "drinks",
  },
  {
    name: "Iced Coffee",
    description: "Chilled coffee served over ice with milk and sugar",
    image:
      "https://www.allrecipes.com/thmb/Hqro0FNdnDEwDjrEoxhMfKdWfOY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/21667-easy-iced-coffee-ddmfs-4x3-0093-7becf3932bd64ed7b594d46c02d0889f.jpg",
    price: 180,
    type: "drinks",
  },
  {
    name: "Fresh Orange Juice",
    description: "100% pure squeezed orange juice, no additives",
    image:
      "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/orange-juice-1296x728-feature.jpg?w=1155&h=1528",
    price: 120,
    type: "drinks",
  },

  // More Drinks
  {
    name: "Classic Mojito",
    description:
      "Classic cocktail with white rum, lime juice, mint leaves, sugar, and soda water",
    image: "https://cookieandkate.com/images/2020/08/best-mojito-recipe-2.jpg",
    price: 200,
    type: "drinks",
  },
  {
    name: "Mango Lassi",
    description:
      "Traditional Indian drink made with yogurt, mango pulp, sugar, and cardamom",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD22Edsq-tc4vWpXOeVYCBPP-JvlBy2xUkcMnjUfo_gA&s",
    price: 160,
    type: "drinks",
  },
  {
    name: "Green Tea",
    description: "Japanese green tea served hot or cold",
    image: "https://static.toiimg.com/photo/78092190.cms",
    price: 100,
    type: "drinks",
  },
  // Other Items
  {
    name: "Cheese Platter",
    description: "Assorted cheeses served with crackers and fruits",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSznm_K5PKIpOfpoqWdSOKaY9esPEIyvGWS0aFnFWwkzQ&s",
    price: 300,
    type: "meal",
  },
  {
    name: "Vegetarian Lasagna",
    description: "Layered pasta with marinara sauce, vegetables, and cheese",
    image:
      "https://cdn.loveandlemons.com/wp-content/uploads/2023/12/vegetarian-lasagna-scaled.jpg",
    price: 280,
    type: "meal",
  },
  {
    name: "Apple Pie",
    description:
      "Classic apple pie with a flaky crust and cinnamon-spiced filling",
    image:
      "https://www.vegrecipesofindia.com/wp-content/uploads/2020/12/apple-pie-2.jpg",
    price: 200,
    type: "desert",
  },
  {
    name: "Chocolate Cake",
    description:
      "Rich and moist chocolate cake with layers of chocolate ganache",
    image:
      "https://sugargeekshow.com/wp-content/uploads/2023/10/easy_chocolate_cake_slice.jpg",
    price: 250,
    type: "desert",
  },
  {
    name: "Cheesecake",
    description: "Creamy New York-style cheesecake with a graham cracker crust",
    image:
      "https://www.allrecipes.com/thmb/EVKWdCURB5FPAGOW9sQIm76U9Zs=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/8419-easy-sour-cream-cheesecake-DDMFS-beauty-4x3-BG-2747-44b427d330aa41aa876269b1249698a0.jpg",
    price: 220,
    type: "desert",
  },
  {
    name: "Tiramisu",
    description:
      "Classic Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cheese",
    image:
      "https://handletheheat.com/wp-content/uploads/2023/12/best-tiramisu-recipe-SQUARE.jpg",
    price: 230,
    type: "desert",
  },
  {
    name: "Fruit Tart",
    description:
      "Buttery tart crust filled with pastry cream and topped with fresh seasonal fruits",
    image:
      "https://sugargeekshow.com/wp-content/uploads/2020/06/fruit_tart_featured.jpg",
    price: 180,
    type: "desert",
  },

  {
    name: "Oreo Shake",
    description: "Creamy milkshake blended with Oreo cookies",
    image:
      "https://www.whiskaffair.com/wp-content/uploads/2020/07/Oreo-Milkshake-2-3.jpg",
    price: 120,
    type: "drinks",
  },

  {
    name: "Fruit Smoothie",
    description: "Refreshing smoothie made with assorted fresh fruits",
    image:
      "https://cookingformysoul.com/wp-content/uploads/2022/05/triple-berry-smoothie-feat-min-500x500.jpg",
    price: 100,
    type: "drinks",
  },
  {
    name: "Mint Mojito",
    description:
      "Refreshing cocktail with white rum, lime juice, mint leaves, sugar, and soda water",
    image:
      "https://cdn.loveandlemons.com/wp-content/uploads/2020/07/mojito.jpg",
    price: 220,
    type: "drinks",
  },
  {
    name: "Macarons",
    description:
      "Colorful French cookies with a delicate almond meringue shell and creamy filling",
    image:
      "https://www.southernliving.com/thmb/dnsycw_-mf35yKRkq3cBsThVzrY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Southern-Living_Macarons_025-0e05e0cd226d44609f55ed8bc9cd3a3e.jpg",
    price: 200,
    type: "desert",
  },
  {
    name: "Panna Cotta",
    description:
      "Silky Italian dessert made with cream and gelatin, topped with a fruity coulis",
    image:
      "https://www.anasbakingchronicles.com/wp-content/uploads/2022/04/Coconut-Panna-Cotta-featured-image.jpg",
    price: 300,
    type: "desert",
  },
  // Add more items as needed
];

async function seedListings() {
  try {
    await Listing.deleteMany({}); // Clear existing data
    await Listing.insertMany(data); // Insert new data
    console.log("Listings seeded successfully");
  } catch (err) {
    console.error("Error seeding listings:", err);
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
}

main();
