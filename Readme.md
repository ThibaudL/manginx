# Manginx
An commanline for running nginx and managing nginx's configuration with templates.

## Getting Started 

### Installation

This command install the cli manginx :
```
$ npm install -g @manginx/cli 
```

After that, you must has the binary `nginx` in your path.

You can test it with `manginx -v` which display the version of manginx. 

### The test's module

For using the cli, you must declare an template of an nginx's configuration to the manginx's libray. For testing your installation, manginx has an test module for it :
```
$ npm install -g @manginx/test 
```

This project during the postinstall phase register in manginx the template, You must see the message below :

```
*** Template '@manginx/test' - added : 🏆 ***
```

You can verify the good registration in manginx with the command `manginx template list`. The module name must be appeared in the list. 
  
### Use the test module

You added an template. But you have not say to manginx to add this template to the next start of the nginx. For this, tape :

```
$ manginx use @manginx/test 
```

### Start / Stop the nginx configuration

Finally, just start the nginx :

```
$ manginx start 
```

By default, manginx start to the port `8080`. It must be free to test. 

You can open your browser to the adress [http://localhost:8080](http://localhost:8080) to see the test page.

# Libraries
* nginx
* commander
* fkill
* fs-extra  
* handlebars
* inquirer
* lokijs
* rxjs
* temp-dir
* winston

# License

[MIT](License)


  
 
