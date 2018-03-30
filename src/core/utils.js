import { DraftEntity, convertToRaw } from 'draft-js';

export const getSelectionRect = (selected) => {

	const _rect = selected.getRangeAt(0).getBoundingClientRect();
	let rect = _rect && _rect.top ? _rect : selected.getRangeAt(0).getClientRects()[0];

	if (!rect) {
		if (selected.anchorNode && selected.anchorNode.getBoundingClientRect) {
			rect = selected.anchorNode.getBoundingClientRect();
			rect.isEmptyline = true;
		} else {
			return null;
		}
	}

	return rect;
};

export const getSelection = (window) => {

	if (window.getSelection) {
		return window.getSelection();
	} else if (window.document.getSelection) {
		return window.document.getSelection();
	} else if (window.document.selection) {
		return window.document.selection.createRange().text;
	}

	return null;
};

export const getCurrentBlock = (editorState) => {

	const selectionState = editorState.getSelection();
	const contentState = editorState.getCurrentContent();

	return contentState.getBlockForKey(selectionState.getStartKey());
};

export const findEntities = (contentState, type) => {

	const rawState = convertToRaw(contentState);
	const entityMap = rawState.entityMap;

	let comments = [];

	Object.keys(entityMap).forEach(function (storageKey) {
		const encodedEntity = entityMap[storageKey];
		if (encodedEntity.type === type) {
			comments.push(encodedEntity.data);
		}
	});

	return comments;

	//TODO! below is a bit more elegant way of retrieving entities from the content state.
	//TODO! It requires an efficient sorting algorithm.

	/*let comments = [];

	contentState.getBlockMap().forEach((block) => {
		block.findEntityRanges(
			(character) => {
				const entityKey = character.getEntity();
				return (
					entityKey !== null &&
					contentState.getEntity(entityKey).getType() === type
				);
			},
			start => {
				let comment = contentState.getEntity(block.getEntityAt(start)).getData();
				comment.key = block.getEntityAt(start)-1;
				comments[block.getEntityAt(start)-1] = comment;
			});
	});

	return comments;*/
};

/**
 * Checks if the selected text is assigned a comment.
 */
export const checkEntity = (editorState, type) => {

	const selectionState = editorState.getSelection();
	const content = editorState.getCurrentContent();

	if (!selectionState.isCollapsed()) {

		const currentBlock = getCurrentBlock(editorState);

		if (!currentBlock) {
			return null;
		}

		const entityKey = currentBlock.getEntityAt(0);

		if (entityKey !== null) {

			const blockKey = currentBlock.getKey();

			const entity = content.getEntity(entityKey);

			if (entity.getType() === type) {
				return {
					entityKey,
					blockKey,
					data: entity.getData(),
				};
			}
		}
	}

	return null;
};