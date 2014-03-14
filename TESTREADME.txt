To run functests

cd down to the functest folder

then type the command

make func_tests TEST_SERVER=http://radiant-dusk-5060.herokuapp.com/

or generally

make func_tests TEST_SERVER=“HEROKU_URL”


To run the unit tests, stay in the root directory, the one that has HTTPHANDLER and run

node unit tests