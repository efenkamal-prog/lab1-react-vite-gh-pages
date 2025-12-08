import { useState } from 'react'

type Album = {
  userId: number
  id: number
  title: string
}

type Photo = {
  albumId: number
  id: number
}

type AlbumWithCount = Album & { photosCount: number }

export default function AlbumTable() {
  const [albums, setAlbums] = useState<AlbumWithCount[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAlbums = async () => {
    setLoading(true)
    setError(null)

    try {
      const resAlbums = await fetch('https://jsonplaceholder.typicode.com/albums')
      if (!resAlbums.ok) throw new Error('Ошибка при загрузке альбомов')

      const albumsList: Album[] = await resAlbums.json()

      const albumsWithCounts = await Promise.all(
        albumsList.map(async (album) => {
          const resPhotos = await fetch(
            `https://jsonplaceholder.typicode.com/photos?albumId=${album.id}`
          )
          if (!resPhotos.ok) throw new Error('Ошибка при загрузке фото')

          const photos: Photo[] = await resPhotos.json()
          return { ...album, photosCount: photos.length }
        })
      )

      setAlbums(albumsWithCounts)
    } catch (err) {
      setError('Ошибка при загрузке')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="album-table-container" style={{ marginTop: '40px' }}>
      <button onClick={fetchAlbums} disabled={loading}>
        {loading ? 'Загрузка...' : 'Загрузить альбомы'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {albums.length > 0 && (
        <table
          border={1}
          style={{ marginTop: '20px', borderCollapse: 'collapse', width: '100%' }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Количество фото</th>
            </tr>
          </thead>
          <tbody>
            {albums.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.title}</td>
                <td>{a.photosCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
