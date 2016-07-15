/*
 * Testing for ${home}/contract/[yourContract].sol
 */
var _ = require('lodash');
var assert = require('assert');
var SolidityFunction = require('web3/lib/web3/function');
var ethTx = require('ethereumjs-tx');
var Sandbox = require('ethereum-sandbox-client');
var helper = require('ethereum-sandbox-helper');
var log    = console.log;

/*
ENTER YOUR .SOL FILE NAME IN VARIABLES BELOW THIS LINE
-----------------------------------------------------------------*/

var yourContract =  'math'; // <---- here edit put name without the '.sol'
/*---------------------------------------------------------------
ENTER YOUR .SOL FILE NAME IN VARIABLES ABOVE THIS LINE
*/

describe('yourContract Suite', function() {

  // init sandbox
  this.timeout(60000);
  var sandbox = new Sandbox('http://localhost:8554');
  
  // compile the contract
  var compiled = helper.compile('~/ethereum-testing-reference/contract', [yourContract + '.sol']);
  //var yourContract;
  
  
  before(function(done) {
    sandbox.start(__dirname + yourContract + '/ethereum.json', done);
  });
  
  
  /*
    TestCase: test-deploy 
	Description: deploying the contract, 
	 validating that the deployment was good.
	 The deployed contract will be used for 
	 contract call testing in the following 
	 test cases.
  */
  it('test-deploy', function(done) {
	    log(" [test-deploy]");
	  
		sandbox.web3.eth.contract(JSON.parse(compiled.contracts[yourContract].interface)).new({
			  
			  /* contract seller */ 
			   from: "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826",
			  

			  /* contract bytecode */ 
			  data: '0x' + compiled.contracts[yourContract].bytecode			
		}, 
		  
		function(err, contract) {
				
			if (err) {
				done(err);
			}
			else if (contract.address){
				
                // save reference to deployed contract
                yourContract = contract; log(yourContract.address)
				done();
			}			
		});	  
	  
  });
  
  
  /*
	TestCase: yourContract
	Description: test call to yourContract_function().
  */
  
   
  
//inscription('someParam1', {value: 200, gas: 2000});
  
 //read state then compare assert

//var result = inscription.text;
//assert ('SomeParam1'==result);
  
  after(function(done) {
    sandbox.stop(done);
  });
});