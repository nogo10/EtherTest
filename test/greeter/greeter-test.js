/*
 * Testing for ${home}/contract/[yourContract].sol
 */
var _ = require('lodash');
var assert = require('assert');
var SolidityFunction = require('web3/lib/web3/function');
var ethTx = require('ethereumjs-tx');
var Sandbox = require('ethereum-sandbox-client');
var helper = require('ethereum-sandbox-helper');
var log = console.log;
var async = require('async');
var start = new Date().getTime();
/*
ENTER YOUR .SOL FILE NAME IN VARIABLES BELOW THIS LINE
-----------------------------------------------------------------*/

var yourContract = 'greeter'; // <---- here eg. this is for 'greeter.sol' in contract dir.
var arg = 'koko'; // <---- here eg. greeter this is for the arg passed to contract creation -if needed

/*---------------------------------------------------------------
ENTER YOUR .SOL FILE NAME and creation args IN VARIABLES ABOVE THIS LINE
*/

describe('yourContract Suite', function() {

	// init sandbox
	this.timeout(60000);
	var sandbox = new Sandbox('http://localhost:8554');

	// compile the contract
	var compiled = helper.compile('./contract', [yourContract + '.sol']);


	before(function(done) {
		sandbox.start(__dirname + '/ethereum.json', done);
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

		sandbox.web3.eth.contract(JSON.parse(compiled.contracts[yourContract].interface)).new(arg, {

				/* contract user */
				from: "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826",


				/* contract bytecode */
				data: '0x' + compiled.contracts[yourContract].bytecode
			},

			function(err, contract) {

				if (err) {
					done(err);
				}
				else if (contract.address) {

					// save reference to deployed contract
					yourContract = contract;
					log(yourContract.address);

					done();
				}
			});

	});

	/*
	TestCase: yourContract
	Description: test call to yourContract_function() below this line----------
  */

	it('check-Tx', function(done) {
		log(" [check-Tx]");

		/* Constant call no transaction required */
		var check2 = yourContract.greet();
		log(check2);
		assert.equal(check2, "koko");
		done();
	});

	//test call to yourContract_function() above this line---------------------




	/*
	TestCase: yourContract
	Description: test Tx to yourContract_function() below this line----------
  */

	it('test send Tx  to yourContract', function(done) {
		log(" [test tx to yourContract]");

		var funcABI = {
			"constant": false,
			"inputs": [{
				"name": "x",
				"type": "string"
			}],
			"name": "set",
			"outputs": [],
			"type": "function"
		};
		var func = new SolidityFunction(sandbox.web3, funcABI, yourContract.address);
		var callData = func.toPayload(['okee!!!']).data;

		sandbox.web3.eth.sendTransaction({
			from: "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826",
			to: yourContract.address,
			gas: 20000,
			data: callData,
			value: sandbox.web3.toWei(1, 'ether'),
		}, function(err, txHash) {
			if (err) return done(err);

			// we are waiting for blockchain to accept the transaction 
			helper.waitForReceipt(sandbox.web3, txHash, function() {

				log(" [test call to yourContract]");
				var check1 = yourContract.greet();
				// assert that greeeting changed
				log(check1);
				assert.equal(check1, "okee!!!");


			});
		});
		done();
	});
	//test Tx to yourContract_function() above this line-----------------------






	after(function(done) {
		sandbox.stop(done);
	});
});