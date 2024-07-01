import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const env = process.env;
const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST } = env;

export const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
});

export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Veritabanına başarıyla bağlanıldı.');

        await sequelize.sync({ alter: true }); 
        console.log('Veritabanı senkronize edildi.');

    } catch (error) {
        console.error('Veritabanına bağlanırken bir hata oluştu:', error);
    }
};

export default sequelize;