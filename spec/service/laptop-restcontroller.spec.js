

const express = require('express');
const LaptopRestController = require('../../src/service/laptop-restcontroller');

describe('Laptop API Integration Tests', () => {
    let app;
    let controller;
    

    beforeAll(() => {
        controller = new LaptopRestController();
        app = controller.app; // Initialize your controller
    });

    it('should return all laptops for a valid location', (done) => {
        const req = {
            params: { location: 'IE' }
        };
        const res = {
            json: jasmine.createSpy('json'),
            status: jasmine.createSpy('status').and.returnValue(this)
        };

        controller.getAllLaptops(req, res).then(() => {
            expect(res.json).toHaveBeenCalled(); // Check if json was called
            expect(res.json.calls.mostRecent().args[0]).toBeInstanceOf(Array); // Check if the response is an array
            done();
        }).catch(err => done.fail(err));
    });

   
});
