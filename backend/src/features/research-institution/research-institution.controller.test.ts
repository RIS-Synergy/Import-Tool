import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { ResearchInstitutionController } from './research-institution.controller.js';
import { ResearchInstitutionService } from './services/research-institution.service.js';
import { Request, Response } from 'express';
import { ResearchInstitution } from './research-institution.model.js';

vi.mock('./services/research-institution.service', () => {
  const mockResearchInstitutionService = {};
  return { ResearchInstitutionService: vi.fn(() => mockResearchInstitutionService) };
});

describe('ResearchInstitutionController', () => {
  let researchInstitutionController: ResearchInstitutionController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockResearchInstitutionService: any;

  beforeEach(() => {
    mockResearchInstitutionService = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
    };

    (ResearchInstitutionService as Mock).mockImplementation(() => mockResearchInstitutionService);

    researchInstitutionController = new ResearchInstitutionController();
    mockRequest = {};
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it('getAllResearchInstitutions should return institutions with a 200 status', async () => {
    const mockInstitutions: ResearchInstitution[] = [
      {
        id: 1,
        name: 'Test Institution',
        domain: 'test.edu',
        rorId: 'https://ror.org/12345',
        createdDate: new Date(),
        modifiedDate: new Date()
      }
    ];
    mockResearchInstitutionService.findAll.mockResolvedValue(mockInstitutions);

    await researchInstitutionController.getAllResearchInstitutions(mockRequest as Request, mockResponse as Response);

    expect(mockResearchInstitutionService.findAll).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockInstitutions);
  });

  it('createResearchInstitution should return the new institution with a 201 status', async () => {
    const newInstitutionInput = { name: 'New Institution', domain: 'new.edu', rorId: 'https://ror.org/67890' };
    const createdInstitution: ResearchInstitution = {
      id: 1,
      name: 'New Institution',
      domain: 'new.edu',
      rorId: 'https://ror.org/67890',
      createdDate: new Date(),
      modifiedDate: new Date()
    };
    mockRequest.body = newInstitutionInput;
    mockResearchInstitutionService.create.mockResolvedValue(createdInstitution);

    await researchInstitutionController.createResearchInstitution(mockRequest as Request, mockResponse as Response);

    expect(mockResearchInstitutionService.create).toHaveBeenCalledWith(newInstitutionInput);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(createdInstitution);
  });

  describe('getResearchInstitutionById', () => {
    it('should return an institution with a 200 status', async () => {
      const mockInstitution = {
        id: 1,
        name: 'Test Institution',
        domain: 'test.edu',
        rorId: 'https://ror.org/12345'
      };
      mockRequest.params = { id: '1' };
      mockResearchInstitutionService.findById.mockResolvedValue(mockInstitution);

      await researchInstitutionController.getResearchInstitutionById(mockRequest as Request, mockResponse as Response);

      expect(mockResearchInstitutionService.findById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockInstitution);
    });

    it('should return a 404 status if institution is not found', async () => {
      mockRequest.params = { id: '99' };
      mockResearchInstitutionService.findById.mockResolvedValue(null);

      await researchInstitutionController.getResearchInstitutionById(mockRequest as Request, mockResponse as Response);

      expect(mockResearchInstitutionService.findById).toHaveBeenCalledWith(99);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Research institution with id 99 not found.' });
    });

    it('should return a 500 status on error', async () => {
      mockRequest.params = { id: '1' };
      mockResearchInstitutionService.findById.mockRejectedValue(new Error('DB Error'));

      await researchInstitutionController.getResearchInstitutionById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error retrieving research institution' });
    });
  });

  describe('error handling', () => {
    it('getAllResearchInstitutions should return 500 on error', async () => {
      mockResearchInstitutionService.findAll.mockRejectedValue(new Error('Something went wrong'));

      await researchInstitutionController.getAllResearchInstitutions(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error retrieving research institutions' });
    });

    it('createResearchInstitution should return 500 on error', async () => {
      const newInstitutionInput = { name: 'New Institution', address: '456 New St' };
      mockRequest.body = newInstitutionInput;
      mockResearchInstitutionService.create.mockRejectedValue(new Error('Failed to create'));

      await researchInstitutionController.createResearchInstitution(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error creating research institution' });
    });
  });
});
