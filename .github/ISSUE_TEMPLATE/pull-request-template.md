---
name: Pull request template
about: Describe this issue template's purpose here.
title: ''
labels: ''
assignees: ''

---

---
name: Pull Request
about: Submit changes to AdventureNexus
title: '[PR]: '
labels: ['review-needed']
---

## 📝 **Description**
Brief description of the changes and which issue this PR addresses.

Fixes # (issue number)

## 🔄 **Type of Change**
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality not to work as expected)
- [ ] 📚 Documentation update
- [ ] 🎨 Style/UI changes
- [ ] ♻️ Code refactoring
- [ ] ⚡ Performance improvements
- [ ] 🧪 Tests

## 🎯 **Component**
- [ ] 🌐 Frontend (React/TypeScript)
- [ ] 🔧 Backend (Node.js/Express)
- [ ] 📊 Database (MongoDB)
- [ ] 🔐 Authentication (Clerk)
- [ ] 📱 Mobile responsiveness
- [ ] 🎨 UI/UX
- [ ] 📝 Documentation

## ✅ **Required Commit Message Format**
Your commit message **MUST** follow this exact format:
```
git commit -m "<action> <description> @<username> [<component>]"
```

### **Examples:**
```
# For adding a new feature
git commit -m "add: AI trip recommendation engine @johndoe [backend]"

# For fixing a bug  
git commit -m "fix: authentication redirect issue @janedoe [frontend]"

# For updating documentation
git commit -m "update: API documentation for user routes @developer [backend]"

# For removing deprecated code
git commit -m "remove: unused utility functions @coder [frontend]"

# For UI/styling changes
git commit -m "update: mobile responsive design for search page @designer [frontend]"
```

### **Action Keywords:**
- `add` - Adding new features, files, or functionality
- `fix` - Bug fixes or error corrections  
- `update` - Modifying existing features or updating dependencies
- `remove` - Deleting files, features, or deprecated code
- `refactor` - Code restructuring without changing functionality

### **Component Keywords:**
- `[frontend]` - React, TypeScript, UI components, styling
- `[backend]` - Node.js, Express, API routes, server logic

## 🧪 **Testing**
- [ ] Unit tests pass
- [ ] Integration tests pass  
- [ ] Manual testing completed
- [ ] Cross-browser testing (if frontend changes)
- [ ] Mobile testing (if responsive changes)
- [ ] API testing with Postman/Thunder Client (if backend changes)

**Test Details:**
Describe the tests you ran to verify your changes:
```
1. Test case 1
2. Test case 2  
3. Test case 3
```

## 📷 **Screenshots/Videos** (if applicable)
Add screenshots or videos to demonstrate your changes:

### Before:
<!-- Add before screenshot -->

### After:  
<!-- Add after screenshot -->

## ⚙️ **Configuration Changes**
- [ ] Environment variables added/modified
- [ ] Dependencies added/updated
- [ ] Database schema changes
- [ ] API endpoints added/modified

## 📋 **Checklist**
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## 🚨 **Commit Message Validation**
**Before submitting this PR, ensure your commit messages follow the required format:**

✅ **Correct Format:**
```
git commit -m "add: user profile settings page @myusername [frontend]"
```

❌ **Incorrect Format:**
```
git commit -m "Added user profile page"  # Missing username and component
git commit -m "fix bug"                   # Too vague, missing details
```

## 🔗 **Related Issues/PRs**
- Closes #(issue number)
- Related to #(issue number)
- Depends on #(PR number)

## 📝 **Additional Context**
Add any other context about the PR here:
- Migration steps (if any)
- Breaking changes impact
- Performance considerations
- Security implications

## 🤝 **Reviewers**
@username1 @username2 

---

## ⚠️ **Important Notes for Reviewers:**
1. ✅ Verify commit messages follow the format: `<action> <description> @<username> [<component>]`
2. 🧪 Test the changes in both development and staging environments
3. 📱 Check mobile responsiveness for frontend changes
4. 🔐 Review security implications for backend changes
5. 📚 Ensure documentation is updated if needed

**Thank you for contributing to AdventureNexus! 🚀**
```

## Additional Setup Files:

### 1. **Create `.github/pull_request_template.md`**
Save the above template as `.github/pull_request_template.md` in your repository root.

### 2. **Add Commit Message Hook (Optional)**
Create `.gitmessage` template file:
```bash
# Format: <action> <description> @<username> [<component>]
# Example: add: AI trip recommendation @johndoe [backend]
# 
# Actions: add, fix, update, remove, refactor
# Components: [frontend], [backend]
# 
# Keep first line under 72 characters
# Use imperative mood: "add" not "added"
```

### 3. **Repository Settings**
In your GitHub repository settings:
- Go to **Settings** → **General** → **Pull Requests**
- Enable "**Always suggest updating pull request branches**"
- Set **Merge button**: "Allow squash merging"  
- Set **Default commit message**: "Pull request title and description"

This template enforces your specific commit message format and provides clear guidelines for contributors to follow the required structure: `<action> <description> @<username> [<component>]`.[1][2][5]
