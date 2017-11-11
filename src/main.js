'use strict';

const 
	Validations = require("./Validations");

class MainValidateion{

	constructor(){}

	getFinalValuesOfPath_(originalPath, data, path, rules, onlyPath){
		let current_path = path.split(".")[0];
		let _path = path.split(".");


		if(_path.length == 1){
			if(onlyPath){
				return {
					full: "\'" + current_path  + "\' of \'" + originalPath + "\' not found",
					current_path: current_path,
					originalPath: originalPath,
					translated_current_path: this.tryTranslatePath(current_path)
				};
			}

			if(typeof data[current_path] == "undefined"){
				return null;
			}
			return data[current_path];
		}

		_path.shift();

		if(!data[current_path]){
			if(rules[originalPath].indexOf("required") !== -1){
				if(onlyPath){
					return {
						full: "\'" + current_path  + "\' of \'" + originalPath + "\' not found",
						current_path: current_path,
						originalPath: originalPath,
						translated_current_path: this.tryTranslatePath(current_path)
					};
				}
				return null;
			}else{
				return false;
			}
		}
		return this.getFinalValuesOfPath(originalPath, data[current_path], _path.join("."), rules, onlyPath);
	}

	validate(rules, data){
		let err = new Set();
		data = data || {};

		let
			normalizedPathOfRules = this.makePathString(rules);



		for(let rule of normalizedPathOfRules){

			let result = this.getFinalValuesOfPath(rule.path,data);

			if(!result.data){
				if(rule.params.indexOf("required") != -1){
					if(result.finalPath == result.originalPath){
						err.add(result.finalPath+" is required");
					}else{
						err.add(result.finalPath+" of "+result.originalPath+" is required");
					}
					continue;
				}
			}

			let
				validations = new Validations(result.originalPath, result.data, rule.params.split("|"));

			if(validations.hasError){
				for(let _err of validations.errors){
					err.add(_err);
				}
			}
		}

		return {
			isValid: err.size === 0,
			hasError: err.size > 1,
			errors: Array.from(err)
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

			if(typeof field[key] != "object"){


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