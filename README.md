## simple-user-db--express-sqlite3
A simple, fully-tested user database with signup/signin api. Tested with
mocha/chai/supertest, coverage report by istanbul (nyc).

### usage
Clone it, install deps. Create a file `env.json` with the following object:
```
{
   "development": {
      "db_url": "./users.db"
   }, 
   "test": {
      "db_url": "./test.db"
   }
}
```

Run the tests:
```
$ npm run test
```

Run the tests, with coverage report:
```
$ npm run coverage
```
