import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

type DietType = "VEG" | "NON_VEG" | "VEGAN";
type MealCat = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS" | "BEVERAGES" | "DESSERTS" | "SPECIALS";
type StallCat = "NORTH_INDIAN" | "SOUTH_INDIAN" | "CHINESE" | "CONTINENTAL" | "FAST_FOOD" | "BEVERAGES" | "SNACKS" | "DESSERTS" | "HEALTHY" | "MIXED";

interface ItemDef { name: string; price: number; diet: DietType; meal: MealCat; }
interface CatDef { name: string; items: ItemDef[]; }
interface StallDef { name: string; description: string; category: StallCat; location: string; openingTime: string; closingTime: string; categories: CatDef[]; }

const stallsData: StallDef[] = [
  { name: "Biryani House", description: "Biryani, Mandi, and non-veg starters. Block 34.", category: "MIXED", location: "Block 34 Food Court, LPU", openingTime: "11:00 AM", closingTime: "08:00 PM", categories: [
    { name: "Chicken Mandi", items: [
      { name: "BH Chicken Mandi Juicy", price: 259, diet: "NON_VEG", meal: "LUNCH" },
      { name: "BH Chicken Mandi Fry", price: 249, diet: "NON_VEG", meal: "LUNCH" },
    ]},
    { name: "Non-Veg Biryani", items: [
      { name: "BH Chicken Rice", price: 150, diet: "NON_VEG", meal: "LUNCH" },
      { name: "BH Dum Chicken Biryani", price: 169, diet: "NON_VEG", meal: "LUNCH" },
      { name: "BH Special Chicken Biryani", price: 199, diet: "NON_VEG", meal: "LUNCH" },
      { name: "BH Chicken 65 Biryani", price: 259, diet: "NON_VEG", meal: "LUNCH" },
    ]},
    { name: "Starters", items: [
      { name: "BH Chilli Chicken", price: 219, diet: "NON_VEG", meal: "SNACKS" },
      { name: "BH Chicken 65", price: 219, diet: "NON_VEG", meal: "SNACKS" },
      { name: "BH Dragon Chicken", price: 259, diet: "NON_VEG", meal: "SNACKS" },
    ]},
  ]},
  { name: "Block-34 Payal Chat", description: "Chaat, puri, bhalla papri, and street snacks.", category: "SNACKS", location: "Block 34, LPU", openingTime: "10:00 AM", closingTime: "07:00 PM", categories: [
    { name: "Chaat", items: [
      { name: "Chana Bhature 2pc", price: 60, diet: "VEG", meal: "SNACKS" },
      { name: "Chat Tikki", price: 60, diet: "VEG", meal: "SNACKS" },
      { name: "Bhalla Papri", price: 60, diet: "VEG", meal: "SNACKS" },
      { name: "Chana Samosa 2pc", price: 45, diet: "VEG", meal: "SNACKS" },
      { name: "Pani Puri 5pc", price: 20, diet: "VEG", meal: "SNACKS" },
      { name: "Lemon Soda", price: 30, diet: "VEG", meal: "BEVERAGES" },
    ]},
  ]},
  { name: "Tealogy Cafe", description: "Premium chai, coffee, cold beverages, subs, fries and snacks. Block 34.", category: "BEVERAGES", location: "Block 34, LPU", openingTime: "08:00 AM", closingTime: "09:00 PM", categories: [
    { name: "Hot Chai", items: [
      { name: "Irani Chai", price: 40, diet: "VEG", meal: "BEVERAGES" },
      { name: "Gud Wali Chai", price: 40, diet: "VEG", meal: "BEVERAGES" },
      { name: "Tealogy Special Chai", price: 45, diet: "VEG", meal: "BEVERAGES" },
      { name: "Green Tea", price: 30, diet: "VEG", meal: "BEVERAGES" },
    ]},
    { name: "Hot Coffee", items: [
      { name: "Simple Coffee", price: 40, diet: "VEG", meal: "BEVERAGES" },
      { name: "Cappuccino", price: 70, diet: "VEG", meal: "BEVERAGES" },
      { name: "Cafe Latte", price: 70, diet: "VEG", meal: "BEVERAGES" },
      { name: "Mocha", price: 80, diet: "VEG", meal: "BEVERAGES" },
      { name: "Hazelnut Coffee", price: 90, diet: "VEG", meal: "BEVERAGES" },
      { name: "Caramel Cappuccino", price: 100, diet: "VEG", meal: "BEVERAGES" },
    ]},
    { name: "Cold Beverages", items: [
      { name: "Classic Cold Coffee", price: 80, diet: "VEG", meal: "BEVERAGES" },
      { name: "Cold Coffee with Ice Cream", price: 90, diet: "VEG", meal: "BEVERAGES" },
      { name: "Caramel Frappe", price: 100, diet: "VEG", meal: "BEVERAGES" },
      { name: "Lemon Iced Tea", price: 50, diet: "VEG", meal: "BEVERAGES" },
      { name: "Chocolate Shake", price: 80, diet: "VEG", meal: "BEVERAGES" },
      { name: "Virgin Mojito", price: 70, diet: "VEG", meal: "BEVERAGES" },
      { name: "Watermelon Mojito", price: 80, diet: "VEG", meal: "BEVERAGES" },
    ]},
    { name: "Subs and Snacks", items: [
      { name: "Aloo Tikki Sub", price: 90, diet: "VEG", meal: "SNACKS" },
      { name: "Spicy Paneer Sub", price: 120, diet: "VEG", meal: "SNACKS" },
      { name: "French Fries", price: 80, diet: "VEG", meal: "SNACKS" },
      { name: "Peri Peri Fries", price: 90, diet: "VEG", meal: "SNACKS" },
      { name: "Loaded Fries", price: 130, diet: "VEG", meal: "SNACKS" },
      { name: "Spring Rolls", price: 80, diet: "VEG", meal: "SNACKS" },
      { name: "Hot Brownie with Ice Cream", price: 60, diet: "VEG", meal: "DESSERTS" },
    ]},
  ]},
  { name: "Gobinda Kitchen", description: "North Indian thalis, parathas, rice combos, pasta and shakes. Block 33.", category: "NORTH_INDIAN", location: "Block 33, LPU", openingTime: "07:30 AM", closingTime: "09:00 PM", categories: [
    { name: "Breakfast", items: [
      { name: "Chana Bathura", price: 75, diet: "VEG", meal: "BREAKFAST" },
      { name: "Aloo Prantha", price: 35, diet: "VEG", meal: "BREAKFAST" },
      { name: "Paneer Prantha", price: 50, diet: "VEG", meal: "BREAKFAST" },
      { name: "Poha", price: 40, diet: "VEG", meal: "BREAKFAST" },
      { name: "Samosa", price: 20, diet: "VEG", meal: "SNACKS" },
      { name: "Bread Pakora", price: 20, diet: "VEG", meal: "SNACKS" },
      { name: "Maggi", price: 30, diet: "VEG", meal: "SNACKS" },
      { name: "Veg Maggi", price: 50, diet: "VEG", meal: "SNACKS" },
    ]},
    { name: "Meals", items: [
      { name: "Normal Thali", price: 90, diet: "VEG", meal: "LUNCH" },
      { name: "Special Thali", price: 90, diet: "VEG", meal: "LUNCH" },
      { name: "Dal Rice", price: 75, diet: "VEG", meal: "LUNCH" },
      { name: "Rajma Rice", price: 75, diet: "VEG", meal: "LUNCH" },
      { name: "Paneer Rice", price: 90, diet: "VEG", meal: "LUNCH" },
      { name: "Pav Bhaji", price: 70, diet: "VEG", meal: "LUNCH" },
      { name: "White Sauce Pasta", price: 90, diet: "VEG", meal: "LUNCH" },
      { name: "Red Sauce Pasta", price: 90, diet: "VEG", meal: "LUNCH" },
    ]},
    { name: "Chinese", items: [
      { name: "Noodles", price: 70, diet: "VEG", meal: "LUNCH" },
      { name: "Manchurian", price: 80, diet: "VEG", meal: "LUNCH" },
      { name: "Fried Rice", price: 80, diet: "VEG", meal: "LUNCH" },
    ]},
    { name: "Beverages", items: [
      { name: "Tea", price: 15, diet: "VEG", meal: "BEVERAGES" },
      { name: "Coffee", price: 30, diet: "VEG", meal: "BEVERAGES" },
      { name: "Lassi", price: 40, diet: "VEG", meal: "BEVERAGES" },
      { name: "Shakes", price: 60, diet: "VEG", meal: "BEVERAGES" },
    ]},
  ]},
  { name: "Chennai Express", description: "South Indian dosas, idli, vada and punugulu.", category: "SOUTH_INDIAN", location: "LPU Campus", openingTime: "08:00 AM", closingTime: "04:00 PM", categories: [
    { name: "South Indian", items: [
      { name: "Punugulu", price: 60, diet: "VEG", meal: "SNACKS" },
      { name: "Masala Dosa", price: 60, diet: "VEG", meal: "BREAKFAST" },
      { name: "Plain Dosa", price: 50, diet: "VEG", meal: "BREAKFAST" },
      { name: "Idli", price: 50, diet: "VEG", meal: "BREAKFAST" },
      { name: "Vada", price: 20, diet: "VEG", meal: "SNACKS" },
      { name: "Onion Dosa", price: 70, diet: "VEG", meal: "BREAKFAST" },
      { name: "Ghee Dosa", price: 60, diet: "VEG", meal: "BREAKFAST" },
      { name: "Podi Dosa", price: 70, diet: "VEG", meal: "BREAKFAST" },
    ]},
  ]},
  { name: "Chaap Express", description: "Soya chaap, tikka, paneer gravies, rolls, kulcha and naan.", category: "NORTH_INDIAN", location: "LPU Campus", openingTime: "11:00 AM", closingTime: "09:00 PM", categories: [
    { name: "Soya Tandoori", items: [
      { name: "Malai Chaap", price: 89, diet: "VEG", meal: "SNACKS" },
      { name: "Punjabi Chaap", price: 89, diet: "VEG", meal: "SNACKS" },
      { name: "Afghani Chaap", price: 89, diet: "VEG", meal: "SNACKS" },
      { name: "Stuffed Chaap", price: 99, diet: "VEG", meal: "SNACKS" },
      { name: "Seekh Kebab", price: 89, diet: "VEG", meal: "SNACKS" },
      { name: "Achari Chaap", price: 99, diet: "VEG", meal: "SNACKS" },
    ]},
    { name: "Tikka", items: [
      { name: "Paneer Tikka", price: 99, diet: "VEG", meal: "SNACKS" },
      { name: "Mushroom Tikka", price: 99, diet: "VEG", meal: "SNACKS" },
    ]},
    { name: "Rolls", items: [
      { name: "Malai Chaap Roll", price: 80, diet: "VEG", meal: "SNACKS" },
      { name: "Afghani Chaap Roll", price: 80, diet: "VEG", meal: "SNACKS" },
      { name: "Stuffed Chaap Roll", price: 90, diet: "VEG", meal: "SNACKS" },
    ]},
    { name: "Kulcha Naan", items: [
      { name: "Aloo Kulcha", price: 70, diet: "VEG", meal: "LUNCH" },
      { name: "Paneer Kulcha", price: 110, diet: "VEG", meal: "LUNCH" },
      { name: "Butter Naan", price: 30, diet: "VEG", meal: "LUNCH" },
      { name: "Garlic Naan", price: 50, diet: "VEG", meal: "LUNCH" },
      { name: "Paneer Naan", price: 60, diet: "VEG", meal: "LUNCH" },
    ]},
    { name: "Gravies", items: [
      { name: "Shahi Paneer", price: 120, diet: "VEG", meal: "LUNCH" },
      { name: "Paneer Lababdar", price: 120, diet: "VEG", meal: "LUNCH" },
      { name: "Paneer Tikka Butter Masala", price: 130, diet: "VEG", meal: "LUNCH" },
    ]},
  ]},
  { name: "WowMomo", description: "Steamed, fried, panfried, kurkure momos, bowls and desserts.", category: "CHINESE", location: "LPU Campus", openingTime: "11:00 AM", closingTime: "08:30 PM", categories: [
    { name: "Momos", items: [
      { name: "Veg Pahari Momo Steamed", price: 60, diet: "VEG", meal: "SNACKS" },
      { name: "Veg Darjeeling Momo Steamed", price: 100, diet: "VEG", meal: "SNACKS" },
      { name: "Corn Cheese Momo", price: 130, diet: "VEG", meal: "SNACKS" },
      { name: "Fried Momo", price: 140, diet: "VEG", meal: "SNACKS" },
      { name: "Panfried Momo", price: 150, diet: "VEG", meal: "SNACKS" },
      { name: "Hot Garlic Kurkure Momo", price: 130, diet: "VEG", meal: "SNACKS" },
      { name: "Paneer Masala Kurkure Momo", price: 150, diet: "VEG", meal: "SNACKS" },
    ]},
    { name: "Burgers Bowls", items: [
      { name: "Veggie Moburg", price: 90, diet: "VEG", meal: "SNACKS" },
      { name: "Cheesy Veggie Moburg", price: 120, diet: "VEG", meal: "SNACKS" },
      { name: "Chilli Garlic Rice Manchurian Bowl", price: 170, diet: "VEG", meal: "LUNCH" },
      { name: "Fried Rice Chilli Paneer Bowl", price: 180, diet: "VEG", meal: "LUNCH" },
    ]},
    { name: "Starters", items: [
      { name: "Honey Chilli Potato", price: 240, diet: "VEG", meal: "SNACKS" },
      { name: "Chilli Paneer Dry", price: 290, diet: "VEG", meal: "SNACKS" },
      { name: "Gobi Manchurian", price: 240, diet: "VEG", meal: "SNACKS" },
    ]},
    { name: "Desserts", items: [
      { name: "Chocolate Momo", price: 60, diet: "VEG", meal: "DESSERTS" },
      { name: "Gulab Jamun", price: 40, diet: "VEG", meal: "DESSERTS" },
      { name: "Rasmalai", price: 60, diet: "VEG", meal: "DESSERTS" },
    ]},
  ]},
  { name: "Protein House", description: "Healthy protein-rich sandwiches, wraps, salads and shakes.", category: "HEALTHY", location: "LPU Campus", openingTime: "08:00 AM", closingTime: "08:00 PM", categories: [
    { name: "Sandwiches Wraps", items: [
      { name: "Paneer Sandwich", price: 60, diet: "VEG", meal: "SNACKS" },
      { name: "Peanut Butter Sandwich", price: 60, diet: "VEG", meal: "SNACKS" },
      { name: "Vegan Sandwich", price: 60, diet: "VEGAN", meal: "SNACKS" },
      { name: "Paneer Wrap", price: 80, diet: "VEG", meal: "SNACKS" },
      { name: "Corn Wrap", price: 70, diet: "VEG", meal: "SNACKS" },
    ]},
    { name: "Salads Steam", items: [
      { name: "Mexican Salad", price: 100, diet: "VEG", meal: "LUNCH" },
      { name: "Protein Rich Salad", price: 120, diet: "VEG", meal: "LUNCH" },
      { name: "Sprouts Salad", price: 80, diet: "VEG", meal: "LUNCH" },
      { name: "Steam Corn", price: 90, diet: "VEG", meal: "SNACKS" },
      { name: "Grill Paneer", price: 50, diet: "VEG", meal: "SNACKS" },
    ]},
    { name: "Shakes", items: [
      { name: "Banana Krusher", price: 50, diet: "VEG", meal: "BEVERAGES" },
      { name: "Protein Shake", price: 75, diet: "VEG", meal: "BEVERAGES" },
      { name: "Protein Shake with Dry Fruit", price: 95, diet: "VEG", meal: "BEVERAGES" },
    ]},
  ]},
  { name: "Cafe Coffee Day", description: "Premium CCD coffee, teas, desserts, sundaes and snacks.", category: "BEVERAGES", location: "LPU Campus", openingTime: "08:00 AM", closingTime: "09:00 PM", categories: [
    { name: "Hot Coffees", items: [
      { name: "Cappuccino", price: 195, diet: "VEG", meal: "BEVERAGES" },
      { name: "Cafe Latte", price: 210, diet: "VEG", meal: "BEVERAGES" },
      { name: "Espresso", price: 162, diet: "VEG", meal: "BEVERAGES" },
      { name: "Cafe Mocha", price: 229, diet: "VEG", meal: "BEVERAGES" },
      { name: "Hot Chocolate", price: 229, diet: "VEG", meal: "BEVERAGES" },
    ]},
    { name: "Iced Coffee", items: [
      { name: "Iced Cappuccino", price: 238, diet: "VEG", meal: "BEVERAGES" },
      { name: "Iced Latte", price: 238, diet: "VEG", meal: "BEVERAGES" },
      { name: "Iced Mocha", price: 248, diet: "VEG", meal: "BEVERAGES" },
    ]},
    { name: "Desserts Ice Cream", items: [
      { name: "New York Cheesecake", price: 267, diet: "VEG", meal: "DESSERTS" },
      { name: "Hazelnut Brownie", price: 190, diet: "VEG", meal: "DESSERTS" },
      { name: "Vanilla Ice Cream", price: 120, diet: "VEG", meal: "DESSERTS" },
      { name: "Chocolate Ice Cream", price: 120, diet: "VEG", meal: "DESSERTS" },
      { name: "Brownie Sundae", price: 295, diet: "VEG", meal: "DESSERTS" },
    ]},
  ]},
  { name: "Bengali Bawarchi", description: "Rolls, rice bowls, biryani, thalis and jalebi.", category: "NORTH_INDIAN", location: "LPU Campus", openingTime: "10:00 AM", closingTime: "08:00 PM", categories: [
    { name: "Rolls Bowls", items: [
      { name: "Dal Puri", price: 60, diet: "VEG", meal: "SNACKS" },
      { name: "Veg Roll", price: 60, diet: "VEG", meal: "SNACKS" },
      { name: "Paneer Roll", price: 70, diet: "VEG", meal: "SNACKS" },
      { name: "Malai Chap Roll", price: 70, diet: "VEG", meal: "SNACKS" },
      { name: "Paneer Rice Bowl", price: 80, diet: "VEG", meal: "LUNCH" },
    ]},
    { name: "Meals", items: [
      { name: "Dal Rice", price: 50, diet: "VEG", meal: "LUNCH" },
      { name: "Rajma Rice", price: 60, diet: "VEG", meal: "LUNCH" },
      { name: "Normal Thali", price: 80, diet: "VEG", meal: "LUNCH" },
      { name: "Special Thali", price: 100, diet: "VEG", meal: "LUNCH" },
      { name: "Veg Biryani", price: 80, diet: "VEG", meal: "LUNCH" },
      { name: "Jalebi", price: 30, diet: "VEG", meal: "DESSERTS" },
    ]},
  ]},
  { name: "Suto", description: "Waffles, brownies, burgers, pizza, pasta, maggi and mocktails.", category: "FAST_FOOD", location: "LPU Campus", openingTime: "09:00 AM", closingTime: "09:00 PM", categories: [
    { name: "Desserts", items: [
      { name: "Classic Waffle", price: 89, diet: "VEG", meal: "DESSERTS" },
      { name: "Nutella Waffle", price: 129, diet: "VEG", meal: "DESSERTS" },
      { name: "Brownie", price: 89, diet: "VEG", meal: "DESSERTS" },
      { name: "Sizzler Brownie", price: 109, diet: "VEG", meal: "DESSERTS" },
    ]},
    { name: "Burgers Sandwiches", items: [
      { name: "Aloo Tikki Burger", price: 69, diet: "VEG", meal: "SNACKS" },
      { name: "Spicy Paneer Burger", price: 119, diet: "VEG", meal: "SNACKS" },
      { name: "Masala Toast Sandwich", price: 79, diet: "VEG", meal: "SNACKS" },
      { name: "Paneer Tikka Sandwich", price: 119, diet: "VEG", meal: "SNACKS" },
    ]},
    { name: "Pizza", items: [
      { name: "Margherita Pizza", price: 89, diet: "VEG", meal: "SNACKS" },
      { name: "Cheese Corn Pizza", price: 99, diet: "VEG", meal: "SNACKS" },
      { name: "Paneer Pizza", price: 149, diet: "VEG", meal: "SNACKS" },
    ]},
    { name: "Maggi Meals", items: [
      { name: "Classic Maggi", price: 59, diet: "VEG", meal: "SNACKS" },
      { name: "Cheese Corn Maggi", price: 99, diet: "VEG", meal: "SNACKS" },
      { name: "Pav Bhaji", price: 89, diet: "VEG", meal: "LUNCH" },
    ]},
    { name: "Fries Drinks", items: [
      { name: "French Fries", price: 89, diet: "VEG", meal: "SNACKS" },
      { name: "Peri Peri Fries", price: 99, diet: "VEG", meal: "SNACKS" },
      { name: "Mint Mojito", price: 99, diet: "VEG", meal: "BEVERAGES" },
      { name: "Lemon Ice Tea", price: 89, diet: "VEG", meal: "BEVERAGES" },
    ]},
  ]},
  { name: "180 Cafe", description: "Premium pizzas, burgers, pasta, coffee, shakes and desserts.", category: "CONTINENTAL", location: "LPU Campus", openingTime: "09:00 AM", closingTime: "10:00 PM", categories: [
    { name: "Pizza", items: [
      { name: "Margherita", price: 199, diet: "VEG", meal: "LUNCH" },
      { name: "Farmhouse", price: 219, diet: "VEG", meal: "LUNCH" },
      { name: "Veggie Paneer", price: 249, diet: "VEG", meal: "LUNCH" },
      { name: "Signature", price: 299, diet: "VEG", meal: "LUNCH" },
    ]},
    { name: "Burgers Fries", items: [
      { name: "Classic Burger", price: 89, diet: "VEG", meal: "SNACKS" },
      { name: "Crispy Paneer Burger", price: 139, diet: "VEG", meal: "SNACKS" },
      { name: "Salted Fries", price: 109, diet: "VEG", meal: "SNACKS" },
      { name: "Cheese Fries", price: 159, diet: "VEG", meal: "SNACKS" },
    ]},
    { name: "Pasta", items: [
      { name: "Alfredo Pasta", price: 139, diet: "VEG", meal: "LUNCH" },
      { name: "Pink Pasta", price: 139, diet: "VEG", meal: "LUNCH" },
    ]},
    { name: "Coffees", items: [
      { name: "Cappuccino", price: 129, diet: "VEG", meal: "BEVERAGES" },
      { name: "Cafe Latte", price: 149, diet: "VEG", meal: "BEVERAGES" },
      { name: "Iced Americano", price: 129, diet: "VEG", meal: "BEVERAGES" },
      { name: "Matcha Latte", price: 169, diet: "VEG", meal: "BEVERAGES" },
      { name: "Kadak Chai", price: 99, diet: "VEG", meal: "BEVERAGES" },
    ]},
    { name: "Shakes Mocktails", items: [
      { name: "Vanilla Shake", price: 169, diet: "VEG", meal: "BEVERAGES" },
      { name: "Oreo Shake", price: 189, diet: "VEG", meal: "BEVERAGES" },
      { name: "Mint Lemonade", price: 119, diet: "VEG", meal: "BEVERAGES" },
    ]},
    { name: "Desserts", items: [
      { name: "Pan Cakes", price: 135, diet: "VEG", meal: "DESSERTS" },
      { name: "Chocolate Brownie", price: 89, diet: "VEG", meal: "DESSERTS" },
      { name: "Sizzling Brownie", price: 149, diet: "VEG", meal: "DESSERTS" },
      { name: "Vanilla Ice Cream", price: 70, diet: "VEG", meal: "DESSERTS" },
    ]},
  ]},
  { name: "Moms Kitchen", description: "Wholesome Indian thalis, rice combos, roti combos and parathas.", category: "NORTH_INDIAN", location: "LPU Campus", openingTime: "09:00 AM", closingTime: "08:00 PM", categories: [
    { name: "Thalis", items: [
      { name: "Simple Thali", price: 99, diet: "VEG", meal: "LUNCH" },
      { name: "Premium Thali", price: 129, diet: "VEG", meal: "LUNCH" },
    ]},
    { name: "Combos", items: [
      { name: "Mix Veg Roti Combo", price: 59, diet: "VEG", meal: "LUNCH" },
      { name: "Dal Makhani Roti Combo", price: 79, diet: "VEG", meal: "LUNCH" },
      { name: "Veg Biryani", price: 89, diet: "VEG", meal: "LUNCH" },
      { name: "Paneer Rice", price: 79, diet: "VEG", meal: "LUNCH" },
    ]},
    { name: "Parathas", items: [
      { name: "Aloo Paratha", price: 35, diet: "VEG", meal: "BREAKFAST" },
      { name: "Paneer Paratha", price: 50, diet: "VEG", meal: "BREAKFAST" },
      { name: "Aloo Paratha Combo with Curd", price: 55, diet: "VEG", meal: "BREAKFAST" },
    ]},
    { name: "Main Course", items: [
      { name: "Kadai Paneer", price: 149, diet: "VEG", meal: "LUNCH" },
      { name: "Paneer Butter Masala", price: 149, diet: "VEG", meal: "LUNCH" },
      { name: "Dal Makhani", price: 90, diet: "VEG", meal: "LUNCH" },
    ]},
  ]},
  { name: "Northern Delights", description: "Litti Chokha and North Indian street food specialties.", category: "NORTH_INDIAN", location: "LPU Campus", openingTime: "09:00 AM", closingTime: "07:00 PM", categories: [
    { name: "Specialties", items: [
      { name: "Litti Chokha Special", price: 60, diet: "VEG", meal: "SNACKS" },
      { name: "Litti Chokha", price: 40, diet: "VEG", meal: "SNACKS" },
      { name: "Poori Sabji", price: 60, diet: "VEG", meal: "BREAKFAST" },
      { name: "Khasta Matar", price: 50, diet: "VEG", meal: "SNACKS" },
    ]},
  ]},
  { name: "Kathi Rolls", description: "Paneer, mushroom, chaap and sweet corn kathi rolls.", category: "NORTH_INDIAN", location: "LPU Campus", openingTime: "11:00 AM", closingTime: "08:30 PM", categories: [
    { name: "Rolls", items: [
      { name: "Malai Mix Veg Roll", price: 50, diet: "VEG", meal: "SNACKS" },
      { name: "Malai Aloo Roll", price: 50, diet: "VEG", meal: "SNACKS" },
      { name: "Malai Sweet Corn Roll", price: 70, diet: "VEG", meal: "SNACKS" },
      { name: "Garlic Malai Paneer Roll", price: 90, diet: "VEG", meal: "SNACKS" },
      { name: "Korma Malai Paneer Roll", price: 90, diet: "VEG", meal: "SNACKS" },
      { name: "Soya Malai Chaap Roll", price: 90, diet: "VEG", meal: "SNACKS" },
      { name: "Korma Mushroom Roll", price: 90, diet: "VEG", meal: "SNACKS" },
    ]},
  ]},
];

async function main() {
  console.log("Seeding LPU SmartFood database...");

  const adminPassword = await argon2.hash("admin123");
  await prisma.admin.upsert({
    where: { email: "admin@smartfood.local" },
    update: {},
    create: { name: "SmartFood Admin", email: "admin@smartfood.local", passwordHash: adminPassword, isSuperAdmin: true, permissions: ["ALL"] },
  });

  const vendorPassword = await argon2.hash("vendor123");
  const vendor = await prisma.vendor.upsert({
    where: { email: "lpu@smartfood.local" },
    update: {},
    create: { name: "LPU Campus Vendor", email: "lpu@smartfood.local", passwordHash: vendorPassword, businessName: "LPU Campus Cafeteria", status: "ACTIVE", approvedAt: new Date() },
  });

  await prisma.menuItemEmbedding.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.menuCategory.deleteMany({});
  await prisma.foodStall.deleteMany({});
  console.log("[+] Cleared old data");

  for (const stallData of stallsData) {
    const stall = await prisma.foodStall.create({
      data: { vendorId: vendor.id, name: stallData.name, description: stallData.description, category: stallData.category, location: stallData.location, openingTime: stallData.openingTime, closingTime: stallData.closingTime, status: "OPEN", isVerified: true },
    });
    let count = 0;
    for (const catData of stallData.categories) {
      const category = await prisma.menuCategory.create({ data: { stallId: stall.id, name: catData.name } });
      for (const item of catData.items) {
        await prisma.menuItem.create({ data: { stallId: stall.id, categoryId: category.id, name: item.name, price: item.price, dietaryType: item.diet, mealCategory: item.meal, status: "AVAILABLE", popularityScore: 8.5 } });
        count++;
      }
    }
    console.log(`[+] ${stall.name} -- ${count} items`);
  }
  console.log("Done! All LPU stalls seeded.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
