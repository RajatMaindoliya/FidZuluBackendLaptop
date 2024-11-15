class Laptop {
    constructor(id, product, brand, CPU, memory, price){
        if(price == null){
            throw Error(`invalid argument ${price}`);
        }
        this.id = id;
        this.product = product;
        this.brand = brand;
        this.CPU = CPU;
        this.memory = memory;
        this.price = price;
    
    }
    toString(){
        return JSON.stringify(this);
    }
}

module.exports = Laptop;