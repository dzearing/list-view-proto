import {
  FacetType,
  ILinkFacet,
  ITextFacet,
  IImageFacet,
  IDateFacet
} from '../interfaces';

export const textFacet = (text: string): ITextFacet => ({
  type: FacetType.text,
  text
});

export const linkFacet = (text: string, href: string): ILinkFacet => ({
  type: FacetType.link,
  text,
  href
});

export const dateFacet = (date: string): IDateFacet => ({
  type: FacetType.date,
  date: new Date(date)
});

export const imageFacet = (src: string): IImageFacet => ({
  type: FacetType.image,
  src
});
