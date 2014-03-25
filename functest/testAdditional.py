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
    def testAdd1(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        respData = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        self.assertResponse(respData, SUCCESS)
    def testAddTwo(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        respData1 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData2 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user2', 'password' : 'user2'} )
        self.assertResponse(respData1, SUCCESS)
        self.assertResponse(respData2, SUCCESS)
    def testSame(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        respData1 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData2 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        self.assertResponse(respData1, SUCCESS)
        self.assertResponse(respData2, USER_EXISTS)

   

class TestLogin(testLib.RestTestCase):
    def assertResponse(self, respData, correctCode):
        code = respData["errCode"]
        print(code)
        self.assertEqual(code,correctCode);
    def testNoAddLog(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'baduser', 'password' : 'password'} )
        self.assertResponse(respData, CERR_INVAL_CRED)  
    def testAddthenLog(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        self.assertResponse(respData, SUCCESS)
    def testWrongPassword(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        respData1 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData2 = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'wrong password'} )
        self.assertResponse(respData1, SUCCESS)
        self.assertResponse(respData2, USER_EXISTS)
 """

class TestFail(testLib.RestTestCase):
    def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.ERR_BAD_USERNAME):
        expected = { 'errCode' : errCode }
        self.assertDictEqual(expected, respData)
    def testLoginNullName(self):
        respData = self.makeRequest("/users/signup", method="POST", data = { 'user' : '', 'password' : 'noName'} )
        self.assertResponse(respData, None, testLib.RestTestCase.ERR_BAD_USERNAME)

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


class TestIngredients(testLib.RestTestCase):
    def assertResponse(self, respData, code):
        if (respData["errCode"]==code):
            return;
        else:
            self.assertEquals(respData["errCode"],code);
    def testAddthenLog(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        self.assertResponse(respData, count=2)
    def testAddSomeIngredients(self):
        respData = self.makeRequest("/ingredients/add", method="POST", data = {'user': 'user1', 'ingredient_name': 'Apple', 'quantity': '3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
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
    def testRemoveSomeIngredients(self):
        respData = self.makeRequest("/ingredients/remove", method="POST", data = {'user': 'user1', 'ingredient_name': 'Apple', 'quantity': '3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
        self.assertResponse(respData,3)
        respData = self.makeRequest("/ingredients/remove", method="POST", data = {'user': 'user1', 'ingredient_name': 'Raisin', 'quantity': '3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
        self.assertResponse(respData, 3)
        respData = self.makeRequest("/ingredients/remove", method="POST", data = {'user': 'user1', 'ingredient_name': 'Fruit Tarts', 'quantity': '3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
        self.assertResponse(respData, 3)
        respData = self.makeRequest("/ingredients/remove", method="POST", data = {'user': 'user1', 'ingredient_name': 'Banana', 'quantity': '3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
        self.assertResponse(respData, 3)

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
