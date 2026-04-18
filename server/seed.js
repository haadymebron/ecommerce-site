const mysql = require('mysql2/promise');
require('dotenv').config();

const demoProducts = [
  {
    name: "Engineering Mathematics (Used)",
    price: 395.00,
    description: "Like new condition. Perfect for Engineering courses. Minimal markups and notes.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    category: "Textbooks",
    stock: 8
  },
  {
    name: "Data Structures & Algorithms",
    price: 485.00,
    description: "Essential for CS/IT students. Good condition, clean pages, all chapters intact.",
    image: "https://images.unsplash.com/photo-1547519319-4cb517303540?auto=format&fit=crop&q=80&w=800",
    category: "Textbooks",
    stock: 6
  },
  {
    name: "Organic Chemistry Textbook",
    price: 425.00,
    description: "Perfect for Chemistry courses. Well-preserved with study notes.",
    image: "https://images.unsplash.com/photo-1564076595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800",
    category: "Textbooks",
    stock: 5
  },
  {
    name: "Physics: Mechanics & Thermodynamics",
    price: 450.00,
    description: "Excellent condition. Includes worked solutions for problems.",
    image: "https://images.unsplash.com/photo-1578926078328-123f5424cda2?auto=format&fit=crop&q=80&w=800",
    category: "Textbooks",
    stock: 7
  },
  {
    name: "Bluetooth Wireless Headphones",
    price: 2199.00,
    description: "Noise-cancelling with 20-hour battery. Perfect for studying and online classes.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
    category: "Electronics",
    stock: 12
  },
  {
    name: "Power Bank 20000mAh",
    price: 999.00,
    description: "Fast charging power bank. Keep your phone and laptop charged all day.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=800",
    category: "Electronics",
    stock: 20
  },
  {
    name: "USB-C Charging Cable (Pack of 2)",
    price: 249.00,
    description: "Durable and fast-charging cables. Compatible with most devices.",
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&q=80&w=800",
    category: "Electronics",
    stock: 35
  },
  {
    name: "Scientific Calculator Casio",
    price: 1599.00,
    description: "Advanced calculator required for Engineering and Science courses.",
    image: "https://images.unsplash.com/photo-1574607383077-47ddc2dc51c4?auto=format&fit=crop&q=80&w=800",
    category: "Electronics",
    stock: 10
  },
  {
    name: "Premium Notebook Set (Pack of 5)",
    price: 225.00,
    description: "High-quality college-ruled notebooks with good paper quality.",
    image: "https://images.unsplash.com/photo-1531346878377-a541e4ab04ce?auto=format&fit=crop&q=80&w=800",
    category: "Stationery",
    stock: 45
  },
  {
    name: "Gel Pen Set (Pack of 12)",
    price: 175.00,
    description: "Smooth writing pens in assorted colors. Best for notes and exams.",
    image: "https://images.unsplash.com/photo-1595521624124-e3c4a1795a1f?auto=format&fit=crop&q=80&w=800",
    category: "Stationery",
    stock: 60
  },
  {
    name: "Highlighter Kit (6 Colors)",
    price: 125.00,
    description: "Vibrant highlighters for effective note-taking and studying.",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&q=80&w=800",
    category: "Stationery",
    stock: 50
  },
  {
    name: "Desk Organizer Caddy",
    price: 350.00,
    description: "Keep your desk organized with this multi-compartment organizer.",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800",
    category: "Stationery",
    stock: 25
  },
  {
    name: "LED Desk Lamp with USB Charging",
    price: 749.00,
    description: "Adjustable brightness LED lamp with built-in USB port. Perfect for study sessions.",
    image: "https://images.unsplash.com/photo-1507646871324-4df33b0069dc?auto=format&fit=crop&q=80&w=800",
    category: "Dorm Essentials",
    stock: 18
  },
  {
    name: "Portable Laptop Stand",
    price: 999.00,
    description: "Ergonomic laptop stand to improve posture during online classes.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800",
    category: "Dorm Essentials",
    stock: 15
  },
  {
    name: "Desk Humidity Humidifier",
    price: 1499.00,
    description: "Compact humidifier for your dorm room. Anti-dry environment for your health.",
    image: "https://images.unsplash.com/photo-1598928506149-b339879b625a?auto=format&fit=crop&q=80&w=800",
    category: "Dorm Essentials",
    stock: 12
  },
  {
    name: "Microfiber Bedsheet Set",
    price: 749.00,
    description: "Soft and durable bedsheet set in multiple colors. Easy to wash and maintain.",
    image: "https://images.unsplash.com/photo-1559058615-cd4628902ad4?auto=format&fit=crop&q=80&w=800",
    category: "Dorm Essentials",
    stock: 22
  },
  {
    name: "Mix Nuts & Dry Fruits Kit",
    price: 485.00,
    description: "Healthy snack box with almonds, cashews, raisins for energy during studies.",
    image: "https://images.unsplash.com/photo-1585518419759-91fedd1284be?auto=format&fit=crop&q=80&w=800",
    category: "Snacks",
    stock: 30
  },
  {
    name: "Energy Bar Bundle (Pack of 12)",
    price: 359.00,
    description: "High protein energy bars for quick nutrition. Perfect for busy campus life.",
    image: "https://images.unsplash.com/photo-1590599810694-46ae982e26b2?auto=format&fit=crop&q=80&w=800",
    category: "Snacks",
    stock: 40
  },
  {
    name: "Instant Noodles Pack (24 Packs)",
    price: 289.00,
    description: "Quick and tasty noodles for late-night meals. Student favorite!",
    image: "https://images.unsplash.com/photo-1585521924905-5fcd42ec1265?auto=format&fit=crop&q=80&w=800",
    category: "Snacks",
    stock: 50
  },
  {
    name: "Coffee & Tea Combo Pack",
    price: 299.00,
    description: "Premium instant coffee and tea assortment. Essential for late-night study sessions.",
    image: "https://images.unsplash.com/photo-1514432324607-2e467f4af445?auto=format&fit=crop&q=80&w=800",
    category: "Snacks",
    stock: 35
  }
];

async function seedData() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce_db',
    });

    console.log('Connected to MySQL. Inserting demo products...');

    // Clear existing products to prevent duplicates if run multiple times
    await connection.execute('DELETE FROM Products');

    for (const product of demoProducts) {
      await connection.execute(
        'INSERT INTO Products (name, price, description, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)',
        [product.name, product.price, product.description, product.image, product.category, product.stock]
      );
    }

    console.log('Demo products inserted successfully!');
  } catch (error) {
    console.error('Failed to seed data:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit();
  }
}

seedData();
