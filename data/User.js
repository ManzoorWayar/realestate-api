import bcrypt from 'bcryptjs';

const users = [
    {
        firstName: 'Admin User',
        lastName: 'Kar',
        email: 'admin@email.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        firstName: 'Admin User',
        lastName: 'Kar',
        email: 'john@email.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        firstName: 'Admin User',
        lastName: 'Kar',
        email: 'jane@email.com',
        password: bcrypt.hashSync('123456', 10),
    },
];

export default users;
