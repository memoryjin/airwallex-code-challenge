import axios from '../../common/api'

export const requestInvite = payload => axios.post('https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth', payload)