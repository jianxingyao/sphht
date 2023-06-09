import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // 登录 actions
  async login({ commit }, userInfo) {
    // 解构密码 账号
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    const { data } = result
    if(result.code === 20000){
      commit('SET_TOKEN', data.token)
      setToken(data.token)
      return 'ok'
    }else{
      return new Promise.reject(new Error('登录失败了'))
    }
  },

  // get user info 获取用户信息actions
  async getInfo({ commit, state }) {
    const result = await getInfo(state.token)
    // const { data } = result
    // console.log(result);
    // if(result.code === 20000 || result.code === 200){
    //   if (!data) {
    //     return reject('Verification failed, please Login again.')
    //   }
    //   console.log('1223');
    //   const { name, avatar } = data

    //   commit('SET_NAME', name)
    //   commit('SET_AVATAR', avatar)
    //   resolve(data)
    //   return 'ok'
    // }else{
    //   return new Promise.reject(new Error('fail'))
    // }
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

