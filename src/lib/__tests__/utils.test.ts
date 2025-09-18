import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('bg-red-500', 'text-white')
      expect(result).toContain('bg-red-500')
      expect(result).toContain('text-white')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toContain('base-class')
      expect(result).toContain('active-class')
    })

    it('should handle falsy values', () => {
      const result = cn('base-class', false, null, undefined, 'valid-class')
      expect(result).toContain('base-class')
      expect(result).toContain('valid-class')
      expect(result).not.toContain('false')
      expect(result).not.toContain('null')
    })

    it('should merge conflicting Tailwind classes correctly', () => {
      // This depends on the tailwind-merge library
      const result = cn('bg-red-500', 'bg-blue-500')
      // Should keep the last bg- class
      expect(result).toContain('bg-blue-500')
      expect(result).not.toContain('bg-red-500')
    })

    it('should handle array inputs', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('class3')
    })

    it('should handle object inputs', () => {
      const result = cn({
        'active': true,
        'inactive': false,
        'base-class': true
      })
      expect(result).toContain('active')
      expect(result).toContain('base-class')
      expect(result).not.toContain('inactive')
    })

    it('should handle empty inputs', () => {
      expect(cn()).toBe('')
      expect(cn('')).toBe('')
      expect(cn(null)).toBe('')
      expect(cn(undefined)).toBe('')
    })

    it('should handle complex combinations', () => {
      const isActive = true
      const size = 'large'
      const result = cn(
        'base-component',
        {
          'component--active': isActive,
          'component--inactive': !isActive,
        },
        size === 'large' && 'component--large',
        'additional-class'
      )

      expect(result).toContain('base-component')
      expect(result).toContain('component--active')
      expect(result).toContain('component--large')
      expect(result).toContain('additional-class')
      expect(result).not.toContain('component--inactive')
    })

    it('should maintain class order for non-conflicting classes', () => {
      const result = cn('first', 'second', 'third')
      const parts = result.split(' ')
      expect(parts.indexOf('first')).toBeLessThan(parts.indexOf('second'))
      expect(parts.indexOf('second')).toBeLessThan(parts.indexOf('third'))
    })

    it('should handle whitespace correctly', () => {
      const result = cn('  class1  ', '  class2  ')
      expect(result.trim()).toBeTruthy()
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })
  })
})