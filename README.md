# Storefront Backend Project


## Description:
This is a backend structure (API & Database) for a storefront where you can create users, products, and orders.

  ### 1. Users:
  A user is created with a username, first name, last name, and password. Through the user, the *actual user* is allowed to create products and orders.

  ### 2. Products:
  A product is created with a name, price, and category. Products can be added to orders by their id which is incremently automatically created with the product.

  ### 3. Orders:
  An order is created with a user id which is incremently automatically created with the user, and a list of products by their id, and quantity for each product.


## IMPORTANT NOTE:
There's a file named ***database.ts*** that defines the used database. While testing, keep on using the second ***client*** declaration and commenting the first one so you use the test database. When wishing to switch to dev environment, comment the second declaration and un-comment the first.


## How To Use:
1. **Create .env file:**
Creat a file in the root directory named `.env` and add the following:
```
    POSTGRES_HOST=<host-name>
    POSTGRES_PORT=<port-number>
    POSTGRES_DB=<database-name>
    POSTGRES_TEST_DB=<test-database-name>
    POSTGRES_USER=<database-user-name>
    POSTGRES_PASSWORD=<database-user-password>
    ENV=dev
    ADMIN_PASSWORD=<password-to-use-to-get-all-orders>
    SALT_ROUNDS=<number-of-salting-rounds-before-hashing-passwords>
    PEPPER=<extra-string-added-to-passwords-before-hashing>
    TOKEN_SECRET=<secret-string-for-writing-JWTs>
```

2. **Make sure which database you wish to use and activate the responding client declaration in database.ts**
3. **Migrate the database**
4. **Start the server.**
5. **Create a user:**
Submit a post request through the `/user` route, providing the following in the request body:
```
    {
        username: string (a unique identifier for the user),
        first_name: string,
        last_name: string,
        password: string (memorize for use later),
        confirm: string (confirm the password again)
    }
```
You will recieve a response with a user object consisting of:
```
    {
        username,
        first_name,
        last_name,
        token (Keep this token for use later)
    }
```

6. **Create one or more products:**
Submit a post request through the `/product` route, providing the following in the request body:
```
    {
        name: string,
        price: number,
        category: string
    }
```
You will recieve a response with a product object consisting of:
```
    {
        product_id,
        name,
        price,
        category
    }
```

7. **Create one or more orders**
Submit a post request through the `/order` route, providing the following in the request body:
```
    {
        products: [
            {
                product_id: number (the id of the product to add to the order from the products table),
                quantity: number (the quantity for this product)
            },
            ...
        ]: array of objects (containing each product and its quantity)
    }
```
You will recieve a response with an order object consisting of:
```
    {
        order_id,
        products,
        status (defaults to active and changes to complete if another order is created by the same user or if edited using {status: true})
    }
```


## Avaiable Operations:
After following the previous steps, you will have the minimum requirements to use all the operations provided by the API, which include:
1. **User Operations**
   1. **index:** This will return all created users. Used through submitting a GET request to the `/user` route, providing the following in the request body:
   ```
    {
        token: (a JWT returned in the response body when you create a user or login, so we know it's an existing user requesting to see all other users' information)
    }
   ```
   You will receive an array of users' information (first_name, last_name) in the response body.

   2. **show:** This will return a specific user. Used through submitting a GET request to the `/user/<user-id>` route, providing the following in the request body:
   ```
    {
        token: (a JWT returned in the response body when you create a user or login, so we know it's an existing user requesting to see another user's information)
    }
   ```
   You will receive an object of user's information (first_name, last_name) in the response body.

   3. **edit:** This allows you to edit some of your user's information (first_name, last_name, password). Used through submitting a PUT request to the `/user` route, providing the following in the request body (depending on what you want to change):
   ```
    {
        username: (your username),
        password: (your password),
        first_name: (desired new first name, *optional*),
        last_name: (desired new last name, *optional*),
        new_password: (desired new password, *optional*),
        token: (a JWT returned in the response body when you create a user or login, so we know it's the exact user requesting to change their own information)
    }
   ```
   You will receive an object of your user's information after being edited (username, first_name, last_name) in the response body..

   4. **remove:** This allows you to remove your user from the database. Used through submitting a DELETE request to the `/user` route, providing the following in the request body:
   ```
    {
        username: (your username),
        password: (your password),
        token: (a JWT returned in the response body when you create a user or login, so we know it's the exact user requesting to delete their own information)
    }
   ```
   You will receive an object of your user's information before being deleted (username, first_name, last_name) in the response body.

   5. **login:** This allows you to get your user's token to be able to use the above methods and more. Used through submitting a POST request to the `/login` route, providing the following in the request body:
   ```
    {
        username: (your username),
        password: (your password)
    }
   ```
   You will receive an object with your user's information along with your user's token in the response body.

2. **Product Operations:**
   1. **index:** This will return all created products. Used through submitting an empty GET request to the `/product` route. You will receive an array of products' information (product_id ,name, price, category) in the response body.

   2. **show:** This will return all created products. Used through submitting an empty GET request to the `/product/<product-id>` route. You will receive an object of product's information (product_id ,name, price, category) in the response body.

   3. **edit:** This allows you to edit some of your product's information (name, price, category). Used through submitting a PUT request to the `/product/<product-id>` route, providing the following in the request body (depending on what you want to change):
   ```
    {
        name: (desired new name, *optional*),
        price: (desired new price, *optional*),
        category: (desired new category, *optional*),
        token: (a JWT returned in the response body when you create a user or login, so we know it's the exact user owning this product by creating it who is requesting to change its information)
    }
   ```
   You will receive an object of your product's information after being edited (product_id, name, price, category) in the response body..

   4. **remove:** This allows you to remove your product from the database. Used through submitting a DELETE request to the `/product/<product-id>` route, providing the following in the request body:
   ```
    {
        token: (a JWT returned in the response body when you create a user or login, so we know it's the exact user owning this product by creating it who is requesting to delete it)
    }
   ```
   You will receive an object of your user's information before being deleted (username, first_name, last_name) in the response body.

3. **Order Operations:**
   1. **index:** This will return all created orders. Used through submitting a GET request to the `/order` route, providing the following in the request body:
   ```
    {
        admin_password: (a string saved as an environment variable under ADMIN_PASSWORD, representing an admin credential to access all orders made by all users)
    }
   ```
   You will receive an array of orders' information (order_id, user_id, status, products(product_id, quantity)) in the response body.

   2. **show:** This will return a specific order. Used through submitting a GET request to the `/order/<order-id>` route, providing the following in the request body:
   ```
    {
        token: (a JWT returned in the response body when you create a user or login, so we know it's the exact user who made the order requesting to see their own order's information)
    }
   ```
   You will receive an object of order's information (order_id, user_id, status, products(product_id, quantity)) in the response body.

   3. **edit:** This allows you to edit some of your order's information (products, status). Used through submitting a PUT request to the `/order/<order-id>` route, providing the following in the request body (depending on what you want to change):
   ```
    {
        status: (a boolean value that if set to 'true' changes the order status from active to completed, *optional*),
        add: [
            {
                product_id: (the id of the product desired to add to the order),
                quantity: (desired quantity of the product mentioned above)
            },
            ...
        ] (an array of products to add to order, *optional*),
        change: [
            {
                product_id: (the id of the product desired to change its quantity in the order),
                quantity: (desired new quantity of the product mentioned above)
            },
            ...
        ] (an array of products to change their quantity in order, *optional*),
        remove: [
            {
                product_id: (the id of the product desired to remove from the order)
            },
            ...
        ] (an array of products to remove from order, *optional*),
        token: (a JWT returned in the response body when you create a user or login, so we know it's the exact user who made the order requesting to change their own order's information)
    }
   ```
   You will receive an object of your order's information after being edited (order_id, user_id, status, products(product_id, quantity)) in the response body..

   4. **remove:** This allows you to remove your order from the database. Used through submitting a DELETE request to the `/order/<order-id>` route, providing the following in the request body:
   ```
    {
        token: (a JWT returned in the response body when you create a user or login, so we know it's the exact user who made the order requesting to delete their own order' information)
    }
   ```
   You will receive an object of your order's information before being deleted (order_id, user_id, status, products(product_id, quantity)) in the response body.

   5. **orderBy:** This allows you to get your latest order's information. Used through submitting a GET request to the `/order-by` route, providing the following in the request body:
   ```
    {
        username: (your username),
        token: (a JWT returned in the response body when you create a user or login, so we know it's the exact user who made the order requesting to see their own order' information)
    }
   ```
   You will receive an object with your latest order's information (order_id, user_id, status, products(product_id, quantity)) in the response body.


## Scripts:
- **srcstart** ------> Runs the server from ./src directory.
- **build** ---------> Transpiles TypeScript to JavaScript in the ./build directory.
- **buildstart** ----> Runs the server form the ./build directory.
- **start** ---------> Both transpiles and runs the server from the ./build directory. ---- ***important***
- **dbup** ----------> Builds the development database tables.
- **dbreset** -------> Destroys the development database tables.
- **dbup-test** -----> Builds the test database tables.
- **dbreset-test** --> Destroys the test database tables.
- **jasmine** -------> Runs Jasmine unit tests.
- **test** ----------> Build the test database tables, runs the jasmine tests, then destroys the test database tables again. ---- ***important***


## Used Dependencies:
1. Developmet
   - eslint
   - jasmine
   - nodemon
   - supertest
   - ts-node
   - tsc-watch
   - typescript
   - @types & @typescript libraries
2. Production
   - bcrypt
   - body-parser
   - db-migrate
   - dotenv
   - express
   - jsonwebtoken
   - jwt-decode
   - pg


## Credits:
This project was done by Ayman Abdelwahed (AymanElkridy) - provided at the beginning with a basic Node and Express skeleton app -, only externally depending on libraries, documentations and developers community help, for the purpose of submitting as the second project in Udacity's Advanced Full-Stack Web Development Nanodegree.
All the material in this project is subject to open-source policy, available and free to use for and by anyone. Crediting is not asked nor expected, even though it is much appreciated.