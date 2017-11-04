DROP DATABASE IF EXISTS bamazon; 

CREATE DATABASE bamazon; 

USE bamazon;

CREATE TABLE products(
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
	("Windows Phone", "Trash", 1.00, 0);