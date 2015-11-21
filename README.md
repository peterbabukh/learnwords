It is a simple Backbone, Requirejs, Nodejs, Express, Mongodb, Mongoose project with practical use.

Though this is a ready real app with practical use (see far below), it is a simple app with only basics
implemented in it. Here I used AMD, BACKBONE, UNDERSCORE templating, REQUIREJS, NODEJS, EXPRESS, MONGODB, MONGOOSE...

I wrote this app to learn the above mentioned tools. While reading the code,
please, take it into account, that first only the front end was written, 
and the data was stored locally on the localStorage by Backbone.localStorage. 

Then I decided to back up my app with real server, and for that purpose I used 
Nodejs, MongoDB, Mongoose. As I added sessions and authorization only after the front end was done,
the app looks like some hybrid with layout rendered from backend, and front end logic/render
is done by requirejs from front end. Thus, you will not see the index.html file, as it is in classical
patterns of requirejs projects, and backbone serves here only as module pattern for front end logic.

I am well aware of the fact that the app can be upgraded and extended in many ways: design, security,
 optimisation, functionality, code style... Well, there are too many new things to learn and to implement,
so, for now I will leave it as it is.

TODO:
- preprocessors: high time to finally implement less, minification, build, tests for further
development purposes,
- change slash navigation for the hash one,
- create admin authorization and admin page,
- implement email password-forgot notification,
- statistics,
- facebook, google, vk authorization,
- refactor word edit so that the word to be edited should open in a separate convenient form,
- refactor word group edit so that the word group to be edited should show in a more convenient form,
- enhance security,
- improve design,
- implement pronunciation audio output,
- etc.




LAUNCH of the app:

1. You need to install or have already installed Nodejs. Do it from here https://nodejs.org/en/
If you type in the command line:

	node -v
	
and see the version of the Nodejs installed, it means that everything works.

2. You need to install npm. Do it from the below link according to the instructions:
https://docs.npmjs.com/getting-started/installing-node
If after all you type in the command line:

	npm -v
	
and see the version of the npm installed, it means that everything works.

3. Clone the repository to your git.

4. You also have to install MongoDB database. Download it from here:
https://www.mongodb.org/
and then follow the instructions here:
https://docs.mongodb.org/manual/?_ga=1.34887912.83950049.1445246926
and further on. Please, be prepared that it may be pretty irritating.
I did it on windows.
https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/

For operating you will need to open 2 command prompts, 1 for the db, and 1 for the project.
Make sure you do it under administrator's rights.

5. In the 1st command prompt go to the project root directory
and type in the command line:

	npm install
	
the dependencies from the package.json file will be installed locally.

6. In the 2nd command prompt go to:
my e.g.: C:\path\to\mongodb\bin

and execute:
mongod.exe --dbpath "d:\path\to\your\project\db\storage\ data"
(I called my project db storage directory >> data)
Your data will be stored by mongodb there.

6. In the 1st command prompt your commands:

	npm start
	
or

	node server.js
	
will start the app running.




The PRACTICAL USE of the app:

It is not just a sample application. It is of practical use.
This application is made to help school children of Belarus learn English words, and
their parents to test their children's skills. It is made to supplement
the pupil's book currently (2015) used in schools of Belarus.
The application covers 3rd and 4th grades. The application helps school
children learn words by units and/or topics.
Showing good results doing this application means that one is perfectly
ready for the school tests in spelling.
Moreover, it means that one has extended ones vocabulary to a great extend,
and this is of great value to him/her.

Though it covers only 3rd and 4th grades, it enables users create their
own word groups dynamically. Anyway,
later on I am planning to add more grades, etc.

The application is written on AMD bases using requirejs and templating,
and thus can be easily extended to further needs.
I have lots of ideas regarding further development of it, making it more fun with more functionality.
As it all takes time, this will take a while.


If you want to contact me regarding any issues, contact me by:

e-mail: peter_babukh@mail.ru
skype: peterbabukh
phone number: +37529-38-37-184

