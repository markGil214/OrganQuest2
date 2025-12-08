# Testing Guide for OrganQuest2

## Overview
This project uses **Jest** and **React Testing Library** for testing React components and JavaScript utilities.

## Setup
All testing dependencies are already installed. Configuration files:
- `jest.config.js` - Jest configuration
- `src/setupTests.js` - Test environment setup
- `__mocks__/fileMock.js` - Mock for static assets

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Files Created

### 1. **ToastContext.test.jsx**
Tests the Toast notification system:
- ✅ Success, error, warning, and info toasts
- ✅ Toast removal on close button click
- ✅ Toast display and functionality

### 2. **LanguageContext.test.jsx**
Tests the language context:
- ✅ Default language (English)
- ✅ Language switching (English ↔ Filipino)
- ✅ LocalStorage persistence

### 3. **Button.test.jsx**
Tests the Button UI component:
- ✅ Rendering with text
- ✅ Variant classes (default, outline)
- ✅ Disabled state
- ✅ Click handlers

### 4. **Card.test.jsx**
Tests the Card UI component:
- ✅ Rendering children
- ✅ Default classes
- ✅ Custom className props

### 5. **Home.test.jsx**
Tests the Home page:
- ✅ Page rendering
- ✅ Get Started button navigation
- ✅ OrganQuest title display

### 6. **organTracker.test.js**
Tests the organ tracking utility:
- ✅ Track organ exploration
- ✅ Organ name normalization
- ✅ Auth token handling
- ✅ Get organ progress

### 7. **QuizContainer.test.jsx**
Tests the quiz container component:
- ✅ Quiz container rendering
- ✅ Quiz state management
- ✅ Answer selection functionality
- ✅ Timer countdown
- ✅ Blocked quiz access handling

### 8. **MultipleChoiceQuiz.test.jsx**
Tests the multiple choice quiz page:
- ✅ Quiz page rendering
- ✅ Question display
- ✅ Answer selection

### 9. **MemoryMatchingGame.test.jsx**
Tests the memory matching game:
- ✅ Game board rendering
- ✅ Card flipping mechanics
- ✅ Moves counter
- ✅ Completion detection
- ✅ Back to menu button

### 10. **TimedChallengeQuiz.test.jsx**
Tests the timed challenge quiz:
- ✅ Timer display and countdown
- ✅ Score tracking
- ✅ Streak counter
- ✅ Answer submission
- ✅ Game ending
- ✅ Back to menu navigation

## Test Statistics
- **Total Test Suites**: 10
- **Total Tests**: 47 (44 passing, 3 skipped)
- **Coverage**: Contexts, Components, Pages, Utilities
- **Last Updated**: December 2025

## Writing New Tests

### Basic Test Structure
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  it('should do something', () => {
    render(<YourComponent />);
    
    const element = screen.getByText('Some Text');
    expect(element).toBeInTheDocument();
  });
});
```

### Testing Components with Context
```javascript
import { ToastProvider } from '../contexts/ToastContext';

render(
  <ToastProvider>
    <YourComponent />
  </ToastProvider>
);
```

### Testing User Interactions
```javascript
const button = screen.getByText('Click me');
fireEvent.click(button);

expect(mockFunction).toHaveBeenCalled();
```

### Testing Async Operations
```javascript
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

## Mocked Globals
The following are automatically mocked in tests:
- `localStorage`
- `sessionStorage`
- `fetch`
- `window.matchMedia`
- `console.error` and `console.warn`

## Coverage Thresholds
Current coverage requirements (set in `jest.config.js`):
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

## Best Practices
1. **Test behavior, not implementation**
2. **Use data-testid for complex selectors**
3. **Mock external dependencies**
4. **Keep tests isolated and independent**
5. **Write descriptive test names**
6. **Test edge cases and error states**

## Common Testing Patterns

### Testing API Calls
```javascript
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'test' })
  })
);
```

### Testing LocalStorage
```javascript
localStorage.getItem.mockReturnValue('test-value');
localStorage.setItem.mockImplementation(() => {});
```

### Testing Navigation
```javascript
window.location.hash = '';
// trigger navigation
expect(window.location.hash).toBe('#expected-route');
```

## Troubleshooting

### "Cannot find module" errors
- Ensure all imports use correct paths
- Check `moduleNameMapper` in `jest.config.js`

### CSS/Image import errors
- These are mocked by default via `jest.config.js`

### Async test timeouts
- Use `waitFor` for async operations
- Increase timeout if needed: `jest.setTimeout(10000)`

## Next Steps
1. Add more component tests for critical features
2. Increase test coverage above 50%
3. Add integration tests for user flows
4. Set up CI/CD to run tests automatically

## Resources
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
