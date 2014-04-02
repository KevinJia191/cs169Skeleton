To globally install Instanbul:

npm install -g istanbul



To run code coverage report, run these commands at top level directory

Mac/Linux:
    $ istanbul cover nodeunit -- -R spec
    
Windows:
    For recursive check:
    $ istanbul cover node_modules/nodeunit/bin/nodeunit -- -R spec
    
    For our tests folder:
    $ istanbul cover node_modules/nodeunit/bin/nodeunit -- tests

