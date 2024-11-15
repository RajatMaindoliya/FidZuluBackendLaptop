
const Laptop = require('../model/laptop');
const dbUtils = require('./db-utils')


class LaptopDao {
    constructor(connectionProvider) {  
        this.connectionProvider = connectionProvider;
    }

    async queryForAllLaptops(loc){
        const sql = 
            `select * from laptop`
        ;
        const laptops = [];

        

        let rs;
        try {
            
            const result = await this.connectionProvider.connection.execute(sql, {}, dbUtils.executeOpts);

            

            
            rs = result.resultSet;
            // console.log("Result Set: ", rs);
            console.log("Result Set Metadata: ", result.metaData);

            if (!rs) {
                console.error("No result set returned from the query.");
                return laptops; // Return empty if no results
            }
        } catch (error) {
            console.error("Error executing query: ", error);
            throw error; // Handle or rethrow as needed
        }
        
        

        let multiplier;
        let row;
        switch(loc){
            case 'IE':
                multiplier = 1.23;
                break;
            case 'US-NC':
                multiplier = 1.08;
                break;
            case 'INDIA':
                multiplier = 1.18;
                break;
            default:
                throw Error("Invalid location " + loc);
        }
         while ((row = await rs.getRow())) {
            console.log("Fetched Row: ", row); // Log each fetched row
             const laptop = new Laptop(row.ID, row.PRODUCT, row.BRAND, row.CPU, row.MEMORY, parseFloat((row.PRICE * multiplier).toFixed(2)));

             laptops.push(laptop);
         }

        

        await rs.close();
        return laptops;
    }
}

module.exports = LaptopDao;