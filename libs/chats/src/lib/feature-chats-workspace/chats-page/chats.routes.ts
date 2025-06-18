import { Route } from '@angular/router';

import { ChatWorkspaceComponent } from '../chat-workspace/chat-workspace.component';
import { ChatsPageComponent } from './chats-page.component';

export const chatsRouters: Route[] = [
  {
    path: '',
    component: ChatsPageComponent,
    children: [
      {
        path: ':id',
        component: ChatWorkspaceComponent,
      },
    ],
  },
];
