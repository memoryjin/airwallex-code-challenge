export const isThenable = obj => typeof obj === 'object' && obj !== null && typeof obj.then === 'function'

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(window.navigator.userAgent)