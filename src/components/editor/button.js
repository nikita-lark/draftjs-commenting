import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

class ToggleButton extends Component {

	constructor(props) {

		super(props);

		this.onToggle = () => {
			this.props.onToggle(this.props.style);
		};
	}

	render() {
		return (
			<FlatButton
				label={this.props.label}
				secondary={this.props.active}
				onTouchTap={this.onToggle}
				style={{minWidth:'inherit'}}
			/>
		);
	}
}

ToggleButton.propTypes = {
	style: PropTypes.string,
	label: PropTypes.string.isRequired,
	active: PropTypes.bool,
	onToggle: PropTypes.func,
};

export default ToggleButton;