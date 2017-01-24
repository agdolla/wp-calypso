/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import { useSandbox } from 'test/helpers/use-sinon';
import timezonesReducer, { items as itemsReducer } from '../reducer';
import { timezonesReceiveAction } from '../actions';
import { fromApi } from 'state/data-layer/wpcom/timezones';

/**
 * Fixture data
 */
import { TIMEZONES_SYNC_DATA } from './fixture';

describe( 'reducer', () => {
	let sandbox;

	useSandbox( newSandbox => {
		sandbox = newSandbox;
		sandbox.stub( console, 'warn' );
	} );

	it( 'should export expected reducer keys', () => {
		expect( timezonesReducer( undefined, {} ) ).to.have.keys( [
			'items'
		] );
	} );

	describe( '#items()', () => {
		it( 'should default to an empty Object', () => {
			expect( itemsReducer( undefined, {} ) ).to.eql( {
				rawOffsets: [],
				timezonesByContinent: {}
			} );
		} );

		it( 'should index items state', () => {
			const initialState = undefined;
			const timezones = fromApi( TIMEZONES_SYNC_DATA );
			const action = timezonesReceiveAction( timezones );

			const expectedState = timezones;

			const newState = itemsReducer( initialState, action );

			expect( newState ).to.eql( expectedState );
		} );

		it( 'should override timezones', () => {
			const timezones = fromApi( {
				timezones_by_continent: {
					Dame: [ 'el', 'fuego' ]
				}
			} );
			const initialState = timezones;

			const action = timezonesReceiveAction( fromApi( TIMEZONES_SYNC_DATA ) );
			const expectedState = fromApi( TIMEZONES_SYNC_DATA );

			deepFreeze( initialState );

			const newState = itemsReducer( initialState, action );

			expect( newState ).to.eql( expectedState );
		} );

		it( 'should persist state', () => {
			const timezones = fromApi( TIMEZONES_SYNC_DATA );
			const initialState = timezones;
			const action = { type: 'SERIALIZE' };
			const expectedState = timezones;

			deepFreeze( initialState );

			const newState = itemsReducer( initialState, action );

			expect( newState ).to.eql( expectedState );
		} );

		it( 'should load persisted state', () => {
			const timezones = fromApi( TIMEZONES_SYNC_DATA );
			const initialState = timezones;
			const action = { type: 'DESERIALIZE' };
			const expectedState = timezones;

			deepFreeze( initialState );

			const newState = itemsReducer( initialState, action );

			expect( newState ).to.eql( expectedState );
		} );

		it( 'should not load invalid persisted state', () => {
			const timezones = { foo: 'bar' };
			const initialState = timezones;
			const action = { type: 'DESERIALIZE' };
			deepFreeze( initialState );

			const newState = itemsReducer( initialState, action );

			expect( newState ).to.eql( {
				rawOffsets: [],
				timezonesByContinent: {}
			} );
		} );
	} );
} );