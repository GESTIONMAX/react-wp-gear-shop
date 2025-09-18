import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ThemeToggle } from '../ThemeToggle'
import { ThemeProvider } from '../ThemeProvider'

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Moon: () => <div data-testid="moon-icon">Moon</div>,
  Sun: () => <div data-testid="sun-icon">Sun</div>,
}))

describe('ThemeToggle', () => {
  const renderWithTheme = (defaultTheme = 'system') => {
    return render(
      <ThemeProvider defaultTheme={defaultTheme as "light" | "dark" | "system"}>
        <ThemeToggle />
      </ThemeProvider>
    )
  }

  it('should render toggle button', () => {
    renderWithTheme()

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-haspopup', 'menu')
  })

  it('should have accessible dropdown trigger', () => {
    renderWithTheme()

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-haspopup', 'menu')
    expect(button).toHaveAttribute('data-state', 'closed')
  })

  it('should be keyboard accessible', () => {
    renderWithTheme()

    const button = screen.getByRole('button')

    // Should be focusable
    button.focus()
    expect(document.activeElement).toBe(button)

    // Should respond to keyboard events
    fireEvent.keyDown(button, { key: 'Enter' })
    // Theme toggle should be responsive to keyboard interaction
  })

  it('should render sun and moon icons', () => {
    renderWithTheme()

    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    renderWithTheme()

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')

    // Check for screen reader text
    expect(screen.getByText('Changer le thème')).toBeInTheDocument()
  })
})