// Add your prepared MotherDuck links before the event. No tokens belong here.
export const demoLinks = {
  flight: '',
  dive: 'https://app.motherduck.com/dives/dive-1906be4c-8caf-480d-b349-13783ed74f1f',
  agentSpacing: 'https://app.motherduck.com/dives/opencode-agents-dropping-spaces-24-october-c2ff248b-754f-45a8-b8f7-5a158b44f750',
}

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
