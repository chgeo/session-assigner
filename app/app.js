/* global Vue axios */ //> from vue.html
const $ = sel => document.querySelector(sel)
const GET = (url) => axios.get('/api/assign'+url)
const POST = (cmd,data) => axios.post('/api/assign'+cmd,data)

const app = Vue.createApp ({

  data() {
    return {
      name: new URL(location.href).searchParams.get('name'),
      session_ID: new URL(location.href).searchParams.get('session') || 'TechEd-AD264',
      assignment: {},
    }
  },

  methods: {

    async assign () {
      const { name, session_ID } = app
      try {
        const res = await POST(`/SessionAssignments`, { name, session_ID })
        app.assignment = res.data

        const url = new URL(location.href)
        url.searchParams.set('name', name)
        url.searchParams.set('session', session_ID)
        history.pushState(null, '', url)

        app.getAssignment()

      } catch (e) {
        app.assignment = { failed: e.response.data.error ? e.response.data.error.message : e.response.data }
      }
    },

    async getAssignment() {
      const { name, session_ID } = app
      if (name && session_ID) {
        try {
          const res = await GET(`/SessionAssignments(name='${encodeURIComponent(name)}',session_ID='${encodeURIComponent(session_ID)}')/credentials`)
          Object.assign(app.assignment, res.data)

        } catch (e) {
          if (e.response?.status !== 404)
            app.assignment = { failed: e.response.data.error ? e.response.data.error.message : e.response.data }
        }
      }
    }

  }
}).mount('#app')

app.getAssignment()
