/** Downloads Motion's layout-animation features on demand, for `<LazyMotion features={loadMotion}>`. */
export const loadMotion = () => import('@/lib/motionFeatures').then((module) => module.default)
