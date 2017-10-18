import { ISetActions, IBreadcrumb } from '../interfaces';

export const createTextCrumb = (text: string): IBreadcrumb => ({ key: text, text });

export const createLinkCrumb = (text: string, setKey: string, actions: ISetActions): IBreadcrumb => ({
  key: text,
  text,
  onClick: () => actions.openSet(setKey)
//   href: `#${setKey}` // getNavLink(setKey)
});
