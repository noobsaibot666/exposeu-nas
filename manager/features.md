# Features

Short reference for ongoing feature work in Exposeu Manager.

## Budget control (resource management)
- Optional budget per project, tied to workflow steps.
- Project-level: production budget, profit target, VAT amount, notes.
- Profit target and VAT are percentage-based on total budget.
- Step-level: production cost, optional vendor name/cost.
- Production remaining is computed from step costs.
- Production remaining indicator updates as costs are allocated.
- Budgets persist even if a project or step is deleted.
- Budgets can be archived/restored or deleted independently.

## Workflow templates
- Steps support half-day offsets (stored as numeric offsets).
- Step defaults include a baseline cost value for budget allocation.
- Project creation supports calendar due dates per workflow step.
- Timeline shows step due dates as compact dots per project.

## User isolation + admin access
- Projects and budgets are owned by a user account.
- Non-admins only see their own projects/budgets.
- Admins can see all projects and access a user view switcher.
