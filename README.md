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
