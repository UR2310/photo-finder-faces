
# PhotoFinder - Find Photos by Faces

PhotoFinder is a Django application that helps you easily find photos in your Google Photos library based on the people in them. The application uses advanced face detection and recognition to analyze your photos and make them searchable by faces.

## Features

- Connect to your Google Photos account
- Automatic face detection in your photos
- Name detected faces for easy filtering
- Filter photos by one or multiple faces
- View photos organized by the people in them
- Secure OAuth authentication with Google Photos

## Tech Stack

- **Backend**: Django, Django REST Framework
- **Database**: PostgreSQL (configurable)
- **Face Detection**: face_recognition library, OpenCV
- **Authentication**: Django auth, Google OAuth
- **Frontend**: HTML, Tailwind CSS

## Installation

### Prerequisites

- Python 3.8+
- pip
- virtualenv (recommended)
- PostgreSQL (optional, can use SQLite for development)

### Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/photofinder.git
   cd photofinder
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   SECRET_KEY=your_django_secret_key
   DEBUG=True
   GOOGLE_OAUTH2_CLIENT_ID=your_google_client_id
   GOOGLE_OAUTH2_CLIENT_SECRET=your_google_client_secret
   GOOGLE_OAUTH2_REDIRECT_URI=http://localhost:8000/photos/callback/
   ```

5. Run migrations:
   ```
   python manage.py migrate
   ```

6. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

7. Run the development server:
   ```
   python manage.py runserver
   ```

8. Visit `http://localhost:8000` in your browser.

## Google API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Photos Library API
4. Create OAuth 2.0 credentials
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:8000/photos/callback/`
5. Copy the Client ID and Client Secret to your `.env` file

## Usage

1. Register an account on the PhotoFinder application
2. Log in to your account
3. Connect your Google Photos account
4. Process your photos to detect faces
5. Name the detected faces
6. Use the filters to find photos with specific people

## Development

### Project Structure

The project follows a modular structure with Django apps:

- `apps/core`: Core application functionality
- `apps/photos`: Photo processing, face detection, and Google Photos integration
- `apps/users`: User authentication and profiles

### Running Tests

```
python manage.py test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Django Framework
- Google Photos API
- face_recognition library
- OpenCV project
