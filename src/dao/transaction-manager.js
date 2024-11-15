

const dbUtils = require('../dao/db-utils');

class TransactionManager {

    async startTransaction() {
        await this.openConnection();
    }

    async openConnection() {
        this._connection = await dbUtils.getConnection();
    }

    async commitTransaction() {
        try {
            await this._connection.commit();
        }
        finally {
            await this.closeConnection()
        }
    }

    async rollbackTransaction() {
        try {
            await this._connection.rollback();
        }
        finally {
            await this.closeConnection()
        }
    }

    async closeConnection() {
        try {
            await dbUtils.closeConnection(this._connection);
        }
        catch (error) {
            console.error(`exception while closing database connection: ${error}`);
            throw error;
        }
        finally {
            this._connection = null;
        }
    }

    async shutdown() {
        await this.closeConnection();
    }

    get connection() {  // getter method
        if (!this._connection) {
            throw Error('No connection. Call startTransaction() first');
        }
        return this._connection;
    }

}

module.exports = TransactionManager;