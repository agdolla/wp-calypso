/**
 * External dependencies
 */
import React from 'react';
import { noop } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import SelectDropdown from 'components/select-dropdown';

class FollowingManageSortControls extends React.Component {

	static propTypes = {
		onSelectChange: React.PropTypes.func,
		sortOrder: React.PropTypes.oneOf( [ 'date-followed', 'alpha' ] ),
	}

	static defaultProps = {
		onSelectChange: noop,
	}

	handleSelectChange = ( option ) => {
		this.props.onSelectChange( option );
	}

	render() {
		const sortOrder = this.props.sortOrder;
		const options = [
			{ value: 'date-followed', label: 'Sort by date' },
			{ value: 'alpha', label: 'Sort by name' },
		];

		return (
			<SelectDropdown
				compact
				className="following-manage__sort-controls"
				options={ options }
				initialSelected={ sortOrder }
				onSelect={ this.handleSelectChange } />
		);
	}
}

export default localize( FollowingManageSortControls );
