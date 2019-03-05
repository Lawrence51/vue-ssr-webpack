import { createApp } from './app'

export default context => {
    //确保在所有的内容渲染前，服务器就已经准备就绪
    return new Promise((resolve, reject) => {
        const { app, router, store } = createApp()

        //设置服务器端 router 的位置
        router.push(context.url)

        //等到 router 将可能的异步组件和钩子函数解析完
        router.onReady(() => {
            const machedComponents = router.getMatchedComponents()

            if (!machedComponents.length) {
                return reject({ code: 404 })
            }

            Promise.all(machedComponents.map(Component => {
                if (Component.asyncData) {
                    return Component.asyncData({
                        store,
                        route: router.currentRoute
                    })
                }
            })).then(() => {
                // 在所有预取钩子(preFetch hook) resolve 后，
                // 我们的 store 现在已经填充入渲染应用程序所需的状态。
                // 当我们将状态附加到上下文，
                // 并且 `template` 选项用于 renderer 时，
                // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。 
                context.state = store.state
                resolve(app)
            }).catch(reject)
        }, reject)
    })
}