[![Build Status](https://travis-ci.org/kle-pra/products-spring-boot.svg?branch=master)](https://travis-ci.org/kle-pra/products-spring-boot)

Spring Boot & Angular (6) implementation of producting application -example of fullstack application.

Demo:

https://products-spring-boot.herokuapp.com/

Test credentials:
 
 - username: "user" or "admin"
 - password: "password"

Features:
--

- JWT auth with user/admin role system
- how to bundle Angular & Spring Boot 
- simple login/registration
- CRUD on users/products
- admin view
- voting on products/viewing results 

Installation:
---

To run, build backend & frontend; frontend files are copied to over to static folder with npm scripts, which is served by Spring.

- cd frontend
- npm install
- npm run build
- cd ..
- mvn package
- java -jar target/products-0.0.1-SNAPSHOT.jar

There is a similar project where I used NodeJs here: https://github.com/kle-pra/products-node 