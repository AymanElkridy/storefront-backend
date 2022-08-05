# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index `'/product'` GET
- Show `/product/:id` GET
- Create [token required] `/product` POST
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required] `/user` GET
- Show [token required] `/user/:id` GET
- Create [token required] `/user` POST

#### Orders
- Current Order by user (args: user id)[token required] `/order-by` GET
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
-  id `product_id`
- name `name`
- price `price`
- [OPTIONAL] category `category`

##### products
|product_id |name |price |category |user_id |
|---:|---:|---:|---:|---:|
|SERIAL PRIMARY KEY |VARCHAR(100) |FLOAT |VARCHAR(50) | INTEGER REFERENCES users(user_id)|

#### User
- id `user_id`
- firstName `first_name`
- lastName `last_name`
- password `password_digest`

#### Orders
- id `order_id`
- id of each product in the order `relation_orders_products(product_id)`
- quantity of each product in the order `relation_orders_products(quantity)`
- user_id `user_id`
- status of order (active or complete) `status`

