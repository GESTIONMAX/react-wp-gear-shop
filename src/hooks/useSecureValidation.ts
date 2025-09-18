import { useState, useCallback } from 'react';
import { validateAndSanitize, createSecureValidator } from '@/utils/sanitization';

/**
 * Hook pour la validation et sanitisation sécurisée des formulaires
 */
export function useSecureValidation() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  /**
   * Valide et sanitise une valeur
   */
  const validateField = useCallback((
    fieldName: string,
    value: string,
    type: 'string' | 'email' | 'phone' | 'html' = 'string'
  ) => {
    const result = validateAndSanitize(value, type);

    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: result.errors
    }));

    return {
      isValid: result.isValid,
      sanitized: result.sanitized,
      errors: result.errors
    };
  }, []);

  /**
   * Valide un objet complet de données
   */
  const validateForm = useCallback((
    data: Record<string, { value: string; type?: 'string' | 'email' | 'phone' | 'html' }>
  ) => {
    const results: Record<string, any> = {};
    const allErrors: Record<string, string[]> = {};
    let isFormValid = true;

    for (const [fieldName, { value, type = 'string' }] of Object.entries(data)) {
      const result = validateAndSanitize(value, type);

      results[fieldName] = {
        isValid: result.isValid,
        sanitized: result.sanitized,
        errors: result.errors
      };

      allErrors[fieldName] = result.errors;

      if (!result.isValid) {
        isFormValid = false;
      }
    }

    setValidationErrors(allErrors);

    return {
      isFormValid,
      results,
      errors: allErrors
    };
  }, []);

  /**
   * Nettoie les erreurs de validation
   */
  const clearValidationErrors = useCallback((fieldName?: string) => {
    if (fieldName) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } else {
      setValidationErrors({});
    }
  }, []);

  /**
   * Obtient les erreurs pour un champ spécifique
   */
  const getFieldErrors = useCallback((fieldName: string) => {
    return validationErrors[fieldName] || [];
  }, [validationErrors]);

  /**
   * Vérifie si un champ a des erreurs
   */
  const hasFieldErrors = useCallback((fieldName: string) => {
    return (validationErrors[fieldName] || []).length > 0;
  }, [validationErrors]);

  return {
    validateField,
    validateForm,
    clearValidationErrors,
    getFieldErrors,
    hasFieldErrors,
    validationErrors,
    // Validators pour React Hook Form
    validators: {
      secureString: createSecureValidator('string'),
      secureEmail: createSecureValidator('email'),
      securePhone: createSecureValidator('phone'),
      secureHtml: createSecureValidator('html')
    }
  };
}

/**
 * Hook pour la validation en temps réel d'un champ
 */
export function useSecureField(
  initialValue: string = '',
  type: 'string' | 'email' | 'phone' | 'html' = 'string'
) {
  const [value, setValue] = useState(initialValue);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  const updateValue = useCallback((newValue: string) => {
    const result = validateAndSanitize(newValue, type);

    setValue(result.sanitized || '');
    setErrors(result.errors);
    setIsValid(result.isValid);

    return result;
  }, [type]);

  const clearErrors = useCallback(() => {
    setErrors([]);
    setIsValid(true);
  }, []);

  return {
    value,
    setValue: updateValue,
    errors,
    isValid,
    clearErrors,
    hasErrors: errors.length > 0
  };
}