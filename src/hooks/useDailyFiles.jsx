import { createContext, useContext, useEffect, useState } from 'react'
import { scanDailyFiles } from '../utils/fileScanner'

const DailyFilesContext = createContext(null)

function useProvideDailyFiles() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadFiles = async () => {
      try {
        setLoading(true)
        const scannedFiles = await scanDailyFiles()
        if (isMounted) {
          setFiles(scannedFiles)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || '鏂囦欢鍔犺浇澶辫触')
        }
        console.error('鎵弿鏃ユ姤鏂囦欢澶辫触:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadFiles()

    return () => {
      isMounted = false
    }
  }, [reloadKey])

  const refresh = () => setReloadKey((key) => key + 1)

  return { files, loading, error, refresh }
}

export function DailyFilesProvider({ children }) {
  const value = useProvideDailyFiles()
  return <DailyFilesContext.Provider value={value}>{children}</DailyFilesContext.Provider>
}

export function useDailyFiles() {
  const context = useContext(DailyFilesContext)
  if (!context) {
    throw new Error('useDailyFiles 涓埌 DailyFilesProvider 鐩稿叧鐜鍐呴槄鐢?')
  }
  return context
}
