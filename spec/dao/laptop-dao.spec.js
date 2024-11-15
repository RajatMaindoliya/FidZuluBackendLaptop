const LaptopDao = require('../../src/dao/laptop-dao');
const dbUtils = require('../../src/dao/db-utils');

describe('LaptopDao', () => {
    let laptopDao;
    let mockConnection;
    let rows;
    let index;
    
    beforeEach(() => {
        mockConnection = {
            execute: jasmine.createSpy('execute').and.callFake(async () => ({
                resultSet: {
                    getRow: async () => {
                        if (index < rows.length) {
                            return rows[index++];
                        }
                        return null;
                    },
                    close: jasmine.createSpy('close').and.callFake(async () => { })
                },
                metaData: [{ name: 'ID' }, { name: 'PRODUCT' }, { name: 'BRAND' }, { name: 'CPU' }, { name: 'MEMORY' }, { name: 'PRICE' }]
            }))
        };
        laptopDao = new LaptopDao({ connection: mockConnection });
        
        rows = [
            { ID: 1, PRODUCT: 'XPS 13', BRAND: 'Dell', CPU: 'Intel', MEMORY: '16GB', PRICE: 1000 },
            { ID: 2, PRODUCT: 'MacBook Pro', BRAND: 'Apple', CPU: 'M1', MEMORY: '16GB', PRICE: 2000 }
        ];
        index = 0;
    });

    it('should return all laptops with price adjusted for IE location', async () => {
        const laptops = await laptopDao.queryForAllLaptops('IE');
        expect(laptops.length).toBe(2);
        expect(laptops[0].price).toBe(1230.00);
        expect(laptops[1].price).toBe(2460.00);
    });

    it('should return all laptops with price adjusted for US-NC location', async () => {
        const laptops = await laptopDao.queryForAllLaptops('US-NC');
        expect(laptops.length).toBe(2);
        expect(laptops[0].price).toBe(1080.00);
        expect(laptops[1].price).toBe(2160.00);
    });

    it('should return all laptops with price adjusted for INDIA location', async () => {
        const laptops = await laptopDao.queryForAllLaptops('INDIA');
        expect(laptops.length).toBe(2);
        expect(laptops[0].price).toBe(1180.00);
        expect(laptops[1].price).toBe(2360.00);
    });

    it('should throw an error for an invalid location', async () => {
        await expectAsync(laptopDao.queryForAllLaptops('INVALID')).toBeRejectedWithError('Invalid location INVALID');
    });
});
