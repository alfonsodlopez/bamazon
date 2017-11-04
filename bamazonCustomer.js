var Table = require('cli-table');
var inquirer = require('inquirer')
var mysql = require('mysql');

function connectToDb() {
	/*Connect to db*/
	var secrets = require("./connection.js");
	var con = mysql.createConnection(secrets.details);
	con.connect();
	displayItems(con)

}



function displayItems(con) {
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
				console.log("\nInsufficient quantity! Try ordering less!");
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