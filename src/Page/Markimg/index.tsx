import { createContext, useMemo, useState } from 'react'
import Controls from './components/Controls'
import Preview from './components/Preview'

/**
 * MarkimgContextType
 * - controls: 子组件（Controls）注册的内容（例如 form methods、watchedValues）
 * - setControls: 用于子组件把自己的数据注册到父级（index）中
 */
export type MarkimgContextType = {
  controls?: any
  setControls?: React.Dispatch<React.SetStateAction<any>>
} | null

// 创建并导出 Context，默认值为 null
export const MarkimgContext = createContext<MarkimgContextType>(null)

function Markimg() {
  // 存储 Controls 注册的数据（包含 form methods、watchedValues 等）
  const [controls, setControls] = useState<any>(null)

  const contextValue = useMemo(() => ({ controls, setControls }), [controls])

  return (
    <MarkimgContext.Provider value={contextValue}>

      <div className="flex w-full h-full gap-4">
        {/* <MarkimgContext.Provider value={{}}> */}
        <div className="flex-1 w-1/2 h-full">
          <Controls />
        </div>
        <div className="flex-1 w-1/2 h-full">
          <Preview />
        </div>
        {/* </MarkimgContext.Provider> */}
      </div>
    </MarkimgContext.Provider>
  )
}

export default Markimg
