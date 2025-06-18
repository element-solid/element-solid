import { Component, ParentProps, splitProps } from 'solid-js'
import { GlobalConfig, GlobalConfigContext } from '@element-solid/hooks'

const GlobalProvider: Component<ParentProps<GlobalConfig>> = (props) => {
  const [local, others] = splitProps(props, ['children'])
  return (
    <GlobalConfigContext.Provider value={others}>
      {local.children}
    </GlobalConfigContext.Provider>
  )
}

export default GlobalProvider
