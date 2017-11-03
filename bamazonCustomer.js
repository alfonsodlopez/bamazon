/*
However, if your store does have enough of the product, you should fulfill the
customer's order.

This means updating the SQL database to reflect the remaining quantity.

Once the update goes through, show the customer the total cost of their
purchase.

If this activity took you between 8-10 hours, then you've put enough time into
this assignment. Feel free to stop here -- unless you want to take on the next
challenge. */

var mysql = require('mysql');
var Table = require('cli-table');
var inquirer = require('inquirer')

function connectToDb() {
	/*Connect to db*/
	var con = mysql.createConnection({
		host: "localhost",
		port: 3306,
		user: "root",
		password: "M0shiM0shi",
		database: "bamazon"
	});

	con.connect();

	/*Display all items available for sale*/
	var queryString = "SELECT * FROM products";

	con.query(queryString, function(error, rows, fields) {
		if(error) throw error;
		var table = new Table({ head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock'], 
	    colWidths: [10, 25, 20, 10, 10]
		});

		var ids = [];
		var quantities = [];
		for(var i in rows) {
			table.push([rows[i].item_id, rows[i].product_name, rows[i].department_name, rows[i].price, rows[i].stock_quantity]);
			ids.push(rows[i].item_id)
			quantities.push(rows[i].stock_quantity)
		}
		console.log(table.toString());
		getItem(ids, quantities, con);
	});
}

function getItem(ids, quantities, connection) {
	let item = -1;
	let quantity = 0;
	var questions = [
	{
	type: 'input',
	name: 'enter_id',
	message: 'What item do you want to buy?',
	validate: function(value) {
			if(ids.includes(parseInt(value))) {
				item = parseInt(value)
				return true
			}
			else {
				console.log("Please enter an Item ID on the list.")
			}
		}
	},
	{
	type: 'input',
	name: 'how_many',
    message: 'How many do you want to buy?',
    default: function() {
    		return 5;
		},
	validate: function(value) {
			try {
				value = parseInt(value);
			}
			catch(error) {
				console.log("Please enter a number.");
			}
			if(value.isInteger ===false) {
				console.log("Please enter an integer")
			}
			else if(quantities[item] - parseInt(value) < 0) {
				console.log("Insufficient quantity! Try ordering less!");
			}
			else {
				quantity = parseInt(value)
				return true;
			}
		}
	}];
  	inquirer.prompt(questions).then(function() {
	  	return updateStock(item, quantity, connection);
	});
}

function quit(connection) {
	connection.end((error) => {
		if(error) throw error;
		console.log("Closing connection");
	});
}

function updateStock(item, quantity, connection) {
	var sql = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";
  	connection.query(sql,[quantity, item], function (err, result) {
    	if (err) throw err;
    	console.log("Record updated");
  	});
  	console.log("You are buying "+quantity+" of these item number "+item+"s!\n")
  	var sql = "SELECT price FROM products WHERE item_id = ?";
  	connection.query(sql, item, function(error, result) {
    	if (error) throw error;
    	result = JSON.stringify(result);
    	result = JSON.parse(result);
    	console.log("And it only cost you $"+result[0]["price"]*quantity+"!\n\n")
    	/*Ask user if they want to buy more or quit()*/
    	return connectToDb();
  	});
}

connectToDb();

/*Challenge #2: Manager View (Next Level)

Create a new Node application called bamazonManager.js. Running this application will:
List a set of menu options:
View Products for Sale
View Low Inventory
Add to Inventory
Add New Product

If a manager selects View Products for Sale, the app should list every
available item: the item IDs, names, prices, and quantities.

If a manager selects View Low Inventory, then it should list all items with an
inventory count lower than five.

If a manager selects Add to Inventory, your app should display a prompt that
will let the manager "add more" of any item currently in the store.

If a manager selects Add New Product, it should allow the manager to add a
completely new product to the store.

If you finished Challenge #2 and put in all the hours you were willing to
spend on this activity, then rest easy! Otherwise continue to the next and
final challenge.*/


/*Challenge #3: Supervisor View (Final Level)

Create a new MySQL table called departments. Your table should include the following columns:
department_id
department_name
over_head_costs (A dummy number you set for each department)

Modify the products table so that there's a product_sales column and modify
the bamazonCustomer.js app so that this value is updated with each individual
products total revenue from each sale.

Modify your bamazonCustomer.js app so that when a customer purchases anything
from the store, the price of the product multiplied by the quantity purchased
is added to the product's product_sales column.

Make sure your app still updates the inventory listed in the products column.

Create another Node app called bamazonSupervisor.js. Running this application
will list a set of menu options:

View Product Sales by Department
Create New Department

When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

department_id	department_name	over_head_costs	product_sales	total_profit
01	Electronics	10000	20000	10000
02	Clothing	60000	100000	40000

The total_profit column should be calculated on the fly using the difference
between over_head_costs and product_sales. total_profit should not be stored
in any database. You should use a custom alias.

If you can't get the table to display properly after a few hours, then feel
free to go back and just add total_profit to the departments table.

Hint: You may need to look into aliases in MySQL.
Hint: You may need to look into GROUP BYs.
Hint: You may need to look into JOINS.

HINT: There may be an NPM package that can log the table to the console.
What's is it? Good question :)*/
