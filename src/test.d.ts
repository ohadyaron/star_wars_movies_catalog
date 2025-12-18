/// <reference types="jasmine" />

// Override Chai's Assertion interface (from Cypress) with Jasmine matchers for .spec.ts files
declare global {
  namespace Chai {
    interface Assertion {
      toBe(expected: any, expectationFailOutput?: any): void;
      toEqual(expected: any, expectationFailOutput?: any): void;
      toBeTruthy(expectationFailOutput?: any): void;
      toBeFalsy(expectationFailOutput?: any): void;
      toContain(expected: any, expectationFailOutput?: any): void;
      toHaveBeenCalled(): void;
      toHaveBeenCalledWith(...params: any[]): void;
    }
  }
}

export {};
