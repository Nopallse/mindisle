import { describe, it, expect, beforeEach } from 'vitest';
import { ProceduralPixelGenerator } from '../src/creative/generator/ProceduralPixelGenerator';
import { validateObjectSpecification } from '../src/creative/schemas/specification';
import { AssetValidator } from '../src/creative/validator/AssetValidator';
import { ConstructionProjectManager } from '../src/creative/projects/ConstructionProjectManager';
import { ProvenanceTracker } from '../src/provenance/ProvenanceTracker';
import { ObjectSpecification } from '../src/types/creative';

describe('Phase 6 — Mindisle Creative Engine, Asset Pipeline & World Provenance', () => {
  let projectManager: ConstructionProjectManager;
  let provenanceTracker: ProvenanceTracker;

  beforeEach(() => {
    projectManager = ConstructionProjectManager.getInstance();
    projectManager.clearProjects();
    provenanceTracker = ProvenanceTracker.getInstance();
    provenanceTracker.clear();
  });

  describe('1. Scenario E — Open-Ended Invention & Specification Validation', () => {
    it('generates and validates an open-ended handcrafted wooden chair specification', () => {
      const chairSpec = ProceduralPixelGenerator.generateWoodenChair();

      const validation = validateObjectSpecification(chairSpec);
      expect(validation.success).toBe(true);
      expect(validation.data?.name).toBe('Handcrafted Wooden Stool');
      expect(validation.data?.category).toBe('furniture');
      expect(validation.data?.interaction).toBe('rest');
    });

    it('rejects an invalid specification with missing materials or invalid dimensions', () => {
      const invalidSpec = {
        name: 'Ghost Chair',
        category: 'furniture',
        pixelWidth: 999, // exceeds max 64
        pixelHeight: 16,
        materials: [], // empty materials array
        collision: { solid: true, width: 1, height: 1 },
        interaction: 'rest',
        pixelMatrix: { width: 16, height: 16, palette: ['#000000', '#ffffff'], data: [] },
      };

      const validation = validateObjectSpecification(invalidSpec);
      expect(validation.success).toBe(false);
      expect(validation.error).toBeDefined();
    });
  });

  describe('2. Pixel Art Actual Data & RGBA Conversion', () => {
    it('converts pixel matrix into a valid RGBA byte buffer with accurate alpha channel', () => {
      const chairSpec = ProceduralPixelGenerator.generateWoodenChair();
      const rgba = ProceduralPixelGenerator.matrixToRgba(chairSpec.pixelMatrix);

      // 16x16 sprite has 256 pixels * 4 channels (RGBA) = 1024 bytes
      expect(rgba.length).toBe(16 * 16 * 4);

      // Transparent pixel at (0, 0) should have Alpha = 0
      expect(rgba[3]).toBe(0);

      // Wood plank pixel at (5, 5) should have Alpha = 255 and non-zero RGB
      const index55 = (5 * 16 + 5) * 4;
      expect(rgba[index55 + 3]).toBe(255); // Opaque
      expect(rgba[index55]).toBeGreaterThan(0); // Red channel > 0
    });
  });

  describe('3. Automated Asset Validation', () => {
    it('validates a compliant procedural pixel-art asset', () => {
      const chairSpec = ProceduralPixelGenerator.generateWoodenChair();
      const result = AssetValidator.validate(chairSpec);

      expect(result.valid).toBe(true);
      expect(result.code).toBe('OK');
      expect(result.transparencyRatio).toBeGreaterThanOrEqual(0.15);
    });

    it('rejects a solid opaque box asset with insufficient transparency', () => {
      const opaqueSpec: ObjectSpecification = {
        name: 'Solid Cube Block',
        category: 'structure',
        pixelWidth: 16,
        pixelHeight: 16,
        materials: [{ materialId: 'stone', count: 4 }],
        collision: { solid: true, width: 1, height: 1 },
        interaction: 'none',
        pixelMatrix: {
          width: 16,
          height: 16,
          palette: ['#000000', '#94a3b8'],
          // Entire matrix filled with solid stone (index 1), 0% transparency
          data: Array(16).fill(0).map(() => Array(16).fill(1)),
        },
      };

      const result = AssetValidator.validate(opaqueSpec);
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INSUFFICIENT_TRANSPARENCY');
    });
  });

  describe('4. Multi-Step Construction & Immutable Provenance', () => {
    it('tracks construction lifecycle and produces an immutable ObjectProvenance record upon completion', () => {
      const chairSpec = ProceduralPixelGenerator.generateWoodenChair();

      // Step 1: Naufal proposes the project
      const project = projectManager.proposeProject(
        'naufal',
        chairSpec,
        { x: 13, y: 10 },
        'Need a comfortable seat near campfire',
        'Inspired by resting after chopping wood'
      );

      expect(project.status).toBe('APPROVED');
      expect(project.totalSteps).toBe(3); // 2 wood + 1 labor step

      // Step 2: Deposit wood logs
      projectManager.depositMaterials(project.id, 'wood_log', 2);
      expect(project.depositedMaterials['wood_log']).toBe(2);

      // Step 3: Labor steps
      const step1 = projectManager.performConstructionStep(project.id, 1, 14);
      expect(step1.complete).toBe(false);

      const step2 = projectManager.performConstructionStep(project.id, 1, 15);
      expect(step2.complete).toBe(false);

      const step3 = projectManager.performConstructionStep(project.id, 1, 16);
      expect(step3.complete).toBe(true);
      expect(step3.provenance).toBeDefined();

      // Step 4: Verify immutable provenance record in ProvenanceTracker
      const provenance = provenanceTracker.getProvenance(step3.provenance!.objectId);
      expect(provenance).toBeDefined();
      expect(provenance?.creatorId).toBe('naufal');
      expect(provenance?.objectName).toBe('Handcrafted Wooden Stool');
      expect(provenance?.inspiration).toContain('chop');
      expect(provenance?.location).toEqual({ x: 13, y: 10 });
      expect(provenance?.completedAtHour).toBe(16);

      // Step 5: Verify immutability (cannot re-record with duplicate objectId)
      expect(() => provenanceTracker.recordProvenance(provenance!)).toThrow(
        /Immutable Error/
      );
    });
  });
});
