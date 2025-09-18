/**
 * Utilitaires de sanitisation et validation pour la sécurité frontend
 */

// Expressions régulières de validation
const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[0-9\s\-()]{10,}$/,
  alphanumeric: /^[a-zA-Z0-9\s\-_]+$/,
  noScripts: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  sqlInjection: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
  xss: /(<script|<iframe|<object|<embed|javascript:|vbscript:|onload=|onclick=|onerror=)/gi,
} as const;

/**
 * Sanitise une chaîne de caractères en supprimant les caractères dangereux
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .replace(VALIDATION_PATTERNS.noScripts, '') // Supprime les scripts
    .replace(/[<>]/g, '') // Supprime < et >
    .replace(/['"]/g, (match) => match === '"' ? '&quot;' : '&#x27;') // Escape quotes
    .replace(/&(?!amp;|lt;|gt;|quot;|&#x27;)/g, '&amp;'); // Escape & non échappés
}

/**
 * Sanitise du HTML en supprimant tous les tags dangereux
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(VALIDATION_PATTERNS.noScripts, '')
    .replace(VALIDATION_PATTERNS.xss, '')
    .replace(/<[^>]*>/g, ''); // Supprime tous les tags HTML
}

/**
 * Valide et sanitise une adresse email
 */
export function sanitizeEmail(email: string): string | null {
  if (typeof email !== 'string') return null;

  const sanitized = email.trim().toLowerCase();

  // Validation basique
  if (!VALIDATION_PATTERNS.email.test(sanitized)) {
    return null;
  }

  // Vérifications de sécurité supplémentaires
  if (sanitized.includes('..') || sanitized.includes('--')) {
    return null;
  }

  return sanitized;
}

/**
 * Sanitise un numéro de téléphone
 */
export function sanitizePhone(phone: string): string | null {
  if (typeof phone !== 'string') return null;

  const sanitized = phone.replace(/[^+0-9\s\-()]/g, '').trim();

  if (!VALIDATION_PATTERNS.phone.test(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Détecte les tentatives d'injection SQL
 */
export function detectSqlInjection(input: string): boolean {
  if (typeof input !== 'string') return false;
  return VALIDATION_PATTERNS.sqlInjection.test(input);
}

/**
 * Détecte les tentatives XSS
 */
export function detectXSS(input: string): boolean {
  if (typeof input !== 'string') return false;
  return VALIDATION_PATTERNS.xss.test(input);
}

/**
 * Validation sécurisée pour les entrées utilisateur
 */
export function validateAndSanitize(input: string, type: 'string' | 'email' | 'phone' | 'html' = 'string'): {
  isValid: boolean;
  sanitized: string | null;
  errors: string[];
} {
  const errors: string[] = [];

  if (typeof input !== 'string') {
    return { isValid: false, sanitized: null, errors: ['Invalid input type'] };
  }

  // Détection d'attaques
  if (detectSqlInjection(input)) {
    errors.push('Potential SQL injection detected');
  }

  if (detectXSS(input)) {
    errors.push('Potential XSS attack detected');
  }

  // Sanitisation selon le type
  let sanitized: string | null = null;

  switch (type) {
    case 'email':
      sanitized = sanitizeEmail(input);
      if (!sanitized) errors.push('Invalid email format');
      break;

    case 'phone':
      sanitized = sanitizePhone(input);
      if (!sanitized) errors.push('Invalid phone format');
      break;

    case 'html':
      sanitized = sanitizeHtml(input);
      break;

    default:
      sanitized = sanitizeString(input);
  }

  return {
    isValid: errors.length === 0 && sanitized !== null,
    sanitized,
    errors
  };
}

/**
 * Middleware de validation pour les formulaires React Hook Form
 */
export function createSecureValidator(type: 'string' | 'email' | 'phone' | 'html' = 'string') {
  return (value: string) => {
    const result = validateAndSanitize(value, type);

    if (!result.isValid) {
      return result.errors.join(', ');
    }

    return true;
  };
}

/**
 * Sanitise les paramètres d'URL
 */
export function sanitizeUrlParams(params: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    const sanitizedKey = sanitizeString(key);
    const result = validateAndSanitize(value);

    if (result.isValid && result.sanitized) {
      sanitized[sanitizedKey] = result.sanitized;
    }
  }

  return sanitized;
}

/**
 * Validation des uploads de fichiers
 */
export function validateFileUpload(file: File): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  // Vérification du type MIME
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not allowed');
  }

  // Vérification de la taille
  if (file.size > maxSize) {
    errors.push('File too large (max 5MB)');
  }

  // Vérification du nom de fichier
  const sanitizedName = sanitizeString(file.name);
  if (sanitizedName !== file.name) {
    errors.push('Invalid filename');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}