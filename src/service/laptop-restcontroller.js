const express = require('express');

const TransactionManager = require('../dao/transaction-manager');
const LaptopDao = require('../dao/laptop-dao')


class LaptopRestController{
    constructor() { 
        this.port = process.env.PORT || 3036; // port for Laptops
        this.onlyDigitsRegExp = /^\d+$/;

        this.app = express();
        // Configure Express to populate a request body from JSON input
        this.app.use(express.json());


        // sample URL: http://localhost:3036/laptops/all/ie

        const router = express.Router();
        router.get('/laptops/all/:location', this.getAllLaptops.bind(this));
        router.get('/laptops/team', this.getTeam.bind(this));
        

        this.app.use('/', router);

        this.transactionManager = new TransactionManager();
        this.LaptopDao = new LaptopDao(this.transactionManager);
    }

    start() {
        this.app.listen(this.port, 
            () => console.log(`Service for Laptop (get all for now....) CRUD operations listening on port ${this.port}`))
    }

    async getAllLaptops(req, res) {
        const location = req.params.location.toUpperCase();
        console.log(location);
        try {
            await this.transactionManager.startTransaction();

            const laptops = await this.LaptopDao.queryForAllLaptops(location);

            res.json(laptops);
        }
        catch (err) {
            console.error(`error on GET laptops: ${err}`);
            res.status(500).json({error: err});
        }
        finally {
            await this.transactionManager.rollbackTransaction();
        }
    }
    async getTeam(req, res) {
        const team = {
            teamName: "MAXI V2",
            members: ["Rajat Maindoliya", "Thomas Moore"]
        };
        res.json(team);
    }
}
module.exports = LaptopRestController;

if (require.main === module) {
    const controller = new LaptopRestController();
    controller.start();
}