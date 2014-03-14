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
