import { createFeature, createReducer, on } from '@ngrx/store';
import { Post, PostComment } from '../post.interface';
import { commentsActions, postsActions } from './actions';

export interface PostsState {
  posts: Post[];
  comments: Record<string, PostComment[]>;
}

const initialState: PostsState = {
  posts: [],
  comments: {}
};

export const postsFeature = createFeature({
  name: 'postsFeature',
  reducer: createReducer(
    initialState,
    on(postsActions.postsLoaded, (state, payload) => {
      return {
        ...state,
        posts: payload.postsList
      };
    }),
    on(commentsActions.commentsLoaded, (state, { comments }) => {
      return {
        ...state,
        comments
      };
    })
  )
});
