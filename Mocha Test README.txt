README Mocha
To globally install Mocha and Instanbul:

npm install -g mocha
npm install -g istanbul


TO run Mocha on all tests in the "test" folder (not "tests), run

$ mocha




To run code coverage report, run these commands at top level directory

Mac/Linux:
    $ istanbul cover _mocha -- -R spec
    $ istanbul cover nodeunit -- -R spec
    
Windows:
    $ istanbul cover node_modules/mocha/bin/_mocha -- -R spec
    $ istanbul cover node_modules/nodeunit/bin/nodeunit -- -R spec

    https://github.com/gotwarlost/istanbul/issues/90, For why windows is different