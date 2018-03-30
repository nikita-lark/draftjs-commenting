import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';
import scrollToElement from 'scroll-to-element';

import style from './style.scss';

/**
 * A card component which exposes a comment.
 * http://www.material-ui.com/#/components/card
 */
class Comment extends Component {

	constructor(props) {

		super(props);

		this.state = {
			comment: this.props.comment
		};

		this.focus = () => this.textFieldNode.focus();

		this.onSubmit = () => {
			this.props.onSubmit(this.state.comment);
		};

		this.onCancel = () => {
			this.props.onCancel();
		};

		this.onTextFieldChange = this.onTextFieldChange.bind(this);
		this.onLocateClick = this.onLocateClick.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	onTextFieldChange(e) {
		const comment = this.state.comment;
		comment.text = e.target.value;
		this.setState({comment: comment});
	}

	onLocateClick() {
		const element = document.querySelector(`#_${this.state.comment.key}`);
		scrollToElement(element, {
			offset: -10,
			ease: 'linear',
			duration: 500
		});
	}

	onKeyDown(e) {
		// if the Esc button is clicked
		if (e.which === 27) {
			this.onCancel(e);
		}
	}

	render() {

		if (this.props.editMode) {

			return (
				<Card className={style.comment}>
					<CardHeader
						title={this.state.comment.author}
						subtitle="now"
						avatar="http://lorempixel.com/80/80"
					/>
					<CardText>
						<TextField
							ref={(node) => { this.textFieldNode = node; }}
							hintText="comment..."
							multiLine={true}
							onChange={this.onTextFieldChange}
							onKeyDown={this.onKeyDown}
						/>
					</CardText>
					<CardActions>
						<FlatButton
							label="Comment"
							primary={true}
							onTouchTap={this.onSubmit}
						/>
						<FlatButton
							label="Cancel"
							secondary={true}
							onTouchTap={this.onCancel}
						/>
					</CardActions>
				</Card>
			);
		}

		return (
			<Card className={style.comment}>
				<CardHeader
					title={ this.state.comment.author }
					subtitle={ moment(this.state.comment.date).fromNow() }
					avatar="http://lorempixel.com/80/80"
				/>
				<CardText>
					{ this.state.comment.text }
				</CardText>
				<CardActions>
					<FlatButton
						label="Locate"
						onTouchTap={this.onLocateClick}
					/>
				</CardActions>
			</Card>
		);
	}
}

Comment.propTypes = {
	comment: PropTypes.shape({
		author: PropTypes.string,
		date: PropTypes.number,
		text: PropTypes.string
	}).isRequired,
	editMode: PropTypes.bool,
	onSubmit: PropTypes.func,
	onCancel: PropTypes.func
};

export default Comment;
