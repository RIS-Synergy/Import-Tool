import { Template as PrismaTemplate, TemplateType } from '@prisma/client';

export type Template = PrismaTemplate;

export type TemplateCreationParams = Omit<Template, 'id' | 'createdDate' | 'modifiedDate'> & {
  templateType: 'project' | 'application' | 'award';
};

export type TemplateUpdateParams = Partial<TemplateCreationParams>;
