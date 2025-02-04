// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for seeding'))
    .catch(err => console.log(err));


const User = require('./models/User.js'); // Assurez-vous que le chemin est correct
const Product = require('./models/Product'); // Idem

// Vous pouvez adapter le code suivant selon l'organisation de vos modèles.
// Ici nous utilisons des définitions similaires à celles du fichier server.js.

const seedUsers = async () => {
    await User.deleteMany({});
    const users = [];
    // Création de 20 utilisateurs aléatoires
    for (let i = 0; i < 20; i++) {
        const user = new User({
            username: faker.internet.username(),
            email: faker.internet.email(),
            password: 'password', // sera hashé lors de l'enregistrement
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
    // Création de 120 produits aléatoires
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
