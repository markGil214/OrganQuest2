# Language Translation System - OrganQuest

## Overview
This translation system provides centralized language support for **English** and **Filipino** throughout the OrganQuest application.

## Files Created

### 1. `/src/data/translations.js`
Contains all English and Filipino translations organized by sections:
- `common` - General words (login, register, back, etc.)
- `login` - Login page text
- `register` - Registration page text
- `welcome` - Welcome page text
- `mainMenu` - Main menu text
- `quizMenu` - Quiz menu text
- `profile` - Profile modal text
- `scanExplore` - Scan & Explore page text
- `organs` - Organ names in both languages
- `quiz` - Quiz/game messages
- `admin` - Admin dashboard text
- `errors` - Error messages

### 2. `/src/contexts/LanguageContext.jsx`
React Context and hooks for managing language state:
- `LanguageProvider` - Wraps the app to provide language functionality
- `useLanguage` - Custom hook to access language features

## How to Use

### 1. Basic Setup (Already Done)
The `LanguageProvider` is already wrapped around your App in `main.jsx`:

```jsx
import { LanguageProvider } from './contexts/LanguageContext'

<LanguageProvider>
  <App />
</LanguageProvider>
```

### 2. Using Translations in Components

#### Import the hook:
```jsx
import { useLanguage } from '../contexts/LanguageContext';
```

#### In your component:
```jsx
function MyComponent() {
  const { t, ts, language, changeLanguage } = useLanguage();

  // Method 1: Get individual translation
  const title = t('login', 'title'); // Gets login.title in current language

  // Method 2: Get all translations for a section
  const loginText = ts('login'); // Gets all login translations
  
  return (
    <div>
      <h1>{loginText.title}</h1>
      <p>{loginText.subtitle}</p>
      
      {/* Language toggle button */}
      <button onClick={() => changeLanguage('filipino')}>
        Switch to Filipino
      </button>
    </div>
  );
}
```

### 3. Available Functions

#### `t(section, key)`
Get a single translation:
```jsx
const greeting = t('mainMenu', 'greeting'); // "Hello" or "Kumusta"
const loginBtn = t('common', 'login');      // "Login" or "Mag-login"
```

#### `ts(section)`
Get all translations for a section:
```jsx
const loginText = ts('login');
// Access: loginText.title, loginText.subtitle, etc.

const commonText = ts('common');
// Access: commonText.login, commonText.register, etc.
```

#### `changeLanguage(lang)`
Change the current language:
```jsx
changeLanguage('english');  // Switch to English
changeLanguage('filipino'); // Switch to Filipino
```

#### `language`
Current language string:
```jsx
if (language === 'english') {
  // Do something
}
```

#### `isEnglish` / `isFilipino`
Boolean helpers:
```jsx
if (isFilipino) {
  // Show Filipino-specific content
}
```

## Example: Converting a Page

### Before (LoginPage.jsx):
```jsx
<h2>Welcome Back!</h2>
<label>Username</label>
<button>Login</button>
```

### After (with translations):
```jsx
import { useLanguage } from '../contexts/LanguageContext';

function LoginPage() {
  const { ts } = useLanguage();
  const loginText = ts('login');
  
  return (
    <>
      <h2>{loginText.title}</h2>
      <label>{loginText.username}</label>
      <button>{loginText.loginButton}</button>
    </>
  );
}
```

## Example Files

### `/src/pages/LoginPageTranslated.jsx`
A complete example of LoginPage with translation support including:
- Language toggle button
- All text translated
- Error messages in both languages

## Language Storage

The language preference is automatically saved and synced:
1. **User Profile** - Saved in user document in MongoDB
2. **localStorage** - Stored in `appLanguage` and within `userData`
3. **Auto-sync** - When language changes, both are updated

## Adding New Translations

To add new translations, edit `/src/data/translations.js`:

```javascript
export const translations = {
  // Add new section
  myNewSection: {
    english: {
      greeting: 'Hello',
      message: 'Welcome to my section'
    },
    filipino: {
      greeting: 'Kumusta',
      message: 'Maligayang pagdating sa aking seksyon'
    }
  }
};
```

Then use it:
```jsx
const text = ts('myNewSection');
console.log(text.greeting); // "Hello" or "Kumusta"
```

## Available Sections

- `common` - General UI elements
- `login` - Login page
- `register` - Registration page
- `welcome` - Welcome screen
- `mainMenu` - Main navigation menu
- `quizMenu` - Quiz selection menu
- `profile` - User profile
- `scanExplore` - AR scanner menu
- `organs` - Organ names
- `quiz` - Quiz game text
- `admin` - Admin dashboard
- `errors` - Error messages

## Next Steps

To fully implement translations across your app:

1. Update each page component to import `useLanguage`
2. Replace hardcoded text with translation calls
3. Add a language toggle button in appropriate places
4. Test both English and Filipino versions

## Tips

- Use `ts()` for pages with lots of text (more efficient)
- Use `t()` for individual translations in small components
- The system falls back to English if a translation is missing
- Language persists across page refreshes
- Language syncs with user profile automatically
