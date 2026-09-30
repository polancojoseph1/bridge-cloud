// Just testing if the onSelect function reference changes on every render.
// Since ProviderSelector is a component, the arrow functions inside render `() => { onSelect(agent.id); setOpen(false); }` and `() => {}`
// create new function references every time ProviderSelector re-renders.
// This defeats React.memo() because the onSelect prop is always a new reference.
