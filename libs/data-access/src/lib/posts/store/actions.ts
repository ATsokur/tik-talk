import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  CommentCreateDto,
  Post,
  PostComment,
  PostCreateDto
} from '../post.interface';

export const postsActions = createActionGroup({
  source: 'posts',
  events: {
    'fetch posts': emptyProps(),
    'posts loaded': props<{ postsList: Post[] }>(),
    'create post': props<{ postPayload: PostCreateDto }>()
  }
});

export const commentsActions = createActionGroup({
  source: 'comments',
  events: {
    'comments loaded': props<{ comments: Record<string, PostComment[]> }>(),
    'create comment': props<{ payload: CommentCreateDto }>()
  }
});
