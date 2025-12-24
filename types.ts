
export enum CommContext {
  CUSTOMER_REPLY = 'CUSTOMER_REPLY',
  INTERNAL_BOSS = 'INTERNAL_BOSS',
  INTERNAL_TEAM = 'INTERNAL_TEAM',
  FORMAL_ANNOUNCEMENT = 'FORMAL_ANNOUNCEMENT'
}

export enum Tone {
  PROFESSIONAL = 'PROFESSIONAL',
  EMPATHETIC = 'EMPATHETIC',
  DIRECT = 'DIRECT',
  HUMBLE = 'HUMBLE'
}

export interface TransformationResult {
  revisedText: string;
  tips: string[];
  toneAnalysis: {
    professionalism: number;
    clarity: number;
    warmth: number;
  };
}

export interface BrandConfig {
  name: string;
  coreValues: string;
}
