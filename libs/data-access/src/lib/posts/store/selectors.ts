import { createSelector } from '@ngrx/store';
import { postsFeature } from './reducer';
import { Post, PostComment } from '../post.interface';

export const selectPosts = createSelector(
  postsFeature.selectPosts,
  (posts: Post[]) => {
    return posts;
  }
);

export const selectComments = createSelector(
  postsFeature.selectComments,
  (comments: Record<string, PostComment[]>) => {
    return comments;
  }
);
