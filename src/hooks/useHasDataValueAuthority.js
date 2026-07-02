import useSystemInfo from './useSystemInfo.js'

const useHasDataValueAuthority = () => {
    const { system, loading, error } = useSystemInfo()
    const authorities = system?.currentUser?.authorities ?? []
    const hasAuthority = loading
        ? null
        : authorities.includes('ALL') || authorities.includes('F_DATAVALUE_ADD')

    return { hasAuthority, loading, error }
}

export default useHasDataValueAuthority
