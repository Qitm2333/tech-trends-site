import { useState, useEffect } from 'react'
import { scanDailyFiles } from '../utils/fileScanner'

export function useDailyFiles() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadFiles = async () => {
      try {
        setLoading(true)
        const scannedFiles = await scanDailyFiles()
        setFiles(scannedFiles)
      } catch (err) {
        setError(err.message)
        console.error('扫描日报文件失败:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFiles()
  }, [])

  return { files, loading, error }
}
