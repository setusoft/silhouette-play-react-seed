Silhouette Play React Seed Template
===================================

The Silhouette Play React Seed project shows how [Silhouette] can be used to create a SPA with [React]/[Redux] 
and [Play]. It's a starting point which can be extended to fit your needs.


## Features

* MongoDB storage
* SBT multi project
* Sign Up
* Sign In (Credentials)
* Cookie authentication
* Dependency Injection with Guice
* Publishing Events
* Avatar service
* Remember me functionality
* Password reset functionality
* Account activation functionality
* Email sending and auth token cleanup
* [Security headers](https://www.playframework.com/documentation/2.5.x/SecurityHeaders)
* [CSRF Protection](https://www.playframework.com/documentation/2.5.x/ScalaCsrf)


## Documentation

Consult the [Silhouette documentation] for more information. If you need help with the integration of Silhouette 
into your project, don't hesitate and ask questions in our [Forum] or on [Stack Overflow].


## Installation

Install all NPM dependencies for the UI:

```bash
cd app-ui

# With NPM
npm install

# With yarn
yarn install
```


## How does it work

The application is divided into a backend and a frontend part. The frontend part is located in the
`app-ui` folder and it is based on [Neutrino]. A detailed explanation can be found in the README.md 
of this folder. The frontend application follows the modern JavaScript development workflow. This 
means that in development mode we start an [Express] server on port 5000, which serves your UI. This 
comes with the advantage that you can use [webpack]s [Hot Module Replacement]. 

The backend application is a normal Play application which starts on port 9000 and which serves as the 
API of the frontend.

If you build your application, then the frontend code will be integrated into your Play application. This
means that you do not need any JavaScript server side tooling in production. Your Play application will 
server your frontend code, which was previously packed with webpack.

The application comes with a SBT plugin that triggers the corresponding NPM tasks for the Play SBT build lifecycle.

SBT Commands       | NPM Tasks
------------------ | ------------
`sbt "npm <arg>"`  | `npm run <arg>`
`sbt npm:clean`    | `npm run clean`
`sbt npm:compile`  | `npm run build`
`sbt npm:start`    | `npm run start`
`sbt npm:dist`     | `npm run build`
`sbt npm:test`     | `npm run test`
`sbt run`          | `npm run start`
`sbt stage`        | `npm run deploy:prod`
`sbt dist`         | `npm run deploy:prod`


### Run in dev mode

Start the application with the following command.

```
sbt run
```

You can open `http://localhost:9000` which redirects you to `http://localhost:5000`. Or you open the UI directly
with `http://localhost:5000`. (Note that mongo must be already started)


### Run in stage mode

To run the app in stage mode you can execute the following command:

```
sbt clean stage && bash target/universal/stage/bin/silhouette-play-react-seed -Dplay.crypto.secret=abcdefghijk
```

The application can now be served over the URL `http://localhost:9000`.


### Build the application for production

This builds a Debian package which can be installed on all Debian based systems. The application uses 
[SBT Native Packager] to create the build. To create builds for other distributions, please follow the 
documentation.

```
sbt clean debian:packageBin
```

## Anatomy of the Play application

The Play application is based on [SBT's Multi-project builds]. Here comes a short overview over the available 
modules and their dependencies.

Module      | Description                             | Dependencies
----------- | ----------------------------------------|------------
test        | Test related helpers                    | -
core        | Code which is shared between modules    | test % `Test`
auth        | Authentication related code             | core % `Compile`, test % `Test`
admin       | A placeholder module for your code      | auth % `Compile` and `Test`, test % `Test`

All your custom modules should depend on the `auth` module, as long as it uses authentication based functionality.
The `auth` module comes with a test helper, so you must depend also in `Test` on this module. 

The `root` module is located in the `src` directory of the project folder. It contains the base application code 
and configuration. 


## Anatomy of the JavaScript application

The frontend application is a [React]/[Redux] application which will be packed with [webpack]. For side effecting code 
it uses [Redux Saga] which has some similarities to the Actor model. Some files are also type checked with [Flow] - a 
static type checker for JavaScript.

[Silhouette]: https://www.silhouette.rocks
[Silhouette documentation]: https://www.silhouette.rocks/
[Forum]: http://discourse.silhouette.rocks
[Stack Overflow]: http://stackoverflow.com/questions/tagged/silhouette
[Play]: https://www.playframework.com/
[React]: https://facebook.github.io/react/
[Redux]: http://redux.js.org/
[Redux Saga]: https://redux-saga.js.org/
[webpack]: https://webpack.js.org/
[Neutrino]: https://neutrino.js.org/
[Express]: http://expressjs.com/de/
[Flow]: https://flow.org/
[Hot Module Replacement]: https://webpack.js.org/concepts/hot-module-replacement/
[SBT's Multi-project builds]: http://www.scala-sbt.org/0.13/docs/Multi-Project.html
[SBT Native Packager]: http://sbt-native-packager.readthedocs.io/en/stable/
