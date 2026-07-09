# Distill Shortlist - Aura Project
# Generated: 2026-07-08

## Candidate 1: TypeScript Type Check Skill
- **Repeated workflow**: Run TypeScript type checking across projects
- **Evidence**: 6+ occurrences across heatline, AIS System projects
- **Frequency**: High (appears in almost every development session)
- **Recommended form**: Skill
- **Why**: Simple, repeatable command that improves development workflow
- **Status**: HIGH CONFIDENCE - Create

## Candidate 2: Node Process Killer Skill
- **Repeated workflow**: Kill worker Node.js processes before deployment
- **Evidence**: 5 occurrences in AIS System sessions
- **Frequency**: Medium (appears in deployment sessions)
- **Recommended form**: Skill
- **Why**: Saves time, prevents errors during deployment
- **Status**: HIGH CONFIDENCE - Create

## Candidate 3: Playwright Admin Testing Skill
- **Repeated workflow**: Test admin pages using Playwright browser automation
- **Evidence**: 8+ occurrences in heatline sessions
- **Frequency**: High (appears in admin development sessions)
- **Recommended form**: Skill
- **Why**: Complex workflow that benefits from consistent process
- **Status**: MEDIUM CONFIDENCE - Skip (project-specific, may not be reusable)

## Candidate 4: Supabase Edge Function Deployment Skill
- **Repeated workflow**: Deploy edge functions to Supabase
- **Evidence**: 5 occurrences in heatline sessions
- **Frequency**: Medium
- **Recommended form**: Skip
- **Why**: Project-specific, requires specific function configuration
- **Status**: LOW CONFIDENCE - Skip

## Candidate 5: Supabase SQL Execution Skill
- **Repeated workflow**: Execute SQL queries via Supabase MCP
- **Evidence**: 4 occurrences in AIS System sessions
- **Frequency**: Low
- **Recommended form**: Skip
- **Why**: Project-specific, requires specific database schema knowledge
- **Status**: LOW CONFIDENCE - Skip

## Candidate 6: Codebase Exploration Pattern
- **Repeated workflow**: Read key files before making changes
- **Evidence**: Multiple occurrences across projects
- **Frequency**: High
- **Recommended form**: Skip
- **Why**: This is a best practice, not a specific workflow to package
- **Status**: LOW CONFIDENCE - Skip

## Decision Summary
- **Create**: TypeScript Type Check Skill, Node Process Killer Skill
- **Skip**: Playwright Admin Testing, Supabase Edge Function Deployment, Supabase SQL Execution, Codebase Exploration Pattern
- **Reasoning**: Focus on the most reusable, high-frequency workflows that apply across projects
