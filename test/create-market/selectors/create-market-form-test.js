import {
	assert
} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import { assertions } from 'augur-ui-react-components';
import { BINARY, CATEGORICAL, SCALAR } from '../../../src/modules/markets/constants/market-types';

import * as actualStep2 from '../../../src/modules/create-market/selectors/form-steps/step-2';

let createMarketForm;
describe(`modules/create-market/selectors/create-market-form.js`, () => {
	proxyquire.noPreserveCache().noCallThru();

	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	let store,
		selector,
		test,
		steps,
		step2,
		step3,
		step4,
		step5,
		types = [ BINARY, CATEGORICAL, SCALAR ],
		returnObj = {},
		state = Object.assign({}, testState),
		componentAssertions = assertions.createMarketForm;

	store = mockStore(state);

	steps = {
		select: (formState) => true,
		errors: () => {},
		isValid: (formState) => true
	};

	step2 = sinon.stub(Object.assign({}, steps, {
		initialFairPrices: () => {}
	}));
	step2.isValid.returns(true);
	step2.select.returns(returnObj);
	step2.initialFairPrices.returns({});

	step3 = sinon.stub(Object.assign({}, steps, {
		select: (formState) => returnObj
	}));
	step3.isValid.returns(true);
	step3.select.returns(returnObj);

	step4 = sinon.stub(Object.assign({}, steps, {
		select: (formState) => returnObj
	}));
	step4.isValid.returns(true);
	step4.select.returns(returnObj);

	step5 = sinon.stub(Object.assign({}, steps));
	step5.isValid.returns(true);

	selector = proxyquire('../../../src/modules/create-market/selectors/create-market-form', {
		'../../../store': store,
		'../../create-market/selectors/form-steps/step-2': step2,
		'../../create-market/selectors/form-steps/step-3': step3,
		'../../create-market/selectors/form-steps/step-4': step4,
		'../../create-market/selectors/form-steps/step-5': step5
	});

	createMarketForm = selector.default;

	describe('step 1', () => {
		before(() => {
			test = selector.default();
		});

		after(() => {
			state.createMarketInProgress = {
				...state.createMarketInProgress,
				...test
			};
		});

		it('should init formState correctly', () => {
			assert.equal(test.step, 1, 'step is not equal to 1');
		});

		it('should deliver the correct values to components', () => {
			componentAssertions.step1(test);
		});
	});

	describe('step 2', () => {
		before(() => {
			state.createMarketInProgress = {
				step: 2,
				type: BINARY,
				initialFairPrices: {}
			};

			test = selector.default();
		});

		after(() => {
			state.createMarketInProgress = {
				...state.createMarketInProgress,
				...test,
				type: BINARY
			};
		});

		it('should have the correct state', () => {
			assert.equal(test.step, 2, 'step is not equal to 2');
		});

		it('should call select', () => {
			assert(step2.select.calledOnce, 'select is not called once');
		});
		
		it('should call isValid', () => {
			assert(step2.isValid.calledOnce, 'isValid is not called once');
		});
		
		it('should call errors', () => {
			assert(step2.errors.calledOnce, 'errors is not called once');
		});
		
		it('should call initialFairPrices', () => {
			assert(step2.initialFairPrices.calledOnce, 'initialFairPrices is not called once');
		});

		it('should deliver the correct values to components', () => {
			types.map((cV) => {
				state.createMarketInProgress = {
					...state.createMarketInProgress,
					type: cV
				};

				if(cV === SCALAR){
					state.createMarketInProgress = {
						...state.createMarketInProgress,
						scalarSmallNum: 10,
						scalarBigNum: 100
					};
				}

				let fullTestState = {
					...test,
					...state.createMarketInProgress,
					...actualStep2.initialFairPrices(state.createMarketInProgress),
					...actualStep2.select(state.createMarketInProgress)
				};

				componentAssertions.step2(fullTestState);
			});
		});
	});
	
	describe('step 3', () => {
		before(() => {
			state.createMarketInProgress.step = 3;

			test = selector.default();
		});

		after(() => {
			state.createMarketInProgress = {
				...state.createMarketInProgress,
				...test
			};
		});
		
		it('should have the correct state', () => {
			assert.equal(test.step, 3, 'step is not equal to 3');
		});
		
		it('should call select', () => {
			assert(step3.select.calledOnce, 'select is not called once');
		});
		
		it('should call isValid', () => {
			assert(step3.isValid.calledOnce, 'isValid is not called once');
		});

		it('should call errors', () => {
			assert(step3.errors.calledOnce, 'errors is not called once');
		});
	});

	describe('step 4', () => {
		before(() => {
			state.createMarketInProgress.step = 4;

			test = selector.default();
		});

		after(() => {
			state.createMarketInProgress = {
				...state.createMarketInProgress,
				...test
			};
		});

		it('should have the correct state', () => {
			assert.equal(test.step, 4, 'step is not equal to 3');
		});

		it('should call select', () => {
			assert(step4.select.calledOnce, 'select is not called once');
		});

		it('should call isValid', () => {
			assert(step4.isValid.calledOnce, 'isValid is not called once');
		});

		it('should call errors', () => {
			assert(step4.errors.calledOnce, 'errors is not called once');
		});
	});
	
	describe('step 5', () => {
		before(() => {
			state.createMarketInProgress.step = 5;

			test = selector.default();
		});

		it('should call select', () => {
			assert(step5.select.calledOnce, 'select is not called once');
		});
	});
});

export default createMarketForm;