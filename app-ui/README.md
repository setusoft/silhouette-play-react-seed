# Introduction

This directory contains the client application developed with [React] and [Redux]. The application 
architecture is based on [Neutrino].

# Style guide

This project uses the [Airbnb JavaScript Style Guide] which provides plenty of [ESLint] rules and a well
detailed Style Guide explaining common pitfalls.

# I18n

The message file for the language "en" is empty because we use messages and not message IDs as keys. These 
messages acts also as default translation if no message could be found in the message file. So for the language
"en" the file can be empty, because we use the English default messages.

[React]: https://facebook.github.io/react/
[Redux]: http://redux.js.org/
[Neutrino]: https://neutrino.js.org/
[Airbnb JavaScript Style Guide]: https://github.com/airbnb/javascript
[ESLint]: http://eslint.org/
