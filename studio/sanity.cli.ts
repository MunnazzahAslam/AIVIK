import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'qs3r3e0a',
    dataset: 'production',
  },
  // The Studio's address once deployed: https://aivik.sanity.studio
  studioHost: 'aivik',
  deployment: {
    appId: 'ii5abevvgqfc3kup0lqqafyj',
    autoUpdates: true,
  },
})
