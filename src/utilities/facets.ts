export const textFacet = (text: string) => ({ type: 'text', text });

export const linkFacet = (text: string, href: string) => ({
  type: 'link',
  text,
  href
});

export const imageFacet = (url: string) => ({ type: 'image', url });
