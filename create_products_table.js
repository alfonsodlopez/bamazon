/*Challenge #1: Customer View (Minimum Requirement)

Create a MySQL Database called bamazon.
Then create a Table inside of that database called products.
The products table should have each of the following columns:
item_id (unique id for each product)
product_name (Name of product)
department_name
price (cost to customer)
stock_quantity (how much of the product is available in stores)

Populate this database with around 10 different products. (i.e. Insert "mock"
data rows into this database and table).
*/

var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "M0shiM0shi",
	database: "bamazon"
});

con.connect(function(error) {
	if(error) throw error;

	/*Create products table*/
	var sql = 

	`CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	product_name VARCHAR(255) NOT NULL,
	department_name VARCHAR(255),
	price DECIMAL(10,2),
	stock_quantity INT NOT NULL);

	INSERT INTO products (product_name, department_name, price, stock_quantity) 
	VALUES("Shamwow", "Homeware", 19.95, 1000),
	("Orange Glow", "Homeware", 29.95, 1000),
	("Abtrek", "Exercise", 1199.95, 250),
	("Slapchop", "Cooking", 19.95, 500),
	("Orangina", "Orange Drink", 2.95, 100000),
	("Grape Kool Aid", "Produce", 0.99, 1000000),
	("Jimmy Dean Sandwiches", "Dining", 3.95, 1000),
	("Pokemons Greatest Hits", "Music", 19.95, 25),
	("Snuggie", "Bedding", 49.99, 18),
	("Windows Phone", "Trash", 1.00, 0);`
	
	con.query(sql, function(error, result) {
		if (error) throw error;
	console.log("Products table created ...\n");
	});

	/*Terminate connection gracefully*/
	con.end((err) => {
	});
});
