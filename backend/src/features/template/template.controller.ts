import { Request, Response } from 'express';
import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: "feature:template:controller" });
import { TemplateService } from './services/template.service.js';
import yaml from 'js-yaml';

export class TemplateController {
  private readonly service = new TemplateService();

  public getMany = async (req: Request, res: Response): Promise<void> => {
    try {
      const type = req.params.type;
      const templates = await this.service.findMany(type);
      res.status(200).json(templates);
    } catch (error) {
      log.error('Error retrieving templates:', error);
      res.status(500).json({ message: 'Error retrieving templates' });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const template = await this.service.findById(id);

      if (template) {
        res.status(200).json(template);
      } else {
        res.status(404).json({ message: `Template with id ${id} not found.` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving template' });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const newTemplate = await this.service.create(req.body);
      res.status(201).json(newTemplate);
    } catch (error) {
      res.status(500).json({ message: 'Error creating template' });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      // const { text } = req.body;
      // const updatedTemplate = await this.service.update(id, {
      //   ...req.body,
      //   yamlTemplate: req.body.text
      // });
      const updatedTemplate = await this.service.update(id, req.body);
      res.status(200).json(updatedTemplate);
    } catch (error) {
      log.error('Error updating template:', error);
      res.status(500).json({ message: 'Error updating template' });
    }
  };

  public updateYaml = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const { text } = req.body;

      const updatedTemplate = await this.service.updateYamlTemplate(id, text);
      res.status(200).json({
        ...updatedTemplate,
        yamlTemplate: text.replace(/\\n/g, '')
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating template YAML' });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const deletedTemplate = await this.service.delete(id);
      res.status(200).json(deletedTemplate);
    } catch (error) {
      res.status(500).json({ message: 'Error deleting template' });
    }
  };

  public verify = async (req: Request, res: Response): Promise<void> => {
    const { yamlTemplate } = req.body;
    log.debug('====== text ======\n', yamlTemplate, '\n====== text ended ======');

    try {
      const result = yaml.load(yamlTemplate);
      log.info('yaml is OK');
      res.json(result);
    } catch (e) {
      log.error('yaml error', e);
      res.status(400).json({
        error: e
      });
    }
  };

  public getFirst = async (req: Request, res: Response): Promise<void> => {
    try {
      const type = req.params.type;
      const template = await this.service.findFirst(type);

      if (template) {
        res.status(200).json(template);
      } else {
        res.status(404).json({ message: `Template of type ${type} not found.` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving template' });
    }
  };
}
