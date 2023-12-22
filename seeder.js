import mongoose from 'mongoose';

import connectDB from './config/db.js';
import User from './model/User.js'
import Category from './model/Category.js'

import users from './data/User.js';
import categories from './data/Category.js';
import Estate from './model/Estate.js';
import estates from './data/Estate.js';
import Chat from './model/Chat.js';
import chats from './data/Chat.js';

connectDB();

export const importData = async () => {
    try {
        // await User.deleteMany();

        // await User.insertMany(users);
        // await Category.insertMany(categories);
        // await Estate.insertMany(estates);
        await Chat.insertMany(chats);


        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        // await Order.deleteMany();
        // await Product.deleteMany();
        // await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
