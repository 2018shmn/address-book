### Contact Address Book

A full-stack React application built with Firebase, featuring comprehensive contact management and advanced filtering. Deployed on Vercel: [link](address-book-virid-nine.vercel.app).

### Core Functionality
- Contact Management: Create, edit, delete contacts with comprehensive information (personal, professional, social media)
- Advanced Filtering: Filter by tags, area codes, and sort by date/name in descending/ascending order
- Image Upload: Profile pictures via Firebase Storage
- User Authentication: Secure login/signup with Firebase Auth
- Real-time Sync: Live updates across sessions

### Enhanced User Experience

- Multi-tag: Categorize contacts (business, social, family, etc.)
- Social Media: Auto-format URLs for LinkedIn, Instagram, Facebook, X
- Mobile-Responsive: Optimized for all device sizes

### Tech Stack

Frontend: React, CSS, JavaScript

Backend: Firebase (Authentication, Firestore, Storage)

Deployment: Vercel


### Setup

### Prerequisites

- Node.js (v14+) and npm/yarn
- Firebase project with Auth, Firestore, and Storage enabled

### Clone and install

```bash
git clone [your-repo-url]
cd contact-management-app
npm install
```

### Configure Firebase

Create firebase.js:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Run locally
`bashnpm start`

### Project Structure
```
├── components/
│   ├── ContactForm.js      # Add/edit contact forms
│   ├── ContactList.js      # Contact display + management
│   ├── Filters.js          # Filtering + sorting
│   ├── Header.js           # App header
│   └── LoginForm.js        # Authentication
├── icons/                  # for contact forms
│   ├── email.jpg
│   ├── facebook.png
│   ├── instagram.png
│   ├── linkedin.png
│   ├── location.png
│   ├── phone.png
│   └── x.jpg
├── styles/globals.css      # Responsive styling
└── page.js                 # Main app component
```
