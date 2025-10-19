# How to Implement Translation System - Step by Step

## Quick Implementation Guide

### Step 1: Update a Page Component

Here's how to convert any page to use translations in 3 simple steps:

#### Example: Converting LoginPage.jsx

**Step 1:** Import the hook at the top of your file
```jsx
import { useLanguage } from '../contexts/LanguageContext';
```

**Step 2:** Use the hook in your component
```jsx
function LoginPage() {
  // Add this line inside your component
  const { ts, language, changeLanguage } = useLanguage();
  
  // Get all translations for this page
  const loginText = ts('login');
  const commonText = ts('common');
  
  // ... rest of your code
}
```

**Step 3:** Replace hardcoded text with translation variables
```jsx
// Before:
<h2>Welcome Back!</h2>

// After:
<h2>{loginText.title}</h2>

// Before:
<button>Login</button>

// After:
<button>{loginText.loginButton}</button>
```

---

## Complete Example: LoginPage with Translations

I'll show you exactly what changes to make to your `LoginPage.jsx`:

### Changes Needed:

1. **Add import** (at the top):
```jsx
import { useLanguage } from '../contexts/LanguageContext';
```

2. **Add hook usage** (inside component, after state declarations):
```jsx
const { ts, language, changeLanguage } = useLanguage();
const loginText = ts('login');
```

3. **Add language toggle button** (add this near the top of your JSX):
```jsx
<div className="absolute top-4 right-4 z-20">
  <button
    onClick={() => changeLanguage(language === 'english' ? 'filipino' : 'english')}
    className="bg-white/90 hover:bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold text-purple-600 transition-all"
  >
    {language === 'english' ? '🇵🇭 Filipino' : '🇬🇧 English'}
  </button>
</div>
```

4. **Replace text strings**:

| Original | Replace With |
|----------|--------------|
| `"Welcome Back!"` | `{loginText.title}` |
| `"Login to continue your anatomy adventure"` | `{loginText.subtitle}` |
| `"Username"` | `{loginText.username}` |
| `"Password"` | `{loginText.password}` |
| `"Enter your username"` | `{loginText.usernamePlaceholder}` |
| `"Enter your password"` | `{loginText.passwordPlaceholder}` |
| `"Login"` | `{loginText.loginButton}` |
| `"Logging in..."` | `{loginText.loggingIn}` |
| `"Don't have an account?"` | `{loginText.noAccount}` |
| `"Create New Account"` | `{loginText.createAccount}` |

---

## Implementation Checklist

### ✅ For Each Page You Want to Translate:

1. [ ] Import `useLanguage` hook
2. [ ] Call the hook and get translations: `const pageText = ts('sectionName');`
3. [ ] Add language toggle button (optional, can be in one place like header)
4. [ ] Replace all hardcoded text with `{pageText.key}`
5. [ ] Test both English and Filipino

### 📄 Pages to Update (Priority Order):

1. **LoginPage.jsx** - Login screen
2. **RegisterPage.jsx** - Registration screen  
3. **MainMenu.jsx** - Main navigation
4. **WelcomePage.jsx** - Welcome screen
5. **QuizMenu.jsx** - Quiz selection
6. **ProfileModal.jsx** - User profile
7. **ScanExploreMenu.jsx** - AR menu
8. Quiz pages (MultipleChoiceQuiz, etc.)

---

## Real Example: I'll Update Your LoginPage Now

Let me update your actual LoginPage.jsx file to show you exactly how it works:

### What I'm Changing:

1. Adding the `useLanguage` hook import
2. Using translations instead of hardcoded text
3. Adding a language toggle button
4. Keeping all your existing functionality

The updated file will be fully functional and demonstrate the pattern you can follow for other pages.

---

## Quick Reference: Translation Sections

Use these section names with `ts()`:

```jsx
const commonText = ts('common');      // General UI words
const loginText = ts('login');        // Login page
const registerText = ts('register');  // Register page
const welcomeText = ts('welcome');    // Welcome screen
const menuText = ts('mainMenu');      // Main menu
const quizText = ts('quiz');          // Quiz messages
const organText = ts('organs');       // Organ names
const profileText = ts('profile');    // Profile modal
const errorText = ts('errors');       // Error messages
```

---

## Common Patterns

### Pattern 1: Simple Text Replacement
```jsx
// Before
<h1>Welcome</h1>

// After
const text = ts('welcome');
<h1>{text.greeting}</h1>
```

### Pattern 2: Language Toggle Button
```jsx
const { language, changeLanguage } = useLanguage();

<button onClick={() => changeLanguage(language === 'english' ? 'filipino' : 'english')}>
  {language === 'english' ? '🇵🇭 Filipino' : '🇬🇧 English'}
</button>
```

### Pattern 3: Conditional Text
```jsx
const { isFilipino, ts } = useLanguage();
const text = ts('mainMenu');

// Use text.greeting which will be "Hello" or "Kumusta"
<h2>{text.greeting}, {username}!</h2>
```

### Pattern 4: Error Messages
```jsx
const errorText = ts('errors');

setError(err.message || errorText.networkError);
```

---

## Testing Your Implementation

1. **Test English**:
   - Make sure all text shows correctly
   - No missing translations (check console for warnings)

2. **Test Filipino**:
   - Click language toggle
   - Verify all text changes to Filipino
   - Check that it makes sense in context

3. **Test Persistence**:
   - Change language
   - Refresh page
   - Language should stay the same

4. **Test After Login**:
   - User's saved language preference should load automatically

---

## Need Help?

- Check `/src/data/translations.js` for available translations
- Look at `/src/pages/LoginPageTranslated.jsx` for complete example
- All translations fall back to English if missing
- Console will warn if translation not found

