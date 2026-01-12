/*

pseudo-code:

- for each set:
  - check if sheet exists
    - if not, create sheet
  - if so, ensure sheet in correct spot
  - ensure sheet has correct data
    - check header (owned, number, name)
    - check column values
      - owned should be booleans
      - numbers and names should be all present

Notes:
- optionally error if additional sheets exist?
- ensure sheets are set up correctly in reverse order
  - B1: blah, A4a: blah, A4: sure, etc.
  - error if any sheets have unexpected name
  - add missing sheet to front if needed

*/