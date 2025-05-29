// Utility functions for backend
export function normalizeClassCode(classCode) {
  return classCode.toLowerCase().replace(/[\s\-\/]+/g, '');
}
