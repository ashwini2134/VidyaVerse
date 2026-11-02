import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateSocraticDiagnosis, isBharatCodeConfigured } from '../bharatCodeService.js';
import { config } from '../../config.js';

// Mock config
vi.mock('../../config.js', () => ({
  config: {
    bharatCode: {
      apiKey: '',
      baseUrl: 'https://bharatcode.ai/api/model/v1',
      model: 'qwen-3.8-27b',
    },
  },
}));

describe('bharatCodeService', () => {
  describe('isBharatCodeConfigured', () => {
    it('returns false when API key is not configured', () => {
      expect(isBharatCodeConfigured()).toBe(false);
    });
  });

  describe('generateSocraticDiagnosis - Mock Mode', () => {
    it('returns mock response when no API key is configured', async () => {
      const params = {
        problemTitle: 'Test Problem',
        problemDescription: 'Test description',
        studentCode: 'print("hello")',
        failingTestCases: [
          {
            label: 'Output Check',
            expected: 'Hello, World!',
            actual: 'hello',
          },
        ],
      };

      const result = await generateSocraticDiagnosis(params);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.isMockMode).toBe(true);
        expect(result.rootCause).toBeDefined();
        expect(result.evidence).toBeDefined();
        expect(result.conceptClue).toBeDefined();
        expect(result.guidingQuestion).toBeDefined();
        expect(result.nextStep).toBeDefined();
      }
    });

    it('handles missing punctuation in output', async () => {
      const params = {
        problemTitle: 'Print with Punctuation',
        problemDescription: 'Print a name with a colon',
        studentCode: 'print("Name Lakshanya")',
        failingTestCases: [
          {
            label: 'Format Check',
            expected: 'Name: Lakshanya',
            actual: 'Name Lakshanya',
          },
        ],
      };

      const result = await generateSocraticDiagnosis(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.isMockMode).toBe(true);
      }
    });

    it('handles wrong capitalization', async () => {
      const params = {
        problemTitle: 'Capitalization Check',
        problemDescription: 'Print in proper case',
        studentCode: 'print("hello world")',
        failingTestCases: [
          {
            label: 'Case Check',
            expected: 'Hello World',
            actual: 'hello world',
          },
        ],
      };

      const result = await generateSocraticDiagnosis(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.isMockMode).toBe(true);
      }
    });

    it('handles missing output lines', async () => {
      const params = {
        problemTitle: 'Multiple Lines',
        problemDescription: 'Print multiple lines',
        studentCode: 'print("Line 1")',
        failingTestCases: [
          {
            label: 'Line Count',
            expected: 'Line 1\nLine 2',
            actual: 'Line 1',
          },
        ],
      };

      const result = await generateSocraticDiagnosis(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.isMockMode).toBe(true);
      }
    });

    it('handles incorrect variable usage', async () => {
      const params = {
        problemTitle: 'Variable Usage',
        problemDescription: 'Use the correct variable',
        studentCode: 'x = 5\nprint(y)',
        failingTestCases: [
          {
            label: 'Variable Check',
            expected: '5',
            actual: 'Error',
          },
        ],
      };

      const result = await generateSocraticDiagnosis(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.isMockMode).toBe(true);
      }
    });

    it('handles syntax errors', async () => {
      const params = {
        problemTitle: 'Syntax Check',
        problemDescription: 'Write valid Python',
        studentCode: 'print("hello"',
        failingTestCases: [
          {
            label: 'Syntax Check',
            expected: 'hello',
            actual: 'SyntaxError',
          },
        ],
      };

      const result = await generateSocraticDiagnosis(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.isMockMode).toBe(true);
      }
    });

    it('handles multiple failed test cases', async () => {
      const params = {
        problemTitle: 'Multiple Tests',
        problemDescription: 'Pass all tests',
        studentCode: 'print("test")',
        failingTestCases: [
          {
            label: 'Test 1',
            expected: 'output1',
            actual: 'test',
          },
          {
            label: 'Test 2',
            expected: 'output2',
            actual: 'test',
          },
        ],
      };

      const result = await generateSocraticDiagnosis(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.isMockMode).toBe(true);
      }
    });

    it('limits code size to prevent oversized requests', async () => {
      const longCode = 'x'.repeat(10000);
      const params = {
        problemTitle: 'Large Code',
        problemDescription: 'Test',
        studentCode: longCode,
        failingTestCases: [
          {
            label: 'Test',
            expected: 'output',
            actual: longCode.slice(0, 100),
          },
        ],
      };

      const result = await generateSocraticDiagnosis(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.isMockMode).toBe(true);
      }
    });
  });
});
