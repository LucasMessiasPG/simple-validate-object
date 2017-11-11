'use strict';

class Validations{

	constructor(field, input, rules){
		this._errors = new Set();
		this.field = field;
		this.input = input;

		if(!rules) rules = [];

		if(typeof rules === "string") rules = [rules];

		return this.validate(rules);
	}

	validate(rules){
		let
			hasInput = typeof this.input !== "undefined";

		for(let rule of rules){

			rule = rule.toLowerCase();

			let params;

			if(rule.indexOf(":")){
				params = rule.split(":")[1];
				rule = rule.split(":")[0];
			}

			if(typeof this[rule] !== "function"){
				this._errors.add("Invalid rule: "+rule);
			}else{
				if(this[rule](params) === false){
					if(rule == "required"){
						this._errors.add(this.field+" is required");
					}else{
						if(hasInput){
							let
								_field = this.field.split(".");

							if(_field.length > 1){
								this._errors.add(_field[_field.length -1]+" of "+_field.join(".")+" needs to be of the type "+ rule);
							}else{
								this._errors.add(this.field+" needs to be of the type "+ rule);
							}
						}
					}
				}
			}
		}

		return {
			hasError: this._errors.size > 0,
			isValid: this._errors.size === 0,
			totalError: this._errors.size,
			errors: Array.from(this._errors)
		};
	}

	required(){
		if(typeof this.input === 'undefined'){
			return false;
		}
		return true;
	}

	array(){
		if(Array.isArray(this.input) === false){
			return false;
		}
		return true;
	}

	string(){
		if(typeof this.input !== 'string'){
			return false;
		}
		return true;
	}

	number(){
		if(typeof this.input !== 'number'){
			if(typeof +this.input === "number" && isNaN(+this.input)){
				return false;
			}
		}

		return true;
	}

	object(){
		if(!(this.input instanceof Object)){
			return false;
		}
		return true;
	}

	boolean(){
		if(typeof this.input !== 'boolean'){
			if(+this.input !== 1 && +this.input !== 0){
				return false;
			}
		}
		return true;
	}

	date(params){

		// todo params = 'dd/MM/yyyy'

		if(this.input == "Invalid Date"){
			return false;
		}

		if(new Date(this.input) == "Invalid Date" && new Date(+this.input) == "Invalid Date"){
			return false;
		}

		return true;

	}
}

module.exports = Validations;