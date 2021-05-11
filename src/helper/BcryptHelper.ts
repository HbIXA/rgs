import * as bcrypt from 'bcrypt';
import * as config from '../config.json';

/*
 * Криптовщик паролей
 */
export class BcryptHelper {
    /*
     * Сравнивание пароль с хешем
     */
    static compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }

    /*
     * Формирует хеш из пароля
     */
    static async hash(password: string): Promise<string> {
        return bcrypt.hash(password, bcrypt.genSaltSync(config.salt));
    }
}
