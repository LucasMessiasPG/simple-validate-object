# simple-validate-object

Simple validator was created for validate a simple object =D

## Example

create rules

```javascript
let
	rules = {
		name: "required|string",
		username: "required|string",
		surname: "string",
		age: "required|number",
		games:{
			list: "required|array",
			favorite: {
				name: "string"
			}
		}
	};
```
OR
```javascript
let
	rules = {
		name: "required|string",
		username: "required|string",
		surname: "string",
		age: "required|number",
		"games.list": "required|array",
		"games.favorite.name": "required|string"
	};
```

apply rules

```javascript
let 
	SimpleValidateObject = require("simple-validate-object"),
	myObj = {
		name: "Roberto J. Mattie",
		username: "roberto@gmail.com",
		surname: "BigBig",
		age: 27,
		games:{
			list: [
				{
					name: "anyName1",
					action: true,
					puzzle: false
				}
			],
			favorite: {
				name: true
			}
		}
	};
```

```javascript
let
	validator = new SimpleValidateObject(),
	err = validator.validate(rules, myObj);

console.log(err);

//	{
//		isValid: false,
//		hasError: true,
//		errors: [ 'name of game.favorite.name needs to be of the type string' ]
//	}
```

### Sublevel

```javascript
for(let item of myObj.list){
	let
		_rules = {
			name: "required|string",
			action: "boolean",
			puzzle: "boolean
		},
		err = validator.validate(_rules, item)
	....
}
```

## Params validate

 1. required
 2. string
 3. number
 4. date ( basic validation )
 5. boolean
 6. object
 7. array

