import { createApp }  from './app'

const { app, router, store } = createApp();

//这里假定 App.vue ，模板中根元素具有 `id="app"`
router.onReady( () => {
    if (window.__INITIAL_STATE__) {
        store.replaceState(window.__INITIAL_STATE__)
      }
    app.$mount('#app')
})
