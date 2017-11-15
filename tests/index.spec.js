if(!process.env.NODE_ENV){
    process.env.NODE_ENV = "test";
}

const
    chai = require("chai"),
    expect = chai.expect,
    SimpleValidateObject = require("../index");

describe("simple-validate-object",() => {

    let rule;

    before(done => {
        rule = {
            "name":               "required|string",
            "username":           "required|string",
            "admin":              "required|boolean",
            "list":               "array",
            "age":                "number",
            "timestamp":          "date",
            "timestampInt":       "number|date",
            "parant.name":        "required|string",
            "parant.parant.name": "required|string"
        };
        done();
    });

    it("should pass validate",done => {
        let
            obj = {
                name: "Lucas",
                username: "lucasmessias.dev@gmail.com",
                admin: true,
                list: [],
                age: 27,
                timestamp: "2017-01-01",
                parant: {
                    name: "Test2",
                    parant: {
                        name: "Test3"
                    }
                }
            };

        let
            validator = new SimpleValidateObject(),
            err = validator.validate(rule, obj);
            
        expect(err.errors).to.be.a("object");
        expect(err.isValid).to.be.eq(true);
        expect(err.errors.name).to.not.exist;       //jshint ignore:line
        expect(err.errors.username).to.not.exist;   //jshint ignore:line
        expect(err.errors.admin).to.not.exist;      //jshint ignore:line
        expect(err.errors.parant).to.not.exist;     //jshint ignore:line
        done();
    });

    it("should get a error required",done => {
        let
            obj = {
                username: "lucasmessias.dev@gmail.com",
                admin: true,
                list: [],
                age: 27,
                timestamp: "2017-01-01",
                parant: {
                    name: "Test2",
                    parant: {
                        name: "Test3"
                    }
                }
            };

        let
            validator = new SimpleValidateObject(),
            err = validator.validate(rule, obj);

        expect(err.isValid).to.be.eq(false);
        expect(err.errors).to.be.a("object");
        expect(err.errors.name).to.have.members(["required"]);
        done();
    });
    
    it("should get a error string",done => {
        let
            obj = {
                name: true,
                username: "lucasmessias.dev@gmail.com",
                admin: true,
                list: [],
                age: 27,
                timestamp: "2017-01-01",
                parant: {
                    name: "Test2",
                    parant: {
                        name: "Test3"
                    }
                }
            };

        let
            validator = new SimpleValidateObject(),
            err = validator.validate(rule, obj);

        expect(err.isValid).to.be.eq(false);
        expect(err.errors).to.be.a("object");
        expect(err.errors.name).to.have.members(["string"]);
        done();
    });
    
    it("should get a error number",done => {
        let
            obj = {
                name: "Lucas",
                username: "lucasmessias.dev@gmail.com",
                list: [],
                age: "=D",
                timestamp: "2017-01-01",
                parant: {
                    name: "Test2",
                    parant: {
                        name: "Test3"
                    }
                }
            };

        let
            validator = new SimpleValidateObject(),
            err = validator.validate(rule, obj);

        expect(err.isValid).to.be.eq(false);
        expect(err.errors).to.be.a("object");
        expect(err.errors.age).to.have.members(["number"]);
        done();
    });
    
    it("should get a error boolean",done => {
        let
            obj = {
                name: "Lucas",
                username: "lucasmessias.dev@gmail.com",
                admin: "=D",
                list: [],
                age: 27,
                timestamp: "2017-01-01",
                parant: {
                    name: "Test2",
                    parant: {
                        name: "Test3"
                    }
                }
            };

        let
            validator = new SimpleValidateObject(),
            err = validator.validate(rule, obj);

        expect(err.isValid).to.be.eq(false);
        expect(err.errors).to.be.a("object");
        expect(err.errors.admin).to.have.members(["boolean"]);
        done();
    });
    
    it("should get a error date",done => {
        let
            obj = {
                name: "Lucas",
                username: "lucasmessias.dev@gmail.com",
                admin: true,
                list: [],
                age: 27,
                timestamp: "=D",
                parant: {
                    name: "Test2",
                    parant: {
                        name: "Test3"
                    }
                }
            };

        let
            validator = new SimpleValidateObject(),
            err = validator.validate(rule, obj);

        expect(err.isValid).to.be.eq(false);
        expect(err.errors).to.be.a("object");
        expect(err.errors.timestamp).to.have.members(["date"]);
        done();
    });
    
    it("should get a error array",done => {
        let
            obj = {
                name: "Lucas",
                username: "lucasmessias.dev@gmail.com",
                admin: true,
                list: {},
                age: 27,
                timestamp: "=D",
                parant: {
                    name: "Test2",
                    parant: {
                        name: "Test3"
                    }
                }
            };

        let
            validator = new SimpleValidateObject(),
            err = validator.validate(rule, obj);

        expect(err.isValid).to.be.eq(false);
        expect(err.errors).to.be.a("object");
        expect(err.errors.list).to.have.members(["array"]);
        done();
    });
    
    it("should get double error",done => {
        let
            obj = {
                name: "Lucas",
                username: "lucasmessias.dev@gmail.com",
                admin: true,
                list: [],
                age: 27,
                timestampInt: "=D",
                timestamp: "2017-01-01",
                parant: {
                    name: "Test2",
                    parant: {
                        name: "Test3"
                    }
                }
            };

        let
            validator = new SimpleValidateObject(),
            err = validator.validate(rule, obj);

        expect(err.isValid).to.be.eq(false);
        expect(err.errors).to.be.a("object");
        expect(err.errors.timestampInt).to.have.members(["date","number"]);
        done();
    });

});