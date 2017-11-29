'use strict';

const 
	Validations = require("./validations");

class MainValidateion{

	constructor(){}

	validate(rules, data){
		let err = {};
		data = data || {};

		let 
			_isValid = true,
			_errors = [],
			normalizedPathOfRules = this.makePathString(rules);



		for(let rule of normalizedPathOfRules){

			let result = this.getFinalValuesOfPath(rule.path,data);

			if(!result.data){
				if(rule.params.indexOf("required") != -1){
					if(result.finalPath == result.originalPath){
						if(!err[result.finalPath]){
							err[result.finalPath] = [];
						}
						err[result.finalPath].push("required");
						_isValid = false;
					}else{
						if(!err[result.originalPath]){
							err[result.originalPath] = [];
						}
						err[result.originalPath].push("required");
						_isValid = false;
					}
					continue;
				}
			}

			let
				validations = new Validations(result.originalPath, result.data, rule.params.split("|"));

			for(let key in validations.errors){
				if(!err[key]){
					err[key] = [];
				}
				err[key] = validations.errors[key];
				_isValid = false;
			}
		}

		_errors = err;

		return {
			isValid: _isValid,
			errors: _errors
		};
	}

	getFieldAndValue(rules, data){
		let
			result = {};

		for(let field of rules){
			if(field.hasString(".")){
				result = this.getFinalValuesOfPath(field, data);
			}else{

			}
		}
	}

	hasString(text, string){
		return text.indexOf(string) > -1;
	}

	makePathString(field, prev){
		let
			paths = [];

		for(let key in field){

			if(typeof field[key] !== "object"){


				if(!prev){ // fisrt path
					paths.push( {path: key, params: field[key]} );
				}else{
					paths.push({ path:prev+"."+key, params: field[key]});
				}
			}else{
				let
					result = this.makePathString(field[key], (prev ? prev+"."+key :key));
				for(let _path of result){
					paths.push(_path);
				}
			}
		}

		return paths;
	}

	getFinalValuesOfPath(field, data, originalPath){
		if(!originalPath){
			originalPath = field;
		}

		let
			_currentaPath = field.split(".")[0],
			_path = field.split(".");

		if(_path.length == 1){

		}

		if(!data[_currentaPath]){
			if(_currentaPath){
				return {
					originalPath: originalPath,
					finalPath: originalPath.slice(originalPath.indexOf(_currentaPath)),
					data: null
				};
			}
			return {
				originalPath: originalPath,
				finalPath: originalPath,
				data: data
			};
		}
		_path.shift();
		return this.getFinalValuesOfPath(_path.join("."), data[_currentaPath], originalPath);
	}

}

module.exports = MainValidateion;