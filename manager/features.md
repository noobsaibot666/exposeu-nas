# Features

Short reference for ongoing feature work in Exposeu Manager.

## Budget control (resource management)
- Optional budget per project, tied to workflow steps.
- Project-level: production budget, profit target, VAT amount, notes.
- Profit target and VAT are percentage-based on total budget.
- Step-level: production cost, optional vendor name/cost.
- Production remaining is computed from step costs.
- Budgets persist even if a project or step is deleted.
- Budgets can be archived/restored or deleted independently.

## User isolation + admin access
- Projects and budgets are owned by a user account.
- Non-admins only see their own projects/budgets.
- Admins can see all projects and access a user view switcher.
