import { Meta } from '@engineers/ngx-utils';

// todo: inject Location to get baseUrl
export const meta: Meta = {
  name: 'Todo App',
  baseUrl: typeof location === 'undefined' ? undefined : location.origin,
  description: 'A simple todo reminder app',
  image: 'assets/images/todo.png',
};
