---------------------------------------------------------WORKFLOW------------------------------------------------
# Start a new task
git checkout develop
git pull origin develop

# Create task branch
git checkout -b feature/task-name

# Work on feature

# Check changes
git status

# Add changes
git add .

# Commit
git commit -m "feat(scope): description"

# Push
git push -u origin feature/task-name

After the push, Git will usually show a message with a GitHub link or a prompt to create a Pull Request.

You can either click that link or go to:

GitHub Repository
→ Pull Requests
→ New Pull Request

Then set:

Base branch:    develop
Compare branch: feature/task-name

So:

feature/task-name
        ↓
   Pull Request
        ↓
      develop

Add:

Title — what you implemented
Description — what changed
Reviewer — relevant team member(s)
Assignee — yourself, if appropriate

Then click:

Create Pull Request


------------------------------------------------PROJECT STRUCTURE------------------------------------------------
# Secure DMS

Secure Digital Case and Document Management System.

## Project Structure

- `backend/` — Django REST API and backend services
- `frontend/` — React frontend
- `infrastructure/` — Docker and deployment configuration
- `docs/` — Architecture, API and security documentation
- `tests/` — Integration, security and end-to-end tests

## Development

Development setup instructions will be added as the project is initialized.
