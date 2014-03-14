import unittest
import os
import testLib
import testSimple
       

class TestYummly(testLib.RestTestCase):
    def assertResponse(self, respData, code):
        all_dishes = respData["recipe_id"]
        print(all_dishes)
    def testYummlycall(self):
        respData = self.makeRequest("/recipes/search", method="POST", data = { 'q' : 'chicken'})
        self.assertResponse(respData,42)

"""
class TestAdd(testLib.RestTestCase):
    #global long_user = 'dsjkfhadsjfgasjdfgajksdfgasdfgaksdfghasdfgajsdhfgahsdjfgjashdfgasjdhgfahjsdfgadshjfasdfajshdfgasdjhfasdjfgasdjkfagsdfkasdhfgasdkfgashdfjgasdhjfgasjdfhasdjfgasdhjfgashdfahsdfasgdfkjasgfja'
    #global long_pass = 'dsjkfhadsjfgasjdfgajksdfgasdfgaksdfghasdfgajsdhfgahsdjfgjashdfgasjdhgfahjsdfgadshjfasdfajshdfgasdjhfasdjfgasdjkfagsdfkasdhfgasdkfgashdfjgasdhjfgasjdfhasdjfgasdhjfgashdfahsdfasgdfkjasgfja'
    def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.SUCCESS):
        expected = { 'errCode' : errCode }
        if count is not None:
            expected['count']  = count
        self.assertDictEqual(expected, respData)
    def testAdd1(self):
        respData = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        self.assertResponse(respData, count = 1)
    def testAddTwo(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        respData1 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData2 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user2', 'password' : 'user2'} )
        self.assertResponse(respData1, count = 1)
        self.assertResponse(respData2, count = 1)    
    def testSame(self):
        respData1 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData2 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        self.assertResponse(respData1, count = 1)
        self.assertResponse(respData2, None, testLib.RestTestCase.ERR_USER_EXISTS)
"""
      

class TestLogin(testLib.RestTestCase):
    def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.SUCCESS):
        expected = { 'errCode' : errCode }
        if count is not None:
            expected['count']  = count
        self.assertDictEqual(expected, respData)
    def testNoAddLog(self):
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'baduser', 'password' : 'password'} )
        self.assertResponse(respData, None, testLib.RestTestCase.ERR_BAD_CREDENTIALS)  
           
    def testAddthenLog(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        self.assertResponse(respData, count=2)
       
    def testWrongPassword(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        respData1 = self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        #self.assertResponse(respData1, count=1)
        respData2 = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'wrong password'} )
        self.assertResponse(respData2, None, testLib.RestTestCase.ERR_BAD_CREDENTIALS)
 
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