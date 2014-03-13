Create table users (
username text primary key,
hashed_password text
);

Create table ingredients (
username text,
ingredient_name text,
expiration_date text,
quantity decimal check(quantity>0),
unit text,
primary key(username,ingredient_name,expiration_date)
);

Create table history (
username text references users(username),
recipe_name text,
dateCreated text,
rating int check(rating > 0 AND rating <= 5),
primary key(username,recipe_name,dateCreated)
);