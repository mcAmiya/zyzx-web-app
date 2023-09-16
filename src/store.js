export const useStore = defineStore('UserData', {
    // 转换为函数
    state: () => ({
        UserData: null,
    }),
    actions: {
        // mutation 现在可以成为 action 了，不再用 `state` 作为第一个参数，而是用 `this`。
        setUserData(content) {
            this.UserData = content;
        },
    },
    // 其他选项...
});
