import unittest
import os
import testLib
import testSimple
import requests
       
#error codes for signing up
SUCCESS = "SUCCESS"; 
USER_EXISTS= "ERR_USER_EXISTS"

"""
NOTES ABOUT TESTING:
ERROR IN ADDING NULL NAME
ERROR IN REMOVING THINGS
"""

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

INVALID_RATING = "INVALID_RATING";

ERR_USER_NOTFOUND = "ERR_USER_NOTFOUND";
ERR_USER_EXISTS = "ERR_USER_EXISTS";
CERR_INVAL_CRED = "ERR_INVAL_CRED";
YUMMLY_SUCCESS = 42

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
    def testRecipeSearch(self):
        respData = self.makeRequest("/recipes/search", method="POST", data = { 'q' : 'chicken'})
        self.assertResponse(respData,YUMMLY_SUCCESS)


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


    




    """
    def testGetCompletedRecipes(self):
        respData = self.makeRequest("/recipes/history", method="GET", data = {'user': 'user1'} )
        print(respData)
        self.assertResponse(respData,SUCCESS)
    """

    """
#RATINGS TESTS
class TestRatings(testLib.RestTestCase):
    print("ratings are not implimented")
    def assertResponse(self, respData, code):
        if (respData["errCode"]==code):
            return;
        else:
            self.assertEquals(respData["errCode"],code);
    def testSetupRatings(self):
        self.makeRequest("/TESTAPI/resetFixture", method="POST")
        self.makeRequest("/users/signup", method="POST", data = { 'user' : 'user1', 'password' : 'user1'} )
        respData1 = self.makeRequest("recipes/make", method="POST", data = { 'user' : 'user1', 'recipe_name' : 'Banana Pie', 'current_date': '4/18/14'} )
        respData2 = self.makeRequest("recipes/make", method="POST", data = { 'user' : 'user1', 'recipe_name' : 'Apple Pie', 'current_date': '4/18/14'} )
        self.assertResponse(respData1,SUCCESS)
        self.assertResponse(respData2,SUCCESS)
    def testValidRating(self):
        respData = self.makeRequest("history/rating", method="POST", data = { 'user' : 'user1', 'recipe_name' : 'Apple Pie', "rating":4} )
        self.assertResponse(respData,SUCCESS)
    def testInvalidRating(self):
        self.makeRequest("history/rating", method="POST", data = { 'user' : 'user1', 'recipe_name' : 'Apple Pie', "rating":-4} )
        self.assertResponse(respData,ERROR)
    def testCharacterRating(self):
        self.makeRequest("history/rating", method="POST", data = { 'user' : 'user1', 'recipe_name' : 'Apple Pie', "rating":"A"} )
        self.assertResponse(respData,ERROR)
    def testChangeRatingOfNonexistentRecipe(self):
        self.makeRequest("history/rating", method="POST", data = { 'user' : 'user1', 'recipe_name' : 'SOCK SOUP', "rating":4} )
        self.assertResponse(respData,ERROR)
    def testGetRating(self):
        self.makeRequest("recipes/getRating", method="POST", data = { 'user' : 'user1', 'recipe_name' : 'Apple Pie', "rating":4} )
        self.assertResponse(respData,SUCCESS)    
    """

    """
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

