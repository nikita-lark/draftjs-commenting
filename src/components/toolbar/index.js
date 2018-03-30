import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import InsertCommentIcon from 'material-ui/svg-icons/editor/insert-comment';

import Comment from '../comment';

import { getSelection, getSelectionRect, checkEntity } from '../../core/utils';
import { Entity } from '../../core/constants';

import style from './style.scss';

/**
 * A component representing a toolbar. Currently it only contains Comment button. Can be extended.
 */
class Toolbar extends Component {

	constructor(props) {

		super(props);

		this.state = {
			showForm: false,
			comment: {author: 'me'}
		};

		this.onCommentBtnClick = this.onCommentBtnClick.bind(this);
		this.onCommentSubmit = this.onCommentSubmit.bind(this);
		this.onCommentCancel = this.onCommentCancel.bind(this);
	}

	componentWillReceiveProps(newProps) {

		const {editorState} = newProps;
		const selectionState = editorState.getSelection();

		if (selectionState.isCollapsed()) {
			this.setState({
				showForm: false
			});
		}
	}

	componentDidUpdate() {

		const selectionState = this.props.editorState.getSelection();
		if (selectionState.isCollapsed()) {
			return;
		}

		// eslint-disable-next-line no-undef
		const nativeSelection = getSelection(window);
		if (!nativeSelection.rangeCount) {
			return;
		}

		// selection
		const selectionBoundary = getSelectionRect(nativeSelection);

		// editor
		// eslint-disable-next-line react/no-find-dom-node
		const editorNode = ReactDOM.findDOMNode(this).parentNode;
		const editorBoundary = editorNode.getBoundingClientRect();

		// toolbar
		// eslint-disable-next-line react/no-find-dom-node
		const toolbarNode = ReactDOM.findDOMNode(this);
		//const toolbarBoundary = toolbarNode.getBoundingClientRect();

		// get the absolute position of the selection
		const selectionAbsolutePos = selectionBoundary.top - editorBoundary.top + editorNode.offsetTop;
		// locate toolbar a bit higher than the selected text
		let toolbarTop = selectionAbsolutePos - 20;
		toolbarNode.style.top = `${toolbarTop}px`;

		if (window.innerWidth < 768) {
			// put the toolbar below the selection
			toolbarNode.style.top = `${toolbarTop+selectionBoundary.height}px`;
		}
	}

	onCommentBtnClick() {

		const {editorState} = this.props;
		const comment = checkEntity(editorState, Entity.COMMENT);

		this.setState({
			showForm: true,
			comment: comment !== null ? comment : this.state.comment
		});

		this.commentNode.focus();
	}

	onCommentSubmit(comment) {

		this.props.editorNode.addComment(comment.text);

		this.setState({
			showForm: false
		});
	}

	onCommentCancel() {

		this.setState({
			showForm: false
		});
	}

	render() {

		const {editorState} = this.props;
		const selectionState = editorState.getSelection();

		if (!selectionState.isCollapsed()) {

			const {showForm} = this.state;
			const formStyle = !showForm ? {display: 'none'} : {};

			return (
				<div className={style.toolbar}>
					<FloatingActionButton
						mini={true}
						onTouchTap={this.onCommentBtnClick}
						disabled={showForm}
					>
						<InsertCommentIcon />
					</FloatingActionButton>
					<div
						ref={(c) => { this.formNode = c; }}
						className={style.form}
						style={formStyle}
					>
						<Comment
							editMode={true}
							ref={(c) => { this.commentNode = c; }}
							comment={this.state.comment}
							onSubmit={this.onCommentSubmit}
							onCancel={this.onCommentCancel}
						/>
					</div>
				</div>
			);
		}

		return null;
	}
}

Toolbar.propTypes = {
	editorNode: PropTypes.object,
	editorState: PropTypes.object,
};

export default Toolbar;

