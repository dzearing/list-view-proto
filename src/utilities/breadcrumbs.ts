import { IBreadcrumb } from '../interfaces';

export const createTextCrumb = (text: string): IBreadcrumb => ({ key: text, text });

export const createLinkCrumb = (text: string, setKey: string): IBreadcrumb => ({
  key: text,
  text,
  href: `#${setKey}` // getNavLink(setKey)
});
