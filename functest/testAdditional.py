import unittest
import os
import testLib
import testSimple
       

class TestIngredients2(testLib.RestTestCase):
    """
    LOGIC:

    First add and create a User, then add ingredients and then remove a particular ingredient, then remove all
    """
    def assertResponse(self, respData, code):
        all_dishes = respData["recipe_id"]
        print(all_dishes)
    def testYummlycall(self):
        respData = self.makeRequest("/recipes/search", method="POST", data = { 'q' : 'chicken'})
        self.assertResponse(respData,42)
        

class TestAdd(testLib.RestTestCase):
    #global long_user = 'dsjkfhadsjfgasjdfgajksdfgasdfgaksdfghasdfgajsdhfgahsdjfgjashdfgasjdhgfahjsdfgadshjfasdfajshdfgasdjhfasdjfgasdjkfagsdfkasdhfgasdkfgashdfjgasdhjfgasjdfhasdjfgasdhjfgashdfahsdfasgdfkjasgfja'
    #global long_pass = 'dsjkfhadsjfgasjdfgajksdfgasdfgaksdfghasdfgajsdhfgahsdjfgjashdfgasjdhgfahjsdfgadshjfasdfajshdfgasdjhfasdjfgasdjkfagsdfkasdhfgasdkfgashdfjgasdhjfgasjdfhasdjfgasdhjfgashdfahsdfasgdfkjasgfja'
    """Test adding users"""
    def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.SUCCESS):
        """
        Check that the response data dictionary matches the expected values
        """
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
       
class TestLogin(testLib.RestTestCase):
    def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.SUCCESS):
        """
        Check that the response data dictionary matches the expected values
        """
        expected = { 'errCode' : errCode }
        if count is not None:
            expected['count']  = count
        self.assertDictEqual(expected, respData)
    """Test users logging in"""
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
 
 
class TestFail(testLib.RestTestCase):
    def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.ERR_BAD_USERNAME):
        """
        Check that the response data dictionary matches the expected values
        """
        expected = { 'errCode' : errCode }
        self.assertDictEqual(expected, respData)
    """Test users loggin in with blank name"""
    def testLoginNullName(self):
        respData = self.makeRequest("/users/signup", method="POST", data = { 'user' : '', 'password' : 'noName'} )
        self.assertResponse(respData, None, testLib.RestTestCase.ERR_BAD_USERNAME)


class TestIngredients(testLib.RestTestCase):
    """
    LOGIC:

    First add and create a User, then add ingredients and then remove a particular ingredient, then remove all
    """
    def assertResponse(self, respData, code):
        if (respData["errCode"]==testLib.INGREDIENT_SUCCESS):
            print ("YAYYY")
        else:
            print ("FAIL")
    def testAddthenLog(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        self.assertResponse(respData, count=2)
    def addSomeIngredients(self):
        self.makeRequest("/ingredients/add", method="POST", data = {'user': 'foo', 'ingredient_name': 'Apple', 'quantity': '3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
        self.makeRequest("/ingredients/add", method="POST", data = {'user': 'foo', 'ingredient_name': 'Apple', 'quantity': '3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
        self.makeRequest("/ingredients/add", method="POST", data = {'user': 'foo', 'ingredient_name': 'Apple', 'quantity': '3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
        self.makeRequest("/ingredients/add", method="POST", data = {'user': 'foo', 'ingredient_name': 'Apple', 'quantity': '3', 'unit':'count', 'expiration_date':'6/7/15', 'current_date':'3/2/14'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        self.assertResponse(respData, count=2)
    def testAddthenLog(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        self.assertResponse(respData, count=2)