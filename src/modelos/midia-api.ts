export interface FotoPexelsApi {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  alt: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

export interface RespostaBuscaPexels {
  page: number;
  per_page: number;
  total_results?: number;
  photos: FotoPexelsApi[];
}

