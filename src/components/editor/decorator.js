import { CompositeDecorator } from 'draft-js';
import { CommentEntity, findCommentEntities } from '../../entities/comment';

/**
 * Please, check about decorators here: https://draftjs.org/docs/advanced-topics-decorators.html
 */
export default new CompositeDecorator([{
	strategy: findCommentEntities,
	component: CommentEntity,
}]);