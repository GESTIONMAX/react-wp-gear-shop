import { describe, it, expect } from 'vitest'
import {
  sanitizeEmail,
  sanitizePhone,
  isValidEmail,
  isValidPhone,
  detectXSS,
  detectSqlInjection
} from '../sanitization'

describe('Sanitization Utils', () => {
  describe('detectXSS', () => {
    it('should detect XSS patterns', () => {
      expect(detectXSS('<script>')).toBe(true)
      expect(detectXSS('javascript:')).toBe(true)
      expect(detectXSS('<iframe')).toBe(true)
      expect(detectXSS('onerror=')).toBe(true)
      expect(detectXSS('onclick=')).toBe(true)
    })

    it('should not flag safe content', () => {
      const safeInputs = [
        'Normal text content',
        'Numbers: 123456',
        'Safe HTML like <b>bold</b>',
        'Email: user@example.com'
      ]

      safeInputs.forEach(input => {
        expect(detectXSS(input)).toBe(false)
      })
    })

    it('should handle edge cases', () => {
      expect(detectXSS('')).toBe(false)
      expect(detectXSS(null as any)).toBe(false)
      expect(detectXSS(undefined as any)).toBe(false)
    })
  })

  describe('detectSqlInjection', () => {
    it('should detect SQL injection keywords', () => {
      expect(detectSqlInjection('DROP TABLE users')).toBe(true)
      expect(detectSqlInjection('SELECT * FROM users')).toBe(true)
      expect(detectSqlInjection('INSERT INTO table')).toBe(true)
      expect(detectSqlInjection('DELETE FROM users')).toBe(true)
      expect(detectSqlInjection('UNION SELECT password')).toBe(true)
    })

    it('should not flag normal text', () => {
      const normalInputs = [
        'Hello world',
        'user@example.com',
        '123456',
        'Normal sentence with words'
      ]

      normalInputs.forEach(input => {
        expect(detectSqlInjection(input)).toBe(false)
      })
    })
  })

  describe('sanitizeEmail', () => {
    it('should validate correct emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ]

      validEmails.forEach(email => {
        expect(sanitizeEmail(email)).toBe(email)
      })
    })

    it('should reject invalid emails', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test..test@example.com'
      ]

      invalidEmails.forEach(email => {
        expect(sanitizeEmail(email)).toBeNull()
      })
    })

    it('should handle edge cases', () => {
      expect(sanitizeEmail('')).toBeNull()
      expect(sanitizeEmail(null as any)).toBeNull()
      expect(sanitizeEmail(undefined as any)).toBeNull()
    })
  })

  describe('sanitizePhone', () => {
    it('should validate correct phone numbers', () => {
      const validPhones = [
        '+33123456789',
        '0123456789',
        '+1 (555) 123-4567',
        '555-123-4567'
      ]

      validPhones.forEach(phone => {
        const result = sanitizePhone(phone)
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
      })
    })

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        '123',
        'abc',
        '++123456789',
        '<script>alert("xss")</script>'
      ]

      invalidPhones.forEach(phone => {
        expect(sanitizePhone(phone)).toBeNull()
      })
    })

    it('should clean phone format', () => {
      const phone = '+33 1 23 45 67 89'
      const result = sanitizePhone(phone)
      expect(result).toMatch(/^[+0-9\s\-()]+$/)
    })
  })

})