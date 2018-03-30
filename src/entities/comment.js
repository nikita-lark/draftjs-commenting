import React from 'react';

import { Entity } from '../core/constants';

/**
 * More info about Entities can be found here:
 * https://draftjs.org/docs/api-reference-entity.html#content
 */

export const findCommentEntities = (contentBlock, callback, contentState) => {
	contentBlock.findEntityRanges(
		(character) => {
			const entityKey = character.getEntity();
			return (
				entityKey !== null &&
				contentState.getEntity(entityKey).getType() === Entity.COMMENT
			);
		},
		callback
	);
};

/**
 * A stateless comment component which is used by the editor.
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
export const CommentEntity = (props) => {

	const { contentState, entityKey } = props;
	const { author, date, text, key } = contentState.getEntity(entityKey).getData();

	return (
		<comment
			id={`_${key}`}
			data={{
				author: author,
				date: date,
				text: text
			}}
		>
			{props.children}
		</comment>
	);
};
