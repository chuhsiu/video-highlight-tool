export interface Section {
  sectionId: number;
  title: string;
  transcripts: string;
  highlights: Highlight[];
}

export interface Highlight {
  id: number;
  time: number;
  text: string;
}
