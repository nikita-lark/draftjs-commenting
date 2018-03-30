import 'babel-polyfill';

import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Card, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

import MyEditor from '../editor';
import decorator from '../editor/decorator';
import Comment from '../comment';
import { findEntities } from '../../core/utils';
import { Entity } from '../../core/constants';

import style from './style.scss';

import defaulState from '../../data/editor_default_state.js';

injectTapEventPlugin();

export default class App extends Component {

	constructor(props) {

		super(props);

		this.state = {
			comments: [],
			editorState: EditorState.createEmpty(decorator)
		};

		// check if there is something in the local storage
		if (window.localStorage['editor']) {

			try {
				const rawState = JSON.parse(window.localStorage['editor']);
				this.state.editorState = EditorState.createWithContent(convertFromRaw(rawState), decorator);
			}
			catch (e) {
				// TODO! handle properly
				// eslint-disable-next-line no-console
				console.log(e);
			}

		} else {

			// the default state
			this.state.editorState = EditorState.createWithContent(convertFromRaw(defaulState), decorator);
		}

		this.state.comments = findEntities(
			this.state.editorState.getCurrentContent(),
			Entity.COMMENT
		);

		this.onChange = (editorState, callback) => {

			this.setState({
				editorState: editorState
			}, () => {
				if (callback) {
					callback();
				}
			});

			// Update the comments just once after the editor state is changed.
			// The update is done in 500ms.
			clearTimeout(this.timeout);
			this.timeout = setTimeout((() => {
				const comments = findEntities(editorState.getCurrentContent(), Entity.COMMENT);
				this.setState({
					comments: comments
				});
			}).bind(this), 500);
		};

		this.saveBtnClick = this.saveBtnClick.bind(this);
	}

	saveBtnClick() {
		// save the content to the local storage
		window.localStorage['editor'] = JSON.stringify(
			convertToRaw(this.state.editorState.getCurrentContent())
		);
	}

	render() {
		return (
			<MuiThemeProvider>
				<div className={style.container}>
					<div className={style.grid}>
						<div className={style.column1}>
							<Card>
								<MyEditor
									editorState={this.state.editorState}
									onChange={this.onChange}
								/>
								<CardActions>
									<FlatButton
										primary={true}
										label="Save to Local Storage"
										onTouchTap={this.saveBtnClick}
									/>
								</CardActions>
							</Card>
						</div>
						<div className={style.column2}>
							{
								this.state.comments.map(
									comment => (
										<Comment
											key={`${comment.key}`}
											comment={comment}
										/>
									)
								)
							}
						</div>
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}
