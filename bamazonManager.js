var Table = require('cli-table');
var inquirer = require('inquirer')
var mysql = require('mysql');

function menu() {

	console.log("\n\n\n")
	inquirer.prompt([
	  {
	    type: 'list',
	    name: 'theme',
	    message: 'What do you want to do?\n',
	    choices: [
	      'View Products for Sale',
	      'View Low Inventory',
	      new inquirer.Separator(),
	      'Add to Inventory',
	      'Add New Product'
	    ]
	  }
	]).then(function (answers) {
		con = listItems();
		var result = JSON.stringify(answers);
		result = JSON.parse(result);
		if(result["theme"] === 'View Products for Sale'){
			displayAvailable(con);
		} 
		else if(result["theme"] === 'View Low Inventory') {
			lowInventory(con);
		}
		else if(result["theme"] === 'Add to Inventory') {
			getItem(con)
		}
		else if(result["theme"] === 'Add New Product') {
			newProduct(con);
		}
		else {
			quit(con);
		}
	});
}

/*If a manager selects View Products for Sale, the app should list every
available item: the item IDs, names, prices, and quantities.*/
function listItems() {
	var secrets = require("./connection.js");
	var con = mysql.createConnection(secrets.details);
	con.connect();
	return con
}

function displayAvailable(con) {
	var queryString = "SELECT * FROM products";

	con.query(queryString, function(error, rows, fields) {
		if(error) throw error;
		var table = new Table({ head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock'], 
	    colWidths: [10, 25, 20, 10, 10]
		});
		for(var i in rows) {
			if(rows[i].stock_quantity >0) {
				table.push([rows[i].item_id, rows[i].product_name, rows[i].department_name, rows[i].price, rows[i].stock_quantity]);
			}
		}
		console.log("\n\n")
		console.log(table.toString());
		console.log("\n\n")
	});
}
/*If a manager selects View Low Inventory, then it should list all items with an
inventory count lower than five.*/
function lowInventory(con) {
	var queryString = "SELECT * FROM products";

	con.query(queryString, function(error, rows, fields) {
		if(error) throw error;
		var table = new Table({ head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock'], 
	    colWidths: [10, 25, 20, 10, 10]
		});

		var ids = [];
		var quantities = [];
		for(var i in rows) {
			if(rows[i].stock_quantity < 5) {
				table.push([rows[i].item_id, rows[i].product_name, rows[i].department_name, rows[i].price, rows[i].stock_quantity]);
			}
		}
		console.log("\n\n")
		console.log(table.toString());
		console.log("\n\n")
	});
}

/*If a manager selects Add to Inventory, your app should display a prompt that
will let the manager "add more" of any item currently in the store.*/

function getItem(con) {
	let item = -1;
	let ids = [];
	let quantity = 0;
	let quantities = [];
	const queryString = "SELECT * FROM products";

	con.query(queryString, function(error, rows, fields) {
		if(error) throw error;
		for(var i in rows) {
				ids.push([rows[i].item_id]);
			}
			return ids;
		});
	displayAvailable(con)
	var questions = [
	{
	type: 'input',
	name: 'enter_id',
	message: 'What item do you want to restock?',
	validate: function(value) {
			if(ids[0].includes(parseInt(value))) {
				item = parseInt(value);
				return true;
			}
			else {
				console.log("Please enter an Item ID on the list.");
			}
		}
	},
	{
	type: 'input',
	name: 'how_many',
    message: 'How many do you want to add?',
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
			else if(parseInt(value) <= 0) {
				console.log("Please enter a positive integer!");
			}
			else {
				quantity = parseInt(value)
				return true;
			}
		}
	}];
  	inquirer.prompt(questions).then(function() {
	  	return addInventory(item, quantity, con);
	});
}

function addInventory(item, quantity, con) {
	var sql = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?";
  	con.query(sql,[quantity, item], function (err, result) {
    	if (err) throw err;
    	console.log("Record updated");
  	});
  	return displayAvailable(con);
}

/*If a manager selects Add New Product, it should allow the manager to add a
completely new product to the store.*/
function newProduct(con) {
	var questions = [
	{
	type: 'input',
	name: 'name',
	message: 'Enter the products name',
	validate: function(value) {
		return true;
		}
	},
	{
	type: 'input',
	name: 'department',
	message: 'What department does it belong to?'
	},
	{
	type: 'input',
	name: 'price',
	message: 'What is the unit price?',
	validate: function(value) {
			try {
				value = parseFloat(value);
			}
			catch(error) {
				console.log("Please enter a number.");
			}
			if(value.isFloat ===false) {
				console.log("Please enter a number")
			}
			else if(parseInt(value) < 0) {
				console.log("Please enter a positive price!");
			}
			else {
				price = parseInt(value)
				return true;
			}
		}
	},

	{
	type: 'input',
	name: 'stock',
    message: 'How much stock do you have?',
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
				console.log("Please enter a number")
			}
			else if(parseInt(value) < 0) {
				console.log("Please enter a positive integer!");
			}
			else {
				quantity = parseInt(value)
				return true;
			}
		}
	}];
  	inquirer.prompt(questions).then(function(answers) {
	  	return insertItems(answers, con);
	});
}

function insertItems(input, con){
	input = JSON.stringify(input, null, '  ');
	input = JSON.parse(input)

/*	con.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("' + input["product_name"] + '", "' + input["department_name"] + '", ' + input["price"] + ', ' + input["stock_quantity"] + ')',
	function (error, results) {
		console.log(results)
    if (error) throw error;
    	else res.send('success');
	});*/
	
	var sqlString = "INSERT INTO products SET ?"
  	
  	var replacementVariables = {
    product_name: input["name"],
    department_name: input["department"],
    price: input["price"],
    stock_quantity: input["stock"]
  }
  function finishedCallback (err, res) {
    console.log("Product inserted!\n")
    con.end()
  }
  var query = con.query(sqlString, replacementVariables, finishedCallback)
}

function quit(con) {
	con.end((error) => {
		if(error) throw error;
		console.log("Closing connection");
	});
}

menu();