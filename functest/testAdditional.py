import unittest
import os
import testLib
import testSimple
       
#error codes for signing up
SUCCESS = "SUCCESS"; 
USER_EXISTS= "ERR_USER_EXISTS"

#error codes for logging in

#NOTE: FOR NOW (3/27/13), we are assuming that 
ERR_USER_NOTFOUND = "ERR_USER_NOTFOUND";
ERR_USER_EXISTS = "ERR_USER_EXISTS";
CERR_INVAL_CRED = "ERR_INVAL_CRED";
INVALID_USER = "INVALID_USER"

ERR_RECIPE_CREATED_ALREADY = "ERR_RECIPE_CREATED_ALREADY";
ERROR = "ERROR";
SUCCESS_UPDATED = "SUCCESS_UPDATED";
NEGATIVE_QUANTITY = "NEGATIVE_QUANTITY";
DATE_ERROR = "DATE_ERROR";  
DOESNT_EXIST = "DOESNT_EXIST";

ERR_USER_NOTFOUND = "ERR_USER_NOTFOUND";
ERR_USER_EXISTS = "ERR_USER_EXISTS";
CERR_INVAL_CRED = "ERR_INVAL_CRED";

class TestYummly(testLib.RestTestCase):
    def assertResponse(self, respData, code):
        all_dishes = respData["recipe_id"]
        self.assertNotEqual(len(all_dishes),0)
        #make sure each recipie contains chicken in it!
        for dish in all_dishes:
            if ("Chicken" not in dish and "chicken" not in dish and "CHICKEN" not in dish):
                print(dish)
                print("chicken was not found in the name of the dish!")
                self.assertEqual(1,0)
        print(all_dishes)
    def testYummlycall(self):
        respData = self.makeRequest("/recipes/search", method="POST", data = { 'q' : 'chicken'})
        self.assertResponse(respData,42)


class TestAdd(testLib.RestTestCase):
    #global long_user = 'dsjkfhadsjfgasjdfgajksdfgasdfgaksdfghasdfgajsdhfgahsdjfgjashdfgasjdhgfahjsdfgadshjfasdfajshdfgasdjhfasdjfgasdjkfagsdfkasdhfgasdkfgashdfjgasdhjfgasjdfhasdjfgasdhjfgashdfahsdfasgdfkjasgfja'
    #global long_pass = 'dsjkfhadsjfgasjdfgajksdfgasdfgaksdfghasdfgajsdhfgahsdjfgjashdfgasjdhgfahjsdfgadshjfasdfajshdfgasdjhfasdjfgasdjkfagsdfkasdhfgasdkfgashdfjgasdhjfgasjdfhasdjfgasdhjfgashdfahsdfasgdfkjasgfja'
    def assertResponse(self, respData, correctCode):
        code = respData["errCode"]
        print(code)
        self.assertEqual(code,correctCode);
    def testAddNewUser(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        respData = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        self.assertResponse(respData, SUCCESS)
    def testAddTwo(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        respData1 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData2 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user2', 'password' : 'user2'} )
        self.assertResponse(respData1, SUCCESS)
        self.assertResponse(respData2, SUCCESS)
    def testAddExistingUser(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        respData1 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData2 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        self.assertResponse(respData1, SUCCESS)
        self.assertResponse(respData2, USER_EXISTS)        
    def testAddInvalidUser(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        respData1 = self.makeRequest("/users/signup", method="POST", data = { 'user' : '', 'password' : 'user1'} )
        self.assertResponse(respData1, INVALID_USER)
        print(respData1)
    """
    ERRORS:
    INVALID USERS ARE ALLOWED


    TODO
    testaddNewUser(): Sends a POST request to the backend to add users to make sure adding a new users works (by verifying the correct json response).
testAddExistingUser(): Tries to add an already existing user to make sure it errors.
testAddInvalidUser(): Try to add a user with an invalid username.
testLoginValid(): Try to login with an added account.
testLoginInvalid(): Try to login with invalid credentials.


Assuming Invalid User is one with a null name
    """

   

class TestLogin(testLib.RestTestCase):
    def assertResponse(self, respData, correctCode):
        code = respData["errCode"]
        print(code)
        self.assertEqual(code,correctCode);
    def testLoginInvalid(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'baduser', 'password' : 'password'} )
        self.assertResponse(respData, CERR_INVAL_CRED)  
    def testLoginValid(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        self.assertResponse(respData, SUCCESS)
    def testWrongPassword(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        respData1 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData2 = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'wrong password'} )
        self.assertResponse(respData1, SUCCESS)
        self.assertResponse(respData2, CERR_INVAL_CRED)

"""
ERROR WITH RUNNING THESE TESTS
"""

class TestIngredients(testLib.RestTestCase):
    def assertResponse(self, respData, code):
        if (respData["errCode"]==code):
            return;
        else:
            self.assertEquals(respData["errCode"],code);
    def assertQuantity(self, respData, quantity):
        if (respData["new_quantity"]==quantity):
            return;
        else:
            self.assertEquals(respData["new_quantity"],quantity);           
    def testAdd(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Apple', 'quantity': 3, 'unit':'count', 'expiration_date':'6/7/15'} )
        self.assertResponse(respData,SUCCESS);

    def testUpdateAdd(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Apple', 'quantity': 3, 'unit':'count', 'expiration_date':'6/7/15'} )
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Apple', 'quantity': 3, 'unit':'count', 'expiration_date':'6/7/15'} )
        print(respData)
        self.assertResponse(respData,SUCCESS_UPDATED);
        self.assertQuantity(respData,6);

    def testUpdateRemove(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Apple', 'quantity': 10, 'unit':'count', 'expiration_date':'6/7/15'} )
        respData = self.makeRequest("/ingredients/remove", method="POST", data = {'user': 'user1', 'ingredient_name': 'Apple', 'quantity': 3, 'unit':'count', 'expiration_date':'6/7/15'} )
        self.assertResponse(respData,SUCCESS_UPDATED);
        self.assertQuantity(respData,7);
        print(respData);
    def testAddthenLog(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        self.assertResponse(respData, SUCCESS)
    def testAddSomeIngredients(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Apple', 'quantity': 10, 'unit':'count', 'expiration_date':'6/7/15'} )
        print(respData)
        self.assertResponse(respData,SUCCESS);
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Banana', 'quantity': 10, 'unit':'count', 'expiration_date':'6/7/15'} )
        self.assertResponse(respData,SUCCESS);
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Guava', 'quantity': 10, 'unit':'count', 'expiration_date':'6/7/15'} )
        self.assertResponse(respData,SUCCESS);
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Taco', 'quantity': 10, 'unit':'count', 'expiration_date':'6/7/15'} )
        self.assertResponse(respData,SUCCESS);
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Fish', 'quantity': 10, 'unit':'count', 'expiration_date':'6/7/15'} )
        self.assertResponse(respData,SUCCESS);
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Mango', 'quantity': -10, 'unit':'count', 'expiration_date':'6/7/15'} )
        self.assertResponse(respData,NEGATIVE_QUANTITY);
    def testRemoveSomeIngredients(self):
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Apple', 'quantity': 3, 'unit':'count', 'expiration_date':'6/7/15'} )
        self.assertResponse(respData,SUCCESS)
        respData = self.makeRequest("/ingredients/remove", method="POST", data = {'user': 'user1', 'ingredient_name': 'Apple', 'quantity': 3, 'unit':'count', 'expiration_date':'6/7/15'} )
        print(respData)
        self.assertResponse(respData, SUCCESS)
        #self.assertQuantity(respData,7);
        respData = self.makeRequest("/ingredients/remove", method="POST", data = {'user': 'user1', 'ingredient_name': 'Banana', 'quantity': 3, 'unit':'count', 'expiration_date':'6/7/15'} )
        self.assertResponse(respData, SUCCESS)
        #self.assertQuantity(respData,7);
        respData = self.makeRequest("/ingredients/remove", method="POST", data = {'user': 'user1', 'ingredient_name': 'Mango', 'quantity': 3, 'unit':'count', 'expiration_date':'6/7/15'} )
        self.assertResponse(respData, DOESNT_EXIST)
        #self.assertQuantity(respData,7);
"""
class TestRecipe(testLib.RestTestCase):
    def assertResponse(self, respData, code):
        if (respData["errCode"]==code):
            return;
        else:
            self.assertEquals(respData["errCode"],code);
    def testAddRecipe(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        self.assertResponse(respData, count=2)
        respData = self.makeRequest("/recipes/make", method="POST", data = {'user': 'user1', 'recipe_name': 'Apple Pie', 'current_date': '3/11/14', 'rating':'4'} )
        self.assertResponse(respData,"SUCCESS")
        respData = self.makeRequest("/recipes/make", method="POST", data = {'user': 'user1', 'recipe_name': 'Chicken Pie', 'current_date': '3/11/14', 'rating':'4'} )
        self.assertResponse(respData,"SUCCESS")
        respData = self.makeRequest("/recipes/make", method="POST", data = {'user': 'user1', 'recipe_name': 'Berry Pie', 'current_date': '3/11/14', 'rating':'4'} )
        self.assertResponse(respData,"SUCCESS")
    def testClearAll(self):
        respData = self.makeRequest("/recipes/deleteAllHistory", method="POST", data = {'user': 'user1'} )
        self.assertResponse(respData,"SUCCESS")
    def testGetHistory(self):
        respData = self.makeRequest("clearHistory(userData)", method="POST", data = {'user': 'user1', 'ingredient_name': 'Apple', 'quantity': '3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
        self.assertResponse(respData,3)
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Raisin', 'quantity': '3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
        self.assertResponse(respData, 3)
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Fruit Tarts', 'quantity': '3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
        self.assertResponse(respData, 3)
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Banana', 'quantity': '3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
        self.assertResponse(respData, 3)
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Banana', 'quantity': '3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
        self.assertResponse(respData, -3)
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Durian', 'quantity': '-3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
        self.assertResponse(respData, -3)


    #SHOULD PROBABLY TEST INVENTORY RANGE

"""

