---
inclusion: auto
---

# Commit Discipline: The 150-150-CR Rule

## Philosophy

Large code reviews take longer for reviewers, result in multiple iterations, and make it harder to get quality feedback. This project follows the **150-150-CR rule** for optimal code review hygiene.

## The 150-150-CR Rule

An optimum code review has **at most 300 lines of changes**:
- **150 lines** of changes to source code
- **150 lines** of changes to tests

This allows:
- ✅ Early feedback
- ✅ Avoids large refactoring
- ✅ Fewer iterations
- ✅ Reduces reviewer time
- ✅ Faster merge cycles

## Best Practices

### 1. Limit Changes Per Commit
- Keep total changes to **150-150 or less**
- Break large features into smaller, logical commits
- Each commit should be a complete, reviewable unit of work

### 2. Commit Frequency
- Submit **at least one commit per day** when actively working
- Don't accumulate changes over multiple days
- Commit early, commit often

### 3. Review Cycle
Follow this ideal cycle:
- **Day 1**: Publish the commit/PR
- **Day 2**: Get it reviewed and address feedback
- **Day 3**: Merge to main

## Guidelines for Kiro Agent

When implementing features or fixes:

### ✅ DO:
- Break large features into multiple small commits
- Each commit should be independently reviewable
- Aim for 100-200 total lines changed per commit
- Create logical breakpoints (e.g., "Add data structure", "Add UI component", "Add tests")
- Commit working, tested code frequently
- Write clear commit messages explaining the "why"

### ❌ DON'T:
- Accumulate 500+ lines of changes before committing
- Mix unrelated changes in a single commit
- Create commits that break the build
- Wait until a feature is "perfect" before committing
- Bundle refactoring with new features in the same commit

## Breaking Down Large Features

When a feature requires more than 300 lines:

1. **Identify logical boundaries**:
   - Data layer changes
   - UI component additions
   - Business logic updates
   - Test additions
   - Documentation updates

2. **Create a commit sequence**:
   ```
   Commit 1: Add workout history data structure (120 lines)
   Commit 2: Add localStorage persistence layer (150 lines)
   Commit 3: Add history UI component (180 lines)
   Commit 4: Add history tests (140 lines)
   Commit 5: Update documentation (50 lines)
   ```

3. **Each commit should**:
   - Build successfully
   - Not break existing functionality
   - Be independently reviewable
   - Have a clear purpose

## Commit Message Format

Use clear, descriptive commit messages:

```
<type>: <short summary> (max 50 chars)

<detailed description of what and why>
- Bullet points for key changes
- Reference issues if applicable

Lines changed: ~XXX source, ~XXX test
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `test`, `style`, `chore`

**Example**:
```
feat: add completion celebration animation

Implements the user-requested celebration when all exercises
are completed. Adds confetti animation and success message.

- Add confetti.js library (lightweight, 2KB)
- Create celebration overlay component
- Trigger on final exercise completion
- Add tests for completion detection

Lines changed: ~120 source, ~80 test
Addresses: User feedback from HCI evaluation
```

## Exceptions

Small exceptions to the 150-150 rule are acceptable for:
- **Generated code** (e.g., package-lock.json, build artifacts)
- **Data files** (e.g., adding new exercises to workouts.json)
- **Asset additions** (e.g., new GIF files)
- **Documentation** (e.g., comprehensive README updates)

For these cases, separate them into their own commits:
```
Commit 1: Add 10 new exercises to database (data only)
Commit 2: Add UI to display new exercises (150 lines)
```

## Benefits of This Approach

1. **Faster Reviews**: Reviewers can provide feedback in minutes, not hours
2. **Better Quality**: Smaller changes are easier to reason about
3. **Easier Rollback**: If something breaks, smaller commits are easier to revert
4. **Clear History**: Git history tells a clear story of feature development
5. **Reduced Conflicts**: Smaller, frequent commits reduce merge conflicts
6. **Continuous Progress**: Daily commits show steady progress

## Measuring Success

Track these metrics:
- Average lines changed per commit: **Target < 300**
- Commits per active day: **Target ≥ 1**
- Time from commit to merge: **Target ≤ 3 days**

---

**Remember**: The goal is not to artificially split code, but to work in small, logical increments that are easy to review and integrate. Think in terms of "What's the smallest complete change I can make?"
