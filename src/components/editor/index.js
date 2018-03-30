import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState, RichUtils } from 'draft-js';

import decorator from './decorator';
import ToggleButton from './button';
import Toolbar from '../toolbar';
import { Entity } from '../../core/constants';

import 'draft-js/dist/Draft.css';
import './draft.css';

import style from './style.scss';

/**
 * A wrapper component for the Draft.js editor (https://draftjs.org).
 */
class MyEditor extends Component {

	constructor(props) {

		super(props);

		this.state = {
			editorState: this.props.editorState
		};

		if (!this.state.editorState) {
			this.state.editorState = EditorState.createEmpty(decorator);
		}

		this.focus = () => this.editorNode.focus();
		this.onChange = (editorState, cb) => {
			this.setState({editorState});
			this.props.onChange(editorState, cb);
		};

		this.toggleBlockType = this.toggleBlockType.bind(this);
		this.toggleInlineStyle = this.toggleInlineStyle.bind(this);

		this.addComment = this.addComment.bind(this);
	}

	toggleBlockType(blockType) {

		this.onChange(
			RichUtils.toggleBlockType(
				this.state.editorState,
				blockType
			)
		);
	}

	toggleInlineStyle(inlineStyle) {

		this.onChange(
			RichUtils.toggleInlineStyle(
				this.state.editorState,
				inlineStyle
			)
		);
	}

	/**
	 * Add a comment to the editor state.
	 *
	 * @param comment
	 */
	addComment(comment) {

		const { editorState } = this.state;
		const contentState = editorState.getCurrentContent();

		const author = 'me';
		const date = (new Date()).getTime();

		const contentStateWithEntity = contentState.createEntity(
			Entity.COMMENT,
			'MUTABLE',
			{
				author: author,
				date: date,
				text: comment,
				key: `${author}${date}`
			}
		);
		const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
		const newEditorState = EditorState.set(editorState, {currentContent: contentStateWithEntity});

		this.onChange(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey), this.focus);
	}

	render() {

		const { editorState } = this.state;

		return (
			<div className={style.container}>
				<BlockStyleControls
					editorState={editorState}
					onToggle={this.toggleBlockType}
				/>
				<InlineStyleControls
					editorState={editorState}
					onToggle={this.toggleInlineStyle}
				/>
				<div className={style.editor} >
					<Editor
						ref={(c) => { this.editorNode = c; }}
						editorState={editorState}
						handleKeyCommand={this.handleKeyCommand}
						onChange={this.onChange}
						onTab={this.onTab}
						placeholder="Tell a story..."
						spellCheck={true}
					/>
					<Toolbar
						ref={(c) => { this.toolbarNode = c; }}
						editorState={editorState}
						editorNode={this}
						focus={this.focus}
					/>
				</div>
			</div>
		);
	}
}

const BLOCK_TYPES = [
	{label: 'H1', style: 'header-one'},
	{label: 'H2', style: 'header-two'},
	{label: 'H3', style: 'header-three'},
	{label: 'H4', style: 'header-four'},
	{label: 'H5', style: 'header-five'},
	{label: 'H6', style: 'header-six'},
	{label: 'Quote', style: 'blockquote'},
	{label: 'UL', style: 'unordered-list-item'},
	{label: 'OL', style: 'ordered-list-item'},
	{label: 'Code', style: 'code-block'},
];

const BlockStyleControls = (props) => {

	const { editorState } = props;
	const selectionState = editorState.getSelection();

	const blockType =
		editorState
			.getCurrentContent()
			.getBlockForKey(selectionState.getStartKey())
			.getType();

	return (
		<div>
			{BLOCK_TYPES.map((type) =>
				<ToggleButton
					key={type.label}
					active={type.style === blockType}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			)}
		</div>
	);
};

const INLINE_STYLES = [
	{label: 'Bold', style: 'BOLD'},
	{label: 'Italic', style: 'ITALIC'},
	{label: 'Underline', style: 'UNDERLINE'},
	{label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {

	const { editorState } = props;
	let currentStyle = editorState.getCurrentInlineStyle();

	return (
		<div>
			{INLINE_STYLES.map(type =>
				<ToggleButton
					key={type.label}
					active={currentStyle.has(type.style)}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			)}
		</div>
	);
};

MyEditor.propTypes = {
	editorState: PropTypes.object,
	onChange: PropTypes.func
};

export default MyEditor;

