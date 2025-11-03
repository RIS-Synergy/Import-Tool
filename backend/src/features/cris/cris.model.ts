import { CRIS as PrismaCRIS } from '@prisma/client';

export type CRIS = PrismaCRIS;

export type Upload = {
  ris: string;
  settings: Record<string, any>;
  uuid: string;
  templateId: number;
  entity: string;
}

export type CrisError = {
}
