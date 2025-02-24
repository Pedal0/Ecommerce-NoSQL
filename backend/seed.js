// backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for seeding'))
  .catch(err => console.log(err));

const User = require('./models/User');
const Product = require('./models/Product');

const seedUsers = async () => {
  await User.deleteMany({});
  const users = [];

  const adminUser = new User({
    username: "admin",
    email: "admin@gmail.com",
    password: "admin", 
    role: "admin" 
  });
  await adminUser.save();
  users.push(adminUser);

  const userStandard = new User({
    username: "utilisateur",
    email: "utilisateur@gmail.com",
    password: "utilisateur", 
    role: "client"
  });
  await userStandard.save();
  users.push(userStandard);

  // Création d'utilisateurs aléatoires
  for (let i = 0; i < 20; i++) {
    const user = new User({
      username: faker.internet.username(), 
      email: faker.internet.email(),
      password: 'password', 
      role: faker.helpers.arrayElement(['client', 'vendeur'])
    });
    await user.save();
    users.push(user);
  }
  console.log('Users seeded');
  return users;
};

const seedProducts = async (users) => {
  await Product.deleteMany({});
  for (let i = 0; i < 120; i++) {
    const product = new Product({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      quantity: faker.number.int({ min: 1, max: 100 }), 
      category: faker.commerce.department(),
      seller: faker.helpers.arrayElement(users)._id
    });
    await product.save();
  }
  console.log('Products seeded');
};

const seedDatabase = async () => {
  const users = await seedUsers();
  await seedProducts(users);
  mongoose.connection.close();
};

seedDatabase();
