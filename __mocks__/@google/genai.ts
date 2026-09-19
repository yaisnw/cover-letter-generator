export const mockGenerateContent = jest.fn();

export class GoogleGenAI {
  models = { generateContent: mockGenerateContent };
}
