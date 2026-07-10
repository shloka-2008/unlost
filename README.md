# UNLOST - Lost and Found Management System

UNLOST is a centralized platform for reporting and recovering lost items on campus.

## Setup Instructions

### Prerequisites
- Python 3.x installed
- pip (Python package manager)

### Installation

1.  Navigate to the project directory:
    ```bash
    cd C:\Users\DAKSH\OneDrive\Documents\SD\UNLOST
    ```

2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

### Running the Application

1.  **Initialize Database with Dummy Data (Optional):**
    ```bash
    python create_dummy_data.py
    ```

2.  **Start the Server:**
    ```bash
    python app.py
    ```

3.  **Access the Website:**
    Open your browser and verify the site at: [http://127.0.0.1:5000](http://127.0.0.1:5000)

### Google Login Setup

Set these environment variables for Google OAuth:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://unlost-six.vercel.app/api/auth/google/callback
```

In Google Cloud Console, add the same exact URL to **Authorized redirect URIs**:

```text
https://unlost-six.vercel.app/api/auth/google/callback
```

For local Vite development, also add:

```text
http://localhost:5173/api/auth/google/callback
```

After deploying the backend, open this endpoint to verify the live redirect URI:

```text
/api/oauth/google/config
```

## Features
- **Report Lost/Found Items:** Submit details including images.
- **Search & Filter:** Find items by category, status, or date.
- **Responsive Design:** Works on mobile and desktop.
- **Contact Info:** Securely view contact details for items.
