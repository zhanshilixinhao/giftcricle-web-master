const menuUrl = {
  state: {
    menuUrlName: ''
  },
  mutations: {
    SET_MENUURL: (state, menuUrl) => {
      state.menuUrlName = menuUrl
    }
  },
  actions: {
    GenerateMenuUrl({ commit }, data) {
      return new Promise(resolve => {
        commit('SET_MENUURL', data)
        resolve()
      })
    }
  }
}

export default menuUrl
