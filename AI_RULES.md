# AI Rules for This App

## Tech stack (5–10 bullets)
- **React + TypeScript** for all UI and application logic.
- **React Router** for client-side routing (**routes live in `src/App.tsx`**).
- **Tailwind CSS** for all styling (utility-first classes; avoid custom CSS unless necessary).
- **shadcn/ui** as the default component library (built on Radix UI primitives).
- **Radix UI** for accessible UI primitives when a shadcn/ui wrapper is not available.
- **lucide-react** for icons.
- **App structure**: pages in `src/pages/`, reusable UI in `src/components/`, and the default page is `src/pages/Index.tsx`.

## Library and implementation rules

### UI components
1. **Use shadcn/ui first**
   - Prefer importing from `src/components/ui/*` (e.g., `button`, `card`, `dialog`, `tabs`, `input`, etc.).
   - Do **not** edit shadcn/ui component source files; compose them in new components instead.

2. **Use Radix UI only when shadcn/ui doesn’t cover it**
   - If you need a primitive that shadcn/ui doesn’t expose, use the corresponding Radix package directly.
   - Wrap Radix primitives in a small component in `src/components/` if reuse is likely.

3. **Icons**
   - Use **lucide-react** icons exclusively.

### Styling
4. **Tailwind CSS only**
   - Style with Tailwind utility classes.
   - Avoid adding new CSS files and avoid inline style objects unless absolutely required.

5. **Design consistency**
   - Use shadcn/ui tokens and patterns (variants, sizes) to keep a consistent look and feel.

### Routing and pages
6. **Routing**
   - Define/modify routes only in `src/App.tsx`.

7. **Pages vs. components**
   - Put route-level screens in `src/pages/`.
   - Put reusable building blocks in `src/components/`.

8. **Visibility requirement**
   - New components must be rendered from a page (typically `src/pages/Index.tsx`) so they appear in the app.

### Code quality and conventions
9. **TypeScript-first**
   - Prefer explicit types for props and shared data structures.
   - Avoid `any` unless there is no reasonable alternative.

10. **Keep it simple**
   - Implement the smallest change that satisfies the requirement.
   - Avoid overengineering, unnecessary abstractions, and unused dependencies.
