# bamazon

Demo of the bamazonCustomer and bamazonManager applications can be seen **[here]**(https://github.com/alfonsodlopez/bamazon/blob/master/demo.mp4?raw=true)

### bamazon is a simple nodeJS storefront. There are two files included. 

## bamazonCustomer.js
* Invoke the function with `node bamazonCustomer.js` the file customer will be presented with a table of products will pertinent details (ID, Name, Department, Price, Quantity in Stock). 
* Customers are asked to select the product by it's ID, then they will be prompted to enter the stock amount they would like to consume. 
* Once the stock is at 0, the customer can no longer purchase that product
* If they enter an ID not found on the list or a quantity that is greater than the amount in stock, they will be prompted to reenter the values until valid values are given.
* Once the transaction is complete, the table an menu will be presented to the customer again.

## bamazonManager.js
* Invoke the function with `node bamazonManager.js` the manager will be presented with a menu of options:
** View Products for Sale, all items available for purchase `qty > 0` will be displayed with their details
** View Low Inventory, all items with an inventory `qty < 5` will be displayed with their details.
** Add to Inventory, Manager is prompted to replenish inventory of any item in the store.
** Add New Product, Manager is prompted to add a new product to the store databases


